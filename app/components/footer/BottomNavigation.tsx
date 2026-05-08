'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useRouter } from 'next/navigation';

export default function BottomNav() {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  return (
    <Box sx={{ width: "100%", position:'fixed', bottom:'0', left:'0', display:{lg:"none",xs:"block"} }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction onClick={()=>router.push('/')} label="Home" icon={<HomeOutlinedIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchOutlinedIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteBorderOutlinedIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleOutlinedIcon />} />
      </BottomNavigation>
    </Box>
  );
}
