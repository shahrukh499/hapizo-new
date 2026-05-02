"use client";
import * as React from "react";
import Link from "next/link";
import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Collapse,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';
import { useNavbarData } from "./useNavbarData";

export default function Sidebar() {
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(null);

    const toggleDrawer = (newOpen : boolean) => () => {
        setOpen(newOpen);
    };

    const handleExpand = (index : any) => {
        setExpanded(expanded === index ? null : index);
    };

    const { data: navdata, isLoading, error } = useNavbarData();


    const DrowerTop = (
        <Box sx={{ p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/">
                <Image src="/assets/img/logo.svg" alt="" width={130} height={80} />
            </Link>
            <IconButton onClick={toggleDrawer(false)}>
                <CloseIcon />
            </IconButton>
        </Box>
    )

    const DrawerList = (
        <Box sx={{ width: 280 }} role="presentation">
            <List>
                {
                    navdata?.navdata.length > 0 ? (
                        navdata?.navdata.map((category:any, index:number) => (
                            <React.Fragment key={index}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => handleExpand(index)}>
                                        {/* <ListItemIcon sx={{ minWidth: '33px' }}>{category.icon}</ListItemIcon> */}
                                        <ListItemText primary={category.name} />
                                        {category.dropItem.length > 0 ? (
                                            expanded === index ? (
                                                <ExpandLess />
                                            ) : (
                                                <ExpandMore />
                                            )
                                        ) : null}
                                    </ListItemButton>
                                </ListItem>

                                <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {category.dropItem.map((item:any, i:number) => (
                                            <Link key={i} href={item.link} style={{ textDecoration: "none", color: "inherit" }}>
                                                <ListItemButton sx={{ pl: 6 }}>
                                                    {/*  <ListItemIcon>
                                                        <ChevronRightIcon fontSize="small" />
                                                    </ListItemIcon> */}
                                                    <ListItemText primary={item.name} />
                                                </ListItemButton>
                                            </Link>
                                        ))}
                                    </List>
                                </Collapse>
                                <Divider />
                            </React.Fragment>
                        ))
                    ) : (
                        <p className="text-center">Nav items not found</p>
                    )
                }
            </List>
        </Box>
    );

    return (
        <div>
            {/* Menu Icon (Visible on Mobile) */}
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ display: { md: "none" } }}
                onClick={toggleDrawer(true)}
            >
                <MenuIcon />
            </IconButton>

            {/* Drawer Sidebar */}
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrowerTop}
                {DrawerList}
            </Drawer>
        </div>
    );
}
