'use client'
import * as React from 'react';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartItems } from '@/app/cart/useCartItems';
import { Button, Radio } from '@mui/material';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { removeCoupon } from '@/app/cart/couponSlice';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import Image from 'next/image';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';


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
    //const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL

    //console.log(selectedValue,'selectedValue');


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
            <div className={`${selectedValue === 'COD' ? 'border-2 border-purple-400 bg-purple-50 rounded-2xl' : 'border-2 border-gray-200 rounded-2xl'} px-1 lg:px-5 py-5 lg:py-10`}>
                <div className='flex items-center lg:gap-x-2'>
                    <div>
                        <Radio
                            color="secondary"
                            checked={selectedValue === 'COD'}
                            onChange={handleChangeRadio}
                            value="COD"
                            name="radio-buttons"
                            slotProps={{ input: { 'aria-label': 'COD' } }}
                        />
                    </div>
                    <div className='flex items-center gap-x-4'>
                        <div className='bg-purple-100 p-3 rounded-lg'>
                            <Image className='w-6 lg:w-12' src='/assets/img/tracking.png' alt='cod' width={60} height={60} />
                        </div>
                        <div>
                            <h3 className='font-bold text-[18px]'>Cash On Delivery (Cash/UPI)</h3>
                            <div className='mb-2 bg-green-100 rounded-full inline-flex px-3 py-[2px] gap-x-1 items-center'>
                                <CreditCardOutlinedIcon fontSize='small' sx={{ color: '#008236' }} />
                                <span className='text-[13px] text-center text-green-700 mt-1'>Pay when you receive your order</span>
                            </div>
                            <p className='text-[15px] mb-2 w-full max-w-[250px] text-gray-500'>Pay in cash or UPI to the deliver partner at the time of deleivry</p>
                            <div className='flex items-center gap-x-3'>
                                <div className='flex items-center justify-center gap-x-1 shadow bg-white px-3 rounded-full'>
                                    <Image src='/assets/img/cash1.png' alt='cash' width={25} height={25} />
                                    <span className='font-medium mt-1'>Cash</span>
                                </div>
                                <div className='flex items-center justify-center gap-x-1 shadow bg-white px-3 rounded-full'>
                                    <Image src='/assets/img/bhim.png' alt='upi' width={25} height={25} />
                                    <span className="font-medium mt-1">UPI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${selectedValue === 'ONLINE' ? 'border-2 border-purple-400 bg-purple-50 rounded-2xl' : 'border-2 border-gray-200 rounded-2xl'} px-1 lg:px-5 py-5 lg:py-10 my-4`}>
                <div className='flex items-center lg:gap-x-2'>
                    <div>
                        <Radio
                            color="secondary"
                            checked={selectedValue === 'ONLINE'}
                            onChange={handleChangeRadio}
                            value="ONLINE"
                            name="radio-buttons"
                            slotProps={{ input: { 'aria-label': 'ONLINE' } }}
                        />
                    </div>
                    <div className='flex items-center gap-x-4'>
                        <div className='bg-purple-100 p-3 rounded-lg'>
                            <Image className='w-6 lg:w-12' src='/assets/img/purse.png' alt='cod' width={60} height={60} />
                        </div>
                        <div>
                            <h3 className='font-bold text-[18px]'>UPI (Pay via any App)</h3>
                            <div className='mb-2 bg-sky-100 rounded-full inline-flex px-3 py-[2px] gap-x-1 items-center'>
                                <LockOutlinedIcon fontSize='small' sx={{ color: '#0069a8' }} />
                                <span className='text-[13px] text-center text-sky-700 mt-1'>Secure & instant payment</span>
                            </div>
                            <p className='text-[15px] mb-2 w-full max-w-[250px] text-gray-500'>Pay securely usng any UPI app like Google Pay, PhonePe, Paytm, etc.</p>
                            <div className='flex items-center gap-x-3'>
                                <div className='flex items-center justify-center gap-x-1 shadow bg-white p-3 rounded-full'>
                                    <Image src='/assets/img/google-pay.png' alt='cash' width={30} height={30} />
                                    {/* <span className='font-medium'>Cash</span> */}
                                </div>
                                <div className='flex items-center justify-center gap-x-1 shadow bg-white p-3 rounded-full'>
                                    <Image src='/assets/img/phone-pe.png' alt='upi' width={30} height={30} />
                                    {/* <span className="font-medium">UPI</span> */}
                                </div>
                                <div className='flex items-center justify-center gap-x-1 shadow bg-white p-3 rounded-full'>
                                    <Image src='/assets/img/paytm.png' alt='upi' width={30} height={30} />
                                    {/* <span className="font-medium">UPI</span> */}
                                </div>
                                <div className='flex items-center justify-center gap-x-1 shadow bg-white p-3 rounded-full'>
                                    <Image src='/assets/img/bhim.png' alt='upi' width={30} height={30} />
                                    {/* <span className="font-medium">UPI</span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Button
                    onClick={() => {
                        if (selectedValue === "COD") {
                            mutation.mutate();
                        } else if (selectedValue === "ONLINE") {
                            handleOnlinePayment();
                        }
                    }}
                    disabled={mutation.isPending || !selectedValue}
                    variant="contained"
                    startIcon={<LockOutlinedIcon />}
                    sx={{
                        backgroundColor: "#313647",
                        minWidth: { xs: '100%', md: '300px' },
                        textTransform: "capitalize",
                        py: 2,
                        borderRadius: '13px'
                    }}
                >
                    {mutation.isPending ? 'Placing Order...' : 'Place Order'}
                </Button>
            </div>
        </div>
    );
}
