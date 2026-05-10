import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CategoryFilter from './CategoryFilter';
import BrandsFilter from './BrandsFilter';
import PriceFilter from './PriceFilter';

export default function FilterDrawer() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation">
            <div className='px-5 py-3'>
                <CategoryFilter />
            </div>
            <Divider />
            <div className='px-5 py-3'>
                <BrandsFilter />
            </div>
            <Divider />
            <div className='px-5 py-3'>
                <PriceFilter />
            </div>
        </Box>
    );

    return (
        <div>
            <Button sx={{ p: 0, minWidth: "35px", color: 'black' }} onClick={toggleDrawer(true)}><FilterAltOutlinedIcon /></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}
