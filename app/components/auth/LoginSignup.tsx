import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Checkbox, CircularProgress, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { handleGetNumber, handleOtpModal, handleSignUpLoginModal } from "./loginsignupSlice";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useMutation } from "@tanstack/react-query";
import { showSnackbar } from "../snackbar/snackbarSlice";
import Image from "next/image";
import Link from "next/link";
import { TransitionProps } from "@mui/material/transitions";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const LoginSignup = () => {
    const [phone, setPhone] = React.useState('');
    const [error, setError] = React.useState('');
    const [checked, setChecked] = React.useState(false);
    const { isSignUpLoginModal } = useAppSelector((state) => state.loginsignupSlice)
    const dispatch = useAppDispatch();

    const handleClickOpen = () => {
        dispatch(handleSignUpLoginModal(true));
    };

    const handleClose = () => {
        dispatch(handleSignUpLoginModal(false));
    };

    const validateForm = () => {
        if (!phone) {
            setError("Phone number is required");
            return false;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            setError("Enter valid 10 digit phone number");
            return false;
        }

        if (!checked) {
            setError("Please accept terms & conditions");
            return false;
        }

        setError('');
        return true;
    };

    const handleFormSubmit = async () => {
        try {
            const payload = {
                phone: phone
            }
            const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.LOGINWITHOTP);
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
        } catch (error) {
            throw error;
        }
    }

    const mutation = useMutation({
        mutationFn: handleFormSubmit,
        onSuccess: (data) => {
            dispatch(showSnackbar({ message: data.message, variant: "success" }));
            dispatch(handleOtpModal(true));
            dispatch(handleGetNumber(phone))
            handleClose()
        },
        onError: (error) => {
            dispatch(showSnackbar({ message: error.message, variant: "error" }))
        }
    })

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!validateForm()) return;

        mutation.mutate();
    };

    return (
        <React.Fragment>
            <Tooltip title="Login">
                <IconButton
                    onClick={handleClickOpen}
                    color="inherit"
                    sx={{ padding: "5px" }}
                >
                    <PersonOutlinedIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={isSignUpLoginModal}
                slots={{
                    transition: Transition,
                }}
                sx={{
                    "& .MuiDialog-paper": {
                        margin: '5px',
                        width: '100%'
                    }
                }}
                fullWidth
                maxWidth="xs"
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{ height: '500px' }}>
                    <div className="pt-8 pb-2">
                        <Image
                            className="block mx-auto"
                            src="/assets/img/hapizo-logo.jpg"
                            alt=""
                            width={180}
                            height={180}
                        />
                    </div>
                    <div className="mb-10">
                        <h4 className="text-center text-[20px] font-medium">Login or Signup</h4>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            value={phone}
                            onChange={(e) => {
                                const digitsOnly = e.target.value.replace(/\D/g, '');
                                setPhone(digitsOnly);
                                setError('');
                            }}
                            label="Phone No."
                            variant="outlined"
                            size="small"
                            error={!!error}
                            helperText={error}
                            required  
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                },
                                htmlInput: {
                                    maxLength: 10,
                                    inputMode: 'numeric',
                                    pattern: '[1-9]{1}[0-9]{9}',
                                    title:"Please enter a valid 10-digit phone number."
                                },
                            }}
                        />
                        <div className="flex items-center gap-x-1 py-3">
                            <Checkbox
                                size="small"
                                checked={checked}
                                required
                                onChange={(e) => setChecked(e.target.checked)}
                            />
                            <p className="text-[12px]">By continue, I agree to the <Link className="text-blue-700 font-medium" href='#'>Term of use</Link> & <Link className="text-blue-700 font-medium" href='/privacy-policy' onClick={handleClose}>Privacy Policy</Link> and i am above 18 years old.</p>
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={mutation.isPending}
                            sx={{
                                width: "100%",
                                backgroundColor: "#531fd9",
                                textTransform: "capitalize",
                                mt: 1
                            }}
                        >
                            {mutation.isPending ? (<CircularProgress size={20} sx={{ color: "#fff" }} />) : ("Continue")}
                        </Button>
                    </form>
                    <div className="mt-5">
                        <p className="text-[13px]">Having trouble logging in? <Link className="text-blue-700 font-medium" href='#'>Get Help</Link></p>
                    </div>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default React.memo(LoginSignup) 