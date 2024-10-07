import React, { useEffect } from "react";
import { Box, Dialog, Slide, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";

import { updateWelcomeMessageDisplayed } from "../api/auth";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function WelcomePopup({ open, setOpen }) {
  const updateData = () => {
    const token = localStorage.getItem("token");
    const { status } = updateWelcomeMessageDisplayed(token);
    console.log(status);
  };
  useEffect(() => {
    if (open) {
      updateData();
    }
  }, [open]);
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
          maxWidth: "600px", // Max width for better responsiveness
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
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box></Box>
        <IconButton onClick={() => setOpen(false)} sx={{ color: "#000" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography
        variant="body1"
        fontWeight={500}
        fontSize={18}
        mb={2}
        px={3}
        sx={{ lineHeight: 1.6 }}
      >
        Welcome to the MES Platform. The information below provides some
        guidance on the next steps for transferring a pension.
      </Typography>

      <Typography
        variant="body1"
        fontWeight={500}
        fontSize={18}
        mb={2}
        px={3}
        sx={{ lineHeight: 1.6 }}
      >
        We will request the majority of transfers using 'Origo' which is an
        electronic transfer system used by the majority of UK Pension providers.
        It usually takes 3-6 weeks to complete the transfer but ultimately it
        depends on the processing times of the transferring provider. Please
        ensure your existing pension scheme has the same address for you as the
        one you provided on the SIPP application. If these do not match then the
        transfer may be delayed.
      </Typography>

      <Typography
        variant="body1"
        fontWeight={500}
        fontSize={18}
        mb={2}
        px={3}
        sx={{ lineHeight: 1.6 }}
      >
        Some providers may require transfer forms to be completed. If this is
        the case, we will email you with the instructions. 
      </Typography>

      <Box
        px={3}
        py={2}
        fontWeight={500}
        fontSize={18}
        sx={{ lineHeight: 1.6 }}
      >
        We will notify you once a transfer payment has been received.
        <br />
        <br />
        If you have any questions in the meantime, please don't hesitate to
        contact us. You can send us a message through the 'Contact Us' tab on
        the left-hand menu, email us at
        <a
          href="mailto:support@myexpatsipp.com"
          style={{
            color: "#72b3fd",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MailOutlineIcon sx={{ mr: 1 }} /> support@myexpatsipp.com
        </a>{" "}
        or call
        <a
          href="tel:+443303202091"
          style={{
            color: "#72b3fd",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <PhoneInTalkIcon sx={{ mr: 1 }} /> +44 3303 202091
        </a>
        .
      </Box>
    </Dialog>
  );
}
