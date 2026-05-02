import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Checkbox, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
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
    const { isSignUpLoginModal } = useAppSelector((state) => state.loginsignupSlice)
    const dispatch = useAppDispatch();

    const handleClickOpen = () => {
        dispatch(handleSignUpLoginModal(true));
    };

    const handleClose = () => {
        dispatch(handleSignUpLoginModal(false));
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
                fullWidth
                maxWidth="xs"
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{height:'500px'}}>
                    <div className="pt-8 pb-2">
                        <Image
                            className="block mx-auto"
                            src="/assets/img/logo.svg"
                            alt=""
                            width={100}
                            height={100}
                        />
                    </div>
                    <div className="mb-10">
                        <h4 className="text-center text-[20px] font-medium">Login or Signup</h4>
                    </div>
                    <form>
                        <TextField
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            id="standard-basic"
                            label="Phone No."
                            variant="outlined"
                            size="small"
                            slotProps={{
                                input: {
                                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                },
                              }}
                        />
                        <div className="flex items-center gap-x-1 py-3">
                            <Checkbox size="small" />
                            <p className="text-[12px]">By continue, I agree to the <Link className="text-blue-700 font-medium" href='#'>Term of use</Link> & <Link className="text-blue-700 font-medium" href='#'>Privacy Policy</Link> and i am above 18 years old.</p>
                        </div>
                        <Button
                            variant="contained"
                            onClick={() => mutation.mutate()}
                            sx={{
                                width: "100%",
                                backgroundColor: "#531fd9",
                                textTransform:"capitalize",
                                mt:1
                            }}
                        >
                            Continue
                        </Button>
                    </form>
                    <div className="mt-5">
                        <p className="text-[13px]">Having trouble logging in? <Link className="text-blue-700 font-medium" href='#'>Get Help</Link></p>
                    </div>
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={() => dispatch(handleOtpModal(true))}>OTP</Button>
                    <Button onClick={() => mutation.mutate()}>Agree</Button>
                </DialogActions> */}
            </Dialog>
        </React.Fragment>
    );
}

export default React.memo(LoginSignup) 