'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { handleOpenSearchModal } from '../header/searchSlice';
import { Skeleton } from '@mui/material';
import { handleSignUpLoginModal } from '../auth/loginsignupSlice';

export default function BottomNav() {
  const [value, setValue] = React.useState(0);
  const { user, loading } = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const authUI = React.useMemo(() => {
    if (loading) {
      return (
        <BottomNavigationAction
          label=""
          icon={
            <Skeleton
              variant="circular"
              animation="wave"
              width={30}
              height={30}
            />
          }
        />
      );
    }
    if (user?.isLoggedIn) {
      return <BottomNavigationAction onClick={() => router.push('/my/profile')} label="Profile" icon={<AccountCircleOutlinedIcon />} />;
    }
    return (
      <BottomNavigationAction onClick={() => dispatch(handleSignUpLoginModal(true))} label="Login" icon={<AccountCircleOutlinedIcon />} />
    );
  }, [loading, user]);

  return (
    <Box sx={{ width: "100%", position: 'fixed', bottom: '0', left: '0', display: { md: "none", xs: "block" } }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          height: "55px",
          backgroundColor:'#fdfaf6',
          "& .MuiBottomNavigationAction-root": {
            color: "#443d3d",
            fontSize: "12px",
          },
      
          "& .Mui-selected": {
            color: "#000",
            fontSize:'12px'
          }
        }}
      >
        <BottomNavigationAction onClick={() => router.push('/')} label="Home" icon={<HomeOutlinedIcon />} />
        <BottomNavigationAction onClick={() => dispatch(handleOpenSearchModal(true))} label="Search" icon={<SearchOutlinedIcon />} />
        <BottomNavigationAction onClick={() => router.push('/wishlist')} label="Favorites" icon={<FavoriteBorderOutlinedIcon />} />
        {authUI}
      </BottomNavigation>
    </Box>
  );
}
