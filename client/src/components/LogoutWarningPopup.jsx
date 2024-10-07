import React from "react";
import { Box, Dialog, Slide, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function LogoutWarningPopup({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      sx={{
        zIndex: 100,
        "& .MuiDialog-paper": {
          background: "#fff",
          borderRadius: "20px",
          boxShadow:
            "0px 13.5px 29.13px 0px #11203A1A, 0px 53.29px 53.29px 0px #11203A17, 0px 120.08px 71.77px 0px #11203A0D, 0px 213.88px 85.27px 0px #11203A03, 0px 333.96px 93.08px 0px #11203A00",
          p: 1,
          width: "90%", // Adjusted for better appearance
          maxWidth: "400px", // Adjusted for warning dialog
          boxSizing: "border-box",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "#ffffff05 !important",
          backdropFilter: "blur(9px)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={2}
        px={3}
        py={2}
      >
        <WarningIcon color="warning" fontSize={"large"} />
      </Box>

      <Typography
        variant="body1"
        fontWeight={400}
        fontSize={16}
        mb={2}
        px={3}
        sx={{ lineHeight: 1.6, textAlign: "center" }}
      >
        <b> Warning:</b> You will be logged out in 1 minute due to inactivity.
      </Typography>
    </Dialog>
  );
}
