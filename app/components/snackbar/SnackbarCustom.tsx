"use client"

import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { hideSnackbar } from "./snackbarSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

type variantTypes = "error" | "default" | "success" | "warning" | "info" | undefined;


export default function SnackbarCustom() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { open, message, variant } = useAppSelector((state) => state.snackbarSlice);

  useEffect(() => {
    if (open) {
      enqueueSnackbar(message, { variant : variant as variantTypes});
      dispatch(hideSnackbar()); // Hide after displaying
    }
  }, [open, message, variant, enqueueSnackbar, dispatch]);

  return null; // No UI needed, just listens for state updates
}