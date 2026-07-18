"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useDispatch, useSelector } from "react-redux";
import { handleAddressModal } from "./addressSlice";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showSnackbar } from "../snackbar/snackbarSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Errors = {
    name?: string;
    mobile?: string;
    pin?: string;
    street?: string;
    city?: string;
    state?: string;
    addrType?: string;
};


export default function AddAddress() {
    const [submiting, setSubmiting] = React.useState(false)
    const [errors, setErrors] = React.useState<Errors>({});
    const [form, setForm] = React.useState({
        name: "",
        mobile: "",
        pin: "",
        street: "",
        city: "",
        state: "",
        isDefault: false,
        addrType: "",
    })
    const queryClient = useQueryClient();
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    const { isAddressModalOpen } = useAppSelector((state) => state.addressSlice);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(handleAddressModal(false));
    };

    const validateFields = () => {
        const newErrors: Errors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.mobile.trim()) {
            newErrors.mobile = "Mobile number is required";
        } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
            newErrors.mobile = "Enter a valid mobile number";
        }

        if (!form.pin.trim()) {
            newErrors.pin = "Pin code is required";
        } else if (!/^\d{6}$/.test(form.pin)) {
            newErrors.pin = "Enter a valid 6 digit pin code";
        }

        if (!form.street.trim()) {
            newErrors.street = "Street is required";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!form.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!form.addrType) {
            newErrors.addrType = "Please select address type";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleAddAddress = async () => {
        setSubmiting(true)
        try {
            const payload = {
                name: form.name,
                phone: form.mobile,
                zip: form.pin,
                street: form.street,
                city: form.city,
                state: form.state,
                isDefault: form.isDefault,
                addrType: form.addrType,
            }
            const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ADDRESS);
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
        } catch (error: any) {
            console.error(error.message || "somthing wrong")
        } finally {
            setSubmiting(false)
        }

    }

    const mutation = useMutation({
        mutationFn: handleAddAddress,
        onSuccess: (data) => {
            dispatch(showSnackbar({ message: data.message, variant: "success" }));
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            setForm({
                name: "",
                mobile: "",
                pin: "",
                street: "",
                city: "",
                state: "",
                isDefault: false,
                addrType: "",
            })
            dispatch(handleAddressModal(false));
        },
        onError: (error) => {
            dispatch(showSnackbar({ message: error.message, variant: "error" }))
        }
    })

    const handleSubmit = () => {
        if (validateFields()) {
            mutation.mutate();
        }
    };

    return (
        <React.Fragment>
            <Dialog
                open={isAddressModalOpen}
                maxWidth="xs"
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: '2px',
                        margin: '5px',
                        width: '95%',
                        px: "3px"
                    }
                }}
            >
                <h2 className="text-[23px] lg:text-[25px] font-semibold text-center pt-5">Add new <span className=" text-[#ff7520]">address</span></h2>
                <DialogContent>
                    <form onSubmit={() => mutation.mutate()}>
                        <div className="flex flex-wrap gap-y-4">
                            <div>
                                <h3 className="text-[15px] font-semibold">Contact Info</h3>
                            </div>
                            <div className="w-full">
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="Name*"
                                    variant="outlined"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />
                            </div>
                            <div className="w-full">
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="Mobile No*"
                                    variant="outlined"
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.mobile}
                                    helperText={errors.mobile}
                                />
                            </div>
                            <div className="w-full">
                                <h3 className="text-[15px] font-semibold">Address</h3>
                            </div>
                            <div className="w-full">
                                <TextField
                                    type="number"
                                    id="outlined-basic"
                                    size="small"
                                    label="Pin Code*"
                                    variant="outlined"
                                    name="pin"
                                    value={form.pin}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.pin}
                                    helperText={errors.pin}
                                />
                            </div>
                            <div className="w-full">
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="Apartment/Flat/House/Street*"
                                    variant="outlined"
                                    name="street"
                                    value={form.street}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.street}
                                    helperText={errors.street}
                                />
                            </div>
                            <div className="w-full">
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="City*"
                                    variant="outlined"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.city}
                                    helperText={errors.city}
                                />
                            </div>
                            <div className="w-full">
                                <TextField
                                    id="outlined-basic"
                                    size="small"
                                    label="State*"
                                    variant="outlined"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.state}
                                    helperText={errors.state}
                                />
                            </div>
                            <div className="w-full">
                                <FormControl error={!!errors.addrType}>
                                    <RadioGroup
                                        row
                                        value={form.addrType}
                                        onChange={(e) =>
                                            setForm({ ...form, addrType: e.target.value })
                                        }
                                    >
                                        <FormControlLabel value="Home" control={<Radio />} label="Home" />
                                        <FormControlLabel value="Office" control={<Radio />} label="Office" />
                                    </RadioGroup>

                                    {errors.addrType && (
                                        <FormHelperText>{errors.addrType}</FormHelperText>
                                    )}
                                </FormControl>
                            </div>
                            <div className="w-full">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={form.isDefault} // use checked instead of value
                                            onChange={(e) =>
                                                setForm({ ...form, isDefault: e.target.checked })
                                            }
                                        />
                                    }
                                    label="Make Default Address"
                                />
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
                        sx={{
                            color: '#ffffff',
                            backgroundColor: '#313647',
                            border: '0',
                            display: 'flex',
                            alignItems: 'start',
                            gap: '5px',
                            padding: '5px 20px',
                            textTransform: 'capitalize',
                            marginTop: '5px'
                        }}
                    >Cancel</Button>
                    <Button
                        disabled={submiting}
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            color: '#ffffff',
                            backgroundColor: '#313647',
                            border: '0',
                            display: 'flex',
                            alignItems: 'start',
                            gap: '5px',
                            padding: '5px 20px',
                            textTransform: 'capitalize',
                            marginTop: '5px'
                        }}
                    >
                        {submiting ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
