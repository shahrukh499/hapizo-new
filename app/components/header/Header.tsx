"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import { Badge, Skeleton, Tooltip } from "@mui/material";
import Link from "next/link";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AccountMenu from "./AccountMenu";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading, setUser } from "./authSile";
import { usePathname, useRouter } from "next/navigation";
import { hideHeaderFooter } from "@/app/lib/utils";
import SearchProducts from "./SearchProducts";
import NavItems from "./NavItems";
import { useCartItems } from "@/app/cart/useCartItems";
import Sidebar from "./Sidebar";
import LoginSignup from "../auth/LoginSignup";
import OtpModal from "../auth/OtpModal";
import { clearAuthCookie, getAuthToken, isJwtExpired } from "@/app/utils/auth";
import { RootState } from "@/app/redux/store";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

export default function Header() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.authSlice);
  const pathname = usePathname();
  const router = useRouter();
  const shouldHide = hideHeaderFooter.includes(pathname);

  const { data: cart } = useCartItems(user);

  const logout = React.useCallback(() => {
    localStorage.removeItem("logData");
    dispatch(setUser(null));
    clearAuthCookie();
    window.location.href = "/";
  }, [dispatch]);

  React.useEffect(() => {
    const syncAuthState = () => {
      const token = getAuthToken(); // cookie JWT

      // If cookie missing/expired, force a real logout (clears cookie + localStorage + redux)
      if (!token || isJwtExpired(token)) {
        if (localStorage.getItem("logData")) {
          logout();
          return;
        }
        dispatch(setUser(null));
        dispatch(setAuthLoading(false));
        return;
      }

      // Token is valid; hydrate user from localStorage if present
      const userLog = localStorage.getItem("logData");
      if (userLog) {
        dispatch(setUser(JSON.parse(userLog)));
      } else {
        dispatch(setAuthLoading(false));
      }
    };

    syncAuthState();
    const intervalId = window.setInterval(syncAuthState, 30_000);
    return () => window.clearInterval(intervalId);
  }, [dispatch, logout]);

  const cartCount = React.useMemo(() => {
    return cart?.cart?.items?.length || 0;
  }, [cart]);

  const authUI = React.useMemo(() => {
    if (loading) {
      return (
        <Skeleton
          variant="circular"
          animation="wave"
          width={30}
          height={30}
        />
      );
    }
    if (user?.isLoggedIn) {
      return <AccountMenu logout={logout} />;
    }
    return (
      <>
        <LoginSignup />
        <OtpModal />
      </>
    );
  }, [loading, user, logout]);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#FDFAF6",
        color: "black",
        boxShadow: "none",
        display: shouldHide ? "none" : "",
      }}
    >
      <Toolbar>
        <Sidebar/>
        <Box component="div" sx={{ flexGrow: 0 }}>
          <Link href="/">
            <Image className="w-[154px] h-[50px]" src="/assets/img/hapizo.webp" alt="AutexabrandLogo" width={1549} height={507} />
          </Link>
        </Box>
        <Box component="div" sx={{ flexGrow: 1 }} className="relative ms-16">
          <NavItems />
        </Box>
        <Box
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box sx={{display:{md:"block",xs:"none"}}}>
            <SearchProducts />
          </Box>
          <Tooltip title="Cart">
            <IconButton
              color="inherit"
              onClick={() => router.push("/checkout/cart")}
              sx={{ padding: "10px" }}
            >
              <Badge
                badgeContent={cartCount}
                color="secondary"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#e17319", // Override color
                    color: "white",
                  },
                }}
              >
                <LocalMallOutlinedIcon sx={{ color: "#222222" }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Wishlist" sx={{display:{md:"block",xs:"none"}}}>
            <IconButton color="inherit" onClick={() => router.push("/wishlist")}>
              <FavoriteBorderIcon sx={{ color: "#222222" }} />
            </IconButton>
          </Tooltip>
          <Box sx={{display:{md:"block",xs:"none"}}}>
              {authUI}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
