'use client'
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartItems } from '@/app/cart/useCartItems';
import { Button, Radio } from '@mui/material';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { removeCoupon } from '@/app/cart/couponSlice';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';


type Product = {
    price: number;
    discount: number;
};

type CartItem = {
    quantity: number;
    products: Product;
};

type Cart = {
    cart?: {
        items?: CartItem[];
    };
};

type RazorpayResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
};

type OrderData = {
    _id: string;
    razorpayOrderId: string;
    amount: number;
};

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        document.body.appendChild(script);
    });
};

export default function PaymentMode() {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const [selectedValue, setSelectedValue] = React.useState('');
    const { data: cart } = useCartItems()
    const { selectedAddressId } = useAppSelector((state) => state.addressSlice);
    const { discount: couponDiscount, couponCode, appliedCoupon } = useAppSelector((state) => state.couponSlice);
    const { user } = useAppSelector((state) => state.authSlice);
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch()
    const router = useRouter()
    const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
    };
    const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL

    //console.log(selectedValue,'selectedValue');



    const handleChange =
        (panel: string) =>
            (event: React.SyntheticEvent, isExpanded: boolean) => {
                setExpanded(isExpanded ? panel : false);
            };

    const cartTotalPrice = Array.isArray(cart?.cart?.items)
        ? cart.cart.items.reduce((acc: number, item: CartItem) => {
            const price = item?.products?.price || 0;
            const discount = item?.products?.discount || 0;
            const totalmrp = price * (discount / 100) + price
            const quantity = item?.quantity || 1;
            return acc + totalmrp * quantity;
        }, 0)
        : 0;

    const totalDiscount = Array.isArray(cart?.cart?.items)
        ? cart.cart.items.reduce((acc: number, item: CartItem) => {
            const price = item?.products?.price || 0;
            const quantity = item?.quantity || 1;
            const discountPercent = item?.products?.discount || 0;
            const discountAmount = price * quantity * (discountPercent / 100);
            return acc + discountAmount;
        }, 0)
        : 0;

    const subTotal = cartTotalPrice;
    const serviceCharge = 0;
    const shipping = 0;
    const grandTotal = subTotal + serviceCharge + shipping - totalDiscount - (couponDiscount || 0);


    const handleOrderPlace = async () => {
        if (selectedValue !== "COD" && selectedValue !== "ONLINE") {
            dispatch(showSnackbar({ message: "Please select payment method", variant: "warning" }));
            return;
        }
        const payload = {
            "addressId": selectedAddressId || "",
            "totalAmount": grandTotal,
            "paymentMethod": selectedValue,
            ...(appliedCoupon
                ? {
                    couponCode: couponCode,
                    couponDiscount: couponDiscount || 0,
                }
                : {}),
        }

        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ORDERPLACE);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            payload as any
        );

        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data;
    }

    const handleOnlinePayment = async () => {
        const payload = {
            couponCode: couponCode
        }
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.razorpayOrder);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            payload as any
        );
        const response = await fetch(apiUri, requestOptions);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        await openRazorpay(data);

    };

    const mutation = useMutation({
        mutationFn: handleOrderPlace,
        onSuccess: async (data) => {

            // 🧠 CASE 1: COD
            if (selectedValue === "COD") {

                dispatch(showSnackbar({ message: data.message, variant: "success" }));

                if (appliedCoupon) {
                    dispatch(removeCoupon());
                }

                // ✅ CART CLEAR ONLY FOR COD
                const cartQueryKey = ["cartItems", user?._id ?? "guest"];

                queryClient.setQueryData(cartQueryKey, (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        cart: {
                            ...(oldData.cart || {}),
                            items: [],
                        },
                    };
                });

                // ✅ REDIRECT ONLY FOR COD
                router.push('/order-success');

                queryClient.invalidateQueries({ queryKey: cartQueryKey });

            }

        },
        onError: (error) => {
            dispatch(showSnackbar({ message: error.message, variant: "error" }))
        }
    })

    const openRazorpay = async (orderData: OrderData) => {
        const res = await loadRazorpay();

        if (!res) {
            alert("Razorpay SDK failed");
            return;
        }

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: "INR",
            order_id: orderData.razorpayOrderId,

            handler: async function (response: RazorpayResponse) {

                try {
                    const payload = {
                        ...response,
                        addressId: selectedAddressId,
                        couponCode: couponCode,
                    }

                    const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.verifyPayment);
                    const requestOptions = API_CONFIG.createRequestOptions(
                        API_CONFIG.HTTP_METHODS.POST,
                        payload as any
                    );
                    const verifyRes = await fetch(apiUri, requestOptions);

                    const data = await verifyRes.json();

                    if (!verifyRes.ok || !data.success) {
                        alert("Payment verification failed");
                        return;
                    }

                    // ✅ SUCCESS → redirect
                    if (data.success) {

                        // ✅ cart UI update
                        queryClient.setQueryData(["cartItems", user?._id ?? "guest"], {
                            cart: { items: [] }
                        });

                        queryClient.invalidateQueries({
                            queryKey: ["cartItems", user?._id ?? "guest"]
                        });

                        router.push("/order-success");
                    }

                } catch (err) {
                    console.error(err);
                    alert("Something went wrong");
                }
            },

            modal: {
                ondismiss: function () {
                    console.log("Payment popup closed");
                }
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    return (
        <div className='pt-4 mb-3'>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography component="span" >
                        Cash On Delivery (Cash/UPI)
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='flex items-center'>
                        <div>
                            <Radio
                                checked={selectedValue === 'COD'}
                                onChange={handleChangeRadio}
                                value="COD"
                                name="radio-buttons"
                                slotProps={{ input: { 'aria-label': 'COD' } }}
                            />
                        </div>
                        <h3 className='font-bold'>COD (Cash/UPI)</h3>
                    </div>
                    <p className='text-[13px] py-2'>For this option, there is a fees of 10rs. To avoid this fees you can online.</p>
                    <Button
                        onClick={() => {
                            if (selectedValue === "COD") {
                                mutation.mutate();
                            } else if (selectedValue === "ONLINE") {
                                handleOnlinePayment();
                            }
                        }}
                        disabled={mutation.isPending}
                        variant="contained"
                        sx={{ backgroundColor: "#313647", minWidth: { xs: '100%', md: '300px' }, textTransform: "capitalize" }}
                    >
                        {mutation.isPending ? 'Placing Order...' : 'Place Order'}
                    </Button>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Typography component="span" >
                        UPI (Pay via any App)
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='flex items-center'>
                        <div>
                            <Radio
                                checked={selectedValue === 'ONLINE'}
                                onChange={handleChangeRadio}
                                value="ONLINE"
                                name="radio-buttons"
                                slotProps={{ input: { 'aria-label': 'ONLINE' } }}
                            />
                        </div>
                        <Typography>
                            Coming Soon
                        </Typography>
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3bh-content"
                    id="panel3bh-header"
                >
                    <Typography component="span" >
                        Credit/Debit Card
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Coming Soon
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4bh-content"
                    id="panel4bh-header"
                >
                    <Typography component="span" >
                        Pay Later
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                        amet egestas eros, vitae egestas augue. Duis vel est augue.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
