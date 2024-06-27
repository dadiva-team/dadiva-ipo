import { Box } from "@mui/material";
import React from "react";
import { DoctorNavBar } from "./DoctorNavBar";
import { Outlet } from "react-router-dom";

export function Doctor() {
  return (
    <Box display="flex">
      <DoctorNavBar />
      <Box component="main" sx={{ width: '80%', pr: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}