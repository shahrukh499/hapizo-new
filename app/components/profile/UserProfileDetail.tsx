import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { Avatar, Button, Skeleton, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function UserProfileDetails() {
  const handleUser = async () => {
    const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.USERS);
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

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: handleUser,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-[25px] font-semibold">User Profile</h1>
        <p className="text-[13px] text-[#525252]">
          Manage your details, view your tier status and change your password.
        </p>
      </div>
      <div className="flex flex-wrap gap-y-4">
        <div className="w-full lg:w-[30%] px-2">
          <div className="text-center shadow rounded-lg flex h-full justify-center flex-col">
            <div className="flex justify-center mb-3">
              <Avatar sx={{ width: 60, height: 60, fontSize: '25px', textTransform: 'uppercase' }}>{user?.user.name.slice(0, 1)}</Avatar>
            </div>
            {
              isLoading ? (
                <div>
                  <Skeleton sx={{ mx: "auto" }} animation="wave" variant="text" width={150} />
                  <Skeleton sx={{ mx: "auto" }} animation="wave" variant="text" width={120} />
                </div>
              ) : (
                <h4 className="text-[20px] text-blue-700 font-medium capitalize">
                  {user?.user.name}
                </h4>

              )
            }
            <p className="text-[15px] text-gray-600">{user?.user.phone}</p>
          </div>
        </div>
        <div className="w-full lg:w-[70%] px-2">
          <div className="shadow rounded-lg p-6">
            <h4 className="text-blue-700 font-semibold">General information</h4>
            <div className="flex justify-around gap-x-5 my-5">
              {
                isLoading ? (
                  <Skeleton animation="wave" variant="rectangular" width={'100%'} height={50} />
                ) : (
                  <TextField
                    id="standard-basic"
                    fullWidth
                    label="Full Name"
                    value={user?.user.name}
                    variant="standard"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    sx={{ textTransform: 'capitalize' }}
                  />
                )
              }
              {/* <TextField
                id="standard-basic"
                fullWidth
                label="First Name"
                value="Ahmed"
                variant="standard"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              /> */}
            </div>
            <Button variant="contained">Update</Button>
          </div>
        </div>
        <div className="w-full px-2">
          <div className="shadow rounded-lg p-6">
            <h4 className="text-blue-700 font-semibold">Security</h4>
            <div className="flex justify-around gap-x-5 my-5">
              {
                isLoading ? (
                  <Skeleton animation="wave" variant="rectangular" width={'100%'} height={50} />
                ) : (
                  <TextField
                    id="standard-basic"
                    fullWidth
                    label="Email"
                    value={user?.user.email}
                    variant="standard"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                )
              }
              {
                isLoading ? (
                  <Skeleton animation="wave" variant="rectangular" width={'100%'} height={50} />
                ) : (
                  <TextField
                    id="standard-basic"
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value='shahrukh'
                    variant="standard"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                )
              }

              {
                isLoading ? (
                  <Skeleton animation="wave" variant="rectangular" width={'100%'} height={50} />
                ) : (
                  <TextField
                    id="standard-basic"
                    fullWidth
                    label="Phone Number"
                    value={user?.user.phone}
                    variant="standard"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                )
              }
            </div>
            <div className="flex flex-wrap gap-x-3">
              <Button variant="contained">Change Password</Button>
              <Button variant="contained">Change Phone Number</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileDetails;
