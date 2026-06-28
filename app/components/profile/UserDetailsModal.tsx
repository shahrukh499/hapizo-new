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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showSnackbar } from "../snackbar/snackbarSlice";
import { useAppSelector } from "@/app/redux/hooks";

type Errors = {
  name?: string;
  email?: string;
  gender?: string;
  age?: string;
};

const isValidEmail = (email: any) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function UserDetailsModal() {
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Errors>({});
  const { isUserDetailsModal } = useAppSelector((state) => state.loginsignupSlice);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.USERS);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.GET
      );

      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      return data;
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.user?.isProfileComplete ? false : 5000;
    },
    refetchOnWindowFocus: false,
  })

  React.useEffect(() => {
    if (!user) return;

    dispatch(handleUserDetails(!user?.user?.isProfileComplete));
  }, [user, dispatch]);

  const handleClose = React.useCallback(() => {
    dispatch(handleUserDetails(false));
    setErrors({});
  }, [dispatch]);

  React.useEffect(() => {
    if (!user?.user) return;

    setName(user.user.name || "");
    setEmail(user.user.email || "");
    setGender(user.user.gender || "");
    setAge(user.user.age || undefined);
  }, [user]);



  const validateFields = React.useCallback(() => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Enter a valid email address";
    if (!gender.trim()) newErrors.gender = "Gender is required";
    const ageNumber = Number(age);

    if (!age.trim()) {
      newErrors.age = "Age is required";
    } else if (Number.isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      newErrors.age = "Enter a valid age";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, gender, age]);


  const handleUpdateUserDetails = React.useCallback(async () => {
    const payload = { name, email, gender, age: Number(age) };
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
  }, [name, email, gender, age]);

  const mutation = useMutation({
    mutationFn: handleUpdateUserDetails,
    onSuccess: (data) => {
      const userData = JSON.parse(localStorage.getItem("logData") || "{}");
      userData.username = name;
      localStorage.setItem("logData", JSON.stringify(userData));
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      dispatch(showSnackbar({ message: data.message || "Profile updated successfully", variant: "success" }));
      handleClose();
    },
    onError: (error) => {
      dispatch(showSnackbar({ message: error.message, variant: "error" }));
    },
  });

  const handleSubmit = React.useCallback(() => {
    if (validateFields()) {
      mutation.mutate();
    }
  }, [validateFields, mutation]);

  return (
    <Dialog
      open={isUserDetailsModal}
      aria-labelledby="user-details"
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: '20px',
          margin: '5px',
          width: '95%',
          px: "3px"
        }
      }}
    >
      <h2 className="text-[23px] lg:text-[25px] font-semibold text-center pt-5">Please complete <span className=" text-orange-400">your profile</span></h2>
      <DialogContent>
        <form noValidate>
          <div>
            <label>Your name</label>
            <TextField
              id="name"
              required
              name="name"
              fullWidth
              margin="normal"
              size="small"
              label=""
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                marginTop: '3px'
              }}
            />
          </div>
          <div>
            <label>Email</label>
            <TextField
              id="email"
              required
              name="email"
              fullWidth
              margin="normal"
              size="small"
              label=""
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                marginTop: '3px'
              }}
            />
          </div>
          <div>
            <label>Gender</label>
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              error={!!errors.gender}
              sx={{
                marginTop:'3px'
              }}
            >
              <InputLabel id="gender-select-label"></InputLabel>
              <Select
                labelId="gender-select-label"
                value={gender}
                label=""
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
            </FormControl>
          </div>
          <div>
            <label>Age</label>
            <TextField
              id="age"
              type="number"
              required
              name="age"
              fullWidth
              margin="normal"
              size="small"
              label=""
              variant="outlined"
              value={age ?? ""}
              onChange={(e) => setAge(e.target.value)}
              error={!!errors.age}
              helperText={errors.age}
              sx={{
                marginTop:'3px'
              }}
            />
          </div>
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={mutation.isPending}
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#313647',
              border: '0',
              width: '100%',
              display: 'flex',
              alignItems: 'start',
              gap: '5px',
              padding: '10px 10px',
              textTransform: 'capitalize',
              marginTop:'5px'
            }}
          >
            {mutation.isPending ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}