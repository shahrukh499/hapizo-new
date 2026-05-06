"use client"
import { Button, Radio, RadioGroup, Skeleton } from '@mui/material'
import React, { useEffect } from 'react'
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from '@tanstack/react-query';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import AddAddress from '@/app/components/address/AddAddress';
import { handleAddressModal, handleEditAddressModal, handleGetAddressId } from '@/app/components/address/addressSlice';
import { useDispatch } from 'react-redux';
import EditAddress from '@/app/components/address/EditAddress';
import DeleteAddress from '@/app/components/address/DeleteAddress';
import { useRouter } from 'next/navigation';
import PaymentDetails from '@/app/components/checkoutDetails/CheckoutDetails';

function Address() {

  const [isMount, setIsMount] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);
  const [addressId, setAddressId] = React.useState<string | null>(null);
  const [addressById, setAddressById] = React.useState<any>({});
  const dispatch = useDispatch();
  const router = useRouter();

  // Calculate estimated delivery date (7 days from today)
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = deliveryDate.getDate();
    const month = months[deliveryDate.getMonth()];
    const year = deliveryDate.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
    setIsMount(true);
  }, [])


  const fetchAddrees = async () => {
    const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ADDRESS);
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.GET
    );

    const response = await fetch(apiUri, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data;
  };

  const { data: addresses, isLoading, error } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAddrees,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });

  const handleProductsById = (id : string) => {
    const addr = addresses.addresses.find((addrId:any) => addrId._id === id)
    setAddressById(addr)
  }


  useEffect(() => {
    if (addresses?.addresses?.length > 0) {
      const defaultAddr = addresses.addresses.find((addr:any) => addr.isDefault);
      setSelectedValue(defaultAddr ? defaultAddr._id : addresses.addresses[0]._id);
      const selectedId = defaultAddr ? defaultAddr._id : addresses.addresses[0]._id;
      setSelectedValue(selectedId);
      dispatch(handleGetAddressId(selectedId)); // ✅ store in redux
    }
  }, [addresses, dispatch]);


 /*  useEffect(() => {
    if (addresses?.addresses?.length > 0) {
      const defaultAddr = addresses.addresses.find(addr => addr.isDefault);

    }
  }, [addresses, dispatch]); */

  const handleChangeRedioValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    setSelectedValue(selectedId);
    dispatch(handleGetAddressId(selectedId));
  }

  const handleEditModalAndAddrId = (id: string) => {
    dispatch(handleEditAddressModal(true));
    setAddressId(id);
    handleProductsById(id)
  }


  return (
    <>
      <section className='py-6 lg:py-12'>
        <div className='container mx-auto px-2'>
          <h1 className="text-[20px] lg:text-[22px] font-semibold mb-2 lg:mb-4">
            Select Delivery Address
          </h1>
          <div className='flex flex-wrap'>
            <div className='w-full lg:w-[70%] overflow-x-hidden lg:border-t lg:border-r border-gray-200 lg:px-2'>
              <div className='py-3'>
                <h2 className='font-semibold text-[#525252] text-[15px]'>Your Addresses</h2>
              </div>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={selectedValue || ""}
                onChange={handleChangeRedioValue}
                name="radio-buttons-group"
              >
                {
                  isLoading ? (
                    <Skeleton variant="rectangular" animation="wave" width={`100%`} height={200} />
                  ) : (
                    addresses?.addresses.length > 0 ? (
                      addresses?.addresses.map((el:any, i:number) => (
                        <div key={i} className='border border-[#e4e4e4] shadow p-3 rounded mb-3'>
                          <div className='flex items-start'>
                            <div className='w-[60px]'>
                              {
                                !isMount ? (
                                  <Skeleton variant="circular" width={40} height={40} />
                                ) : (
                                  <Radio
                                    checked={selectedValue === el._id}
                                    onChange={handleChangeRedioValue}
                                    value={el._id}
                                    name="radio-buttons"
                                  />
                                )
                              }
                            </div>
                            <div className='w-full flex flex-col gap-y-5'>
                              <div className='flex items-center gap-x-1'>
                                <h4 className='text-[15px] font-semibold'>{el.name}</h4>
                                <span className='text-[#00b585] text-[12px] border px-3 inline-block rounded-2xl'>
                                  {el.addrType}
                                </span>
                              </div>
                              <div>
                                <p className='text-[#525252] text-[12px]'>{el.street}, {el.city}, {el.state} - {el.zip}</p>
                                <p className='text-[12px] pt-2'><span className='font-semibold'>Mobile : </span> {el.phone}</p>
                              </div>
                              {
                                selectedValue === el._id ? (
                                  <div className='flex gap-x-3'>
                                    <DeleteAddress
                                      addrid={el._id}
                                    />
                                    <Button onClick={() => handleEditModalAndAddrId(el._id)} variant="outlined" sx={{ fontSize: '14px' }} startIcon={<DriveFileRenameOutlineOutlinedIcon fontSize='small' />}>
                                      Edit
                                    </Button>
                                  </div>
                                ) : null
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No addresses found</p>
                    )
                  )
                }
              </RadioGroup>
              <div className='border border-dashed border-[#e4e4e4]'>
                <Button onClick={() => dispatch(handleAddressModal(true))} variant="text" sx={{ fontSize: '13px', width: '100%', minHeight: '60px' }} startIcon={<AddIcon fontSize='small' />}>Add New Address</Button>
              </div>
            </div>
            <div className='w-full lg:w-[30%] lg:ps-3 border-t border-gray-200'>
              <h4 className='font-semibold text-[#525252] text-[13px] my-3'>Delivery Estimate</h4>
              <div>
                <p className='text-[13px] text-[#525252]'>Estimated delivery by <span className='font-semibold text-black'>{getEstimatedDeliveryDate()}</span></p>
              </div>
              <div className='border-t border-gray-400 border-dashed mt-5'>
                <PaymentDetails />
                <div className="w-full">
                  <Button
                    onClick={() => router.push("/checkout/payment")}
                    sx={{
                      py: "10px",
                      width: "100%",
                      backgroundColor: "#313647",
                      color: "#FFF",
                      textTransform: "capitalize",
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AddAddress />
      <EditAddress
        addressId={addressId}
        addrbyid={addressById}
      />
    </>
  )
}

export default Address