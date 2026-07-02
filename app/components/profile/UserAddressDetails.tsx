'use client'
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { Button, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import AddAddress from '../address/AddAddress';
import { handleAddressModal, handleEditAddressModal, handleGetAddressId } from '../address/addressSlice';
import AddIcon from '@mui/icons-material/Add';
import DeleteAddress from '../address/DeleteAddress';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import EditAddress from '../address/EditAddress';
import { useAppDispatch } from '@/app/redux/hooks';
import SideNavbarMobile from './SideNavbarMobile';

function UserAddressDetails() {
    const [addressId, setAddressId] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = React.useState(null);
    const [addressById, setAddressById] = React.useState<any>({});
    const dispatch = useAppDispatch();
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

    const handleProductsById = (id: string) => {
        const addr = addresses.addresses.find((addrId: any) => addrId._id === id)
        setAddressById(addr)
    }

    useEffect(() => {
        if (addresses?.addresses?.length > 0) {
            const defaultAddr = addresses.addresses.find((addr: any) => addr.isDefault);
            setSelectedValue(defaultAddr ? defaultAddr._id : addresses.addresses[0]._id);
            const selectedId = defaultAddr ? defaultAddr._id : addresses.addresses[0]._id;
            setSelectedValue(selectedId);
            dispatch(handleGetAddressId(selectedId)); // ✅ store in redux
        }
    }, [addresses, dispatch]);

    const handleEditModalAndAddrId = (id: string) => {
        dispatch(handleEditAddressModal(true));
        setAddressId(id);
        handleProductsById(id)
    }

    return (
        <div>
            <div className="mb-5 flex justify-between items-center">
                <h1 className="text-[25px] font-semibold">My Address</h1>
                <div className="lg:hidden">
                    <SideNavbarMobile />
                </div>
            </div>
            <div className='border border-dashed border-[#e4e4e4]'>
                <Button onClick={() => dispatch(handleAddressModal(true))} variant="text" sx={{ fontSize: '13px', width: '100%', minHeight: '60px' }} startIcon={<AddIcon fontSize='small' />}>Add New Address</Button>
            </div>
            <div>
                {
                    isLoading ? (
                        <Skeleton sx={{ mb: 2, borderRadius: 3 }} variant="rectangular" animation="wave" width={`100%`} height={200} />
                    ) : (
                        addresses?.addresses.length > 0 ? (
                            addresses?.addresses.map((el: any, i: number) => (
                                <div key={i} className="w-full flex flex-col gap-y-3 shadow p-6 rounded-xl my-3">
                                    <div className="flex items-center gap-x-1">
                                        <h4 className="text-[20px] font-semibold">{el.name}</h4>
                                        <span className="text-[#00b585] text-[12px] border px-3 inline-block rounded-2xl">{el.addrType}</span>
                                    </div>
                                    <div>
                                        <p className="text-[#525252] text-[15px] w-full max-w-[500px]">{el.street}, {el.city}, {el.state} - {el.zip}</p>
                                        <p className="text-[14px] pt-2"><span className="font-semibold">Mobile : </span> {el.phone}</p>
                                    </div>
                                    <div className='flex gap-x-3'>
                                        <DeleteAddress
                                            addrid={el._id}
                                        />
                                        <Button onClick={() => handleEditModalAndAddrId(el._id)} variant="outlined" sx={{ fontSize: '14px' }} startIcon={<DriveFileRenameOutlineOutlinedIcon fontSize='small' />}>
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Address Found</p>
                        )
                    )
                }
            </div>
            <div className='border border-dashed border-[#e4e4e4]'>
                <Button onClick={() => dispatch(handleAddressModal(true))} variant="text" sx={{ fontSize: '13px', width: '100%', minHeight: '60px' }} startIcon={<AddIcon fontSize='small' />}>Add New Address</Button>
            </div>
            <AddAddress />
            <EditAddress
                addressId={addressId}
                addrbyid={addressById}
            />
        </div>
    )
}

export default UserAddressDetails