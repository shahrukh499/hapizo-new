"use client";
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { handleUserDetails } from "../auth/loginsignupSlice";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useMutation } from "@tanstack/react-query";
import { showSnackbar } from "../snackbar/snackbarSlice";
import { useAppSelector } from "@/app/redux/hooks";

type Errors = {
  name?: string;
  email?: string;
  gender?: string;
};

type fieldProps ={
  name : string;
  email : string;
  gender : string
}

export default function UserDetailsModal() {
  const [gender, setGender] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});
  const { isUserDetailsModal } = useAppSelector((state) => state.loginsignupSlice);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(handleUserDetails(false));
    setErrors({});
  };

  const isValidEmail = (email : any) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateFields = () => {
    const newErrors = {} as fieldProps;
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Enter a valid email address";
    if (!gender.trim()) newErrors.gender = "Gender is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateUserDetails = async () => {
    const payload = { name, email, gender };
    const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.USERS);
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.PATCH,
      payload as any
    );

    const response = await fetch(apiUri, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update user details");
    }

    return data;
  };

  const mutation = useMutation({
    mutationFn: handleUpdateUserDetails,
    onSuccess: (data) => {
      dispatch(showSnackbar({ message: data.message || "Profile updated successfully", variant: "success" }));
      handleClose();
    },
    onError: (error) => {
      dispatch(showSnackbar({ message: error.message, variant: "error" }));
    },
  });

  const handleSubmit = () => {
    if (validateFields()) {
      mutation.mutate();
    }
  };

  return (
    <Dialog open={isUserDetailsModal} aria-labelledby="user-details-title">
      <DialogTitle id="user-details-title">Complete Your Profile</DialogTitle>
      <DialogContent>
        <form noValidate>
          <TextField
            id="name"
            required
            name="name"
            fullWidth
            margin="normal"
            size="small"
            label="Full Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            id="email"
            required
            name="email"
            fullWidth
            margin="normal"
            size="small"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormControl fullWidth margin="normal" size="small" error={!!errors.gender}>
            <InputLabel id="gender-select-label">Gender *</InputLabel>
            <Select
              labelId="gender-select-label"
              value={gender}
              label="Gender *"
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={mutation.isPending}
          variant="contained"
        >
          {mutation.isPending ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}