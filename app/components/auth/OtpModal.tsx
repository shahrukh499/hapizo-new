import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { handleOtpModal, handleUserDetails } from './loginsignupSlice';
import { useMutation } from '@tanstack/react-query';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { setLocalStorageData, setUser } from '../header/authSile';
import Image from 'next/image';
import { setAuthCookie } from '@/app/utils/auth';
import { TransitionProps } from '@mui/material/transitions';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { CircularProgress } from '@mui/material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function OtpModal() {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    const [otp, setOtp] = React.useState(Array(6).fill(''));
    const [cooldown, setCooldown] = React.useState(0);

    const { isOtpModal, userNumber } = useAppSelector((state) => state.loginsignupSlice)
    const dispatch = useAppDispatch()


    const handleClose = () => {
        dispatch(handleOtpModal(false))
    };

    React.useEffect(() => {
        if (isOtpModal) {
            setCooldown(30); // Start countdown when modal opens
        }
    }, [isOtpModal]);
    React.useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);


    const handleChange = (e: any, index: number) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e:any, index:number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };


    const handlePaste = (e: any) => {
        const paste = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d{6}$/.test(paste)) return;

        const newOtp = paste.split('');
        setOtp(newOtp);
        newOtp.forEach((digit: any, i: number) => {
            inputRefs.current[i]?.focus();
            if (inputRefs.current[i]) {
                inputRefs.current[i]!.value = digit;
            }
        });
        inputRefs.current[5]?.focus();
    };

    const handleResend = async (e: any) => {
        e?.preventDefault?.(); // prevent form reload if inside <form>

        try {
            setCooldown(30); // ✅ start cooldown immediately

            const payload = { phone: userNumber };
            const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.LOGINWITHOTP);
            const requestOptions = API_CONFIG.createRequestOptions(
                API_CONFIG.HTTP_METHODS.POST,
                payload as any
            );

            const response = await fetch(apiUri, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to resend OTP");
            }

            console.log("✅ OTP resent successfully:", data);
        } catch (error : any) {
            console.error("❌ Resend Error:", error.message || error);
        }
    };



    const handleFormSubmit = async () => {
        try {
            const payload = {
                phone: userNumber,
                otp: otp.join(''),
                role: "customer"
            }
            const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.OTP);
            const requestOptions = API_CONFIG.createRequestOptions(
                API_CONFIG.HTTP_METHODS.PUT,
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
            const loginData = {
                isLoggedIn: true,
                username: data.username
            };

            dispatch(showSnackbar({ message: data.message, variant: "success" }));
            dispatch(setLocalStorageData(loginData));
            dispatch(setUser(loginData));
            setAuthCookie(data.token);
            handleClose()
            if (data.isNewUser) {
                setTimeout(() => {
                    dispatch(handleUserDetails(true))
                }, 1000);
            }

        },
        onError: (error) => {
            dispatch(showSnackbar({ message: error.message, variant: "error" }))
        }
    })



    return (
        <React.Fragment>
            <Dialog
                open={isOtpModal}
                slots={{
                    transition: Transition,
                }}
                sx={{
                    "& .MuiDialog-paper": {
                      margin:'5px',
                      width:'100%'
                    }
                  }}
                  fullWidth
                maxWidth="xs"
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <div className='mb-8'>
                        <Image className='mx-auto' src='/assets/img/verification.png' alt='verification' width={100} height={100} />
                        <p className='text-center text-[20px] font-medium mb-1'>OTP Verification</p>
                        <p className='text-center text-[12px] text-[#525252]'>Code in sent to {userNumber}</p>
                    </div>
                    <form>
                        <div className='mb-3 flex items-center'>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="w-full h-full p-3 m-1 text-center text-xl border border-gray-300 rounded-md shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md"
                                    ref={(el: HTMLInputElement | null) => {
                                        inputRefs.current[i] = el;
                                    }}
                                    value={digit}
                                    onChange={(e) => handleChange(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>
                        <div className='text-center mb-3'>
                            <p className='text-[#525252]'>Didn't recieve an OTP</p>
                            {
                                cooldown > 0 ?
                                    `Resend OTP in ${cooldown}s` :
                                    <button onClick={handleResend} className='text-blue-700'>Resend OTP</button>
                            }

                        </div>
                        <Button
                            variant="contained"
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                            sx={{
                                width: "100%",
                                backgroundColor: "#531fd9",
                                textTransform: "capitalize",
                                mt: 1
                            }}
                        >
                            {mutation.isPending ? (<CircularProgress size={20} sx={{ color: "#fff" }} />) : "Verify"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
