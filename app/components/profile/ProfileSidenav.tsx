"use client";
import React from "react";
import Link from "next/link";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Button,
} from "@mui/material";
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import { setUser } from "../header/authSile";
import { useDispatch } from "react-redux";
import { clearAuthCookie } from "@/app/utils/auth";

const sideNavItems = [
    {
        label: "My Profile",
        icon: <AccountCircleIcon />,
        link: "/my/profile",
    },
    {
        label: "My Orders",
        icon: <ShoppingBagIcon />,
        link: "/my/orders",
    },
    {
        label: "Wishlist",
        icon: <FavoriteBorderIcon />,
        link: "/wishlist",
    },
    {
        label: "My Address",
        icon: <HomeWorkIcon />,
        link: "/my/address",
    },
     {
       label: "Logout",
       icon: <LogoutIcon />,
       link: "/logout",
     },
];

function ProfileSidenav() {
    const dispatch = useDispatch()
    const logout = () => {
        localStorage.removeItem("logData");
        dispatch(setUser(null));
        clearAuthCookie();
        window.location.href = '/';
    };
    return (
        <Box
            sx={{
                width: "100%",
                height: '100%',
                bgcolor: "#f3f3f3",
                borderRadius: 0,
                overflow: "hidden",
                borderBottomLeftRadius: 3,
                borderTopLeftRadius: 3,
                p: 2
            }}
        >
            <nav aria-label="profile navigation">
                <List>
                    {sideNavItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem disablePadding>
                                {
                                    item.link === '/logout' ? (
                                        <ListItemButton onClick={logout} sx={{ py: 1.2 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                                            <ListItemText
                                                primary="Logout"
                                                slotProps={{
                                                    primary: {
                                                        sx: { fontWeight: 600 },
                                                    },
                                                  }}
                                            />
                                        </ListItemButton>
                                    ) : (
                                        <Link
                                            href={item.link}
                                            style={{ textDecoration: "none", color: "inherit", width: "100%" }}
                                        >
                                            <ListItemButton sx={{ py: 1.2 }}>
                                                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                                <ListItemText
                                                    primary={item.label}
                                                    slotProps={{
                                                        primary: {
                                                            sx: { fontWeight: 600 },
                                                        },
                                                      }}
                                                />
                                            </ListItemButton>
                                        </Link>
                                    )
                                }
                            </ListItem>
                            {/* {index !== sideNavItems.length - 1 && <Divider />} */}
                        </React.Fragment>
                    ))}
                </List>
            </nav>
        </Box>
    );
}

export default ProfileSidenav;
