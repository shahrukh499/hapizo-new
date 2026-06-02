import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { IconButton, Paper, Rating } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ImageIcon from '@mui/icons-material/Image';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { getAuthToken } from '@/app/utils/auth';
import { TransitionProps } from '@mui/material/transitions';
import { useAppDispatch } from '@/app/redux/hooks';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
export default function Review({ productId }:{productId:string}) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [rating, setRating] = React.useState<any>(0);
    const [review, setReview] = React.useState<string>("");
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [files, setFiles] = React.useState<File[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();

    //console.log(productId,'productId')

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files ? Array.from(e.target.files) : [];
        if (fileList.length === 0) return;

        // check total limit
        if (files.length + fileList.length > 4) {
            alert("You can upload maximum 4 images only");
            e.target.value = "";
            return;
        }

        setFiles(prev => [...prev, ...fileList]);

        setImagePreviews(prev => [
            ...prev,
            ...fileList.map(file => URL.createObjectURL(file))
        ]);
    };

    const removeImage = (index : number) => {
        // Clean up the object URL
        URL.revokeObjectURL(imagePreviews[index]);

        // Get remaining files and previews
        const remainingFiles = files.filter((_, i) => i !== index);
        const remainingPreviews = imagePreviews.filter((_, i) => i !== index);

        // Update state
        setFiles(remainingFiles);
        setImagePreviews(remainingPreviews);

        // Update the file input
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            remainingFiles.forEach(file => dataTransfer.items.add(file));
            fileInputRef.current.files = dataTransfer.files;
        }
    };

    const handleReviews = async () => {
        const formData = new FormData();

        formData.append("rating", rating);
        formData.append("comment", review);

        files.forEach((file) => {
            formData.append("images", file);
        });

        const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.REVIEW}/${productId}/reviews`);
      /*   const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            formData
        ); */
        

        const response = await fetch(apiUri, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            },
            body: formData
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data;
    };

    const mutation = useMutation({
        mutationFn: handleReviews,
        onSuccess: (data) => {
            dispatch(showSnackbar({
                message: data?.message || "Review submitted successfully",
                variant: "success"
            }));
            setOpen(false)
        },
        onError: (error) => {
            dispatch(showSnackbar({
                message: error?.message || "Failed to submit review",
                variant: "error"
            }));
        }
    })

    const submitReview = () => {

        if (!rating) {
            dispatch(showSnackbar({
                message: "Please give rating",
                variant: "warning"
            }));
            return;
        }

        mutation.mutate();
    };


    return (
        <React.Fragment>
            <Button variant="text" onClick={handleClickOpen}
            sx={{
                color:'#ff741f',
                fontWeight:'600',
                textTransform:'capitalize'
            }}
            >
                Write Review
            </Button>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                sx={{
                    "& .MuiDialog-paper": {
                        m: "10px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        maxWidth: '500px',
                        width: '100%'
                    },
                }}
            >
                <h2 className='text-[22px] px-5 pt-4 capitalized text-center'>{"Write Review"}</h2>
                <div className='px-5 py-3'>
                    <div>
                        <div className='mb-3'>
                            <p className="block text-[16px] font-semibold text-black mb-2">Add your rating</p>
                            <div>
                                <Rating
                                    name="simple-controlled"
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                />
                            </div>
                        </div>
                        <label htmlFor="review" className="block text-[16px] font-semibold text-black">
                            Write your review
                        </label>
                        <div className="mt-2.5">
                            <textarea
                                id="review"
                                name="review"
                                rows={4}
                                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-gray-800 outline-2 -outline-offset-1 outline-indigo-500/50 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </div>
                        <div className='mt-2.5'>
                            <div className='pt-3'>
                                <p className="block text-[16px] font-semibold text-black mb-2">
                                    Add Photos
                                </p>
                                <div className='flex flex-wrap items-center gap-x-2'>
                                    <div>
                                        <Button
                                            variant="text"
                                            component="label"
                                            sx={{ width: "70px", height: '70px', border: '1px dashed', color: 'black' }}
                                        >
                                            <ImageIcon />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleFileChange}
                                                ref={fileInputRef}
                                                hidden
                                            />
                                        </Button>
                                    </div>
                                    <div>
                                        {imagePreviews.length > 0 && (
                                            <div className='flex flex-wrap gap-2'>
                                                {imagePreviews.map((src, i) => (
                                                    <div key={i}>
                                                        <div className='relative hover:opacity-100 p-1'>
                                                            <Image
                                                                className='w-[80px] h-[80px] object-cover'
                                                                src={src}
                                                                alt={`Preview ${i}`}
                                                                width={100}
                                                                height={100}
                                                            />
                                                            <IconButton
                                                                className="delete-btn"
                                                                onClick={() => removeImage(i)}
                                                                size="small"

                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: -8,
                                                                    right: -10,
                                                                    bgcolor: 'black',
                                                                    color: 'white',
                                                                    opacity: 0.9,
                                                                    '&:hover': {
                                                                        opacity: 1,
                                                                        bgcolor: 'error.main',
                                                                        color: 'error.contrastText'
                                                                    }
                                                                }}
                                                            >
                                                                <ClearIcon fontSize="small" />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='mt-5'>
                            <Button
                                type='button'
                                onClick={submitReview}
                                sx={{
                                    bgcolor: '#313647',
                                    color: 'white',
                                    textTransform: 'capitalize'
                                }}
                                fullWidth
                                disabled={mutation.isPending}
                            >
                                Submit Review
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    );
}
