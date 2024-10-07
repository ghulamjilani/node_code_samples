import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Card,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

import {
  currentPortfolio,
  logoutUser,
  portfolioOptions,
} from "../features/authSlice";
import ContributionModel from "./dashboard/ContributionModel";
import AddProductModal from "./financial-advisor/AddProductsModal";
import { addButtonStyle, StyledSelect } from "./Subcomponent";
import { Roles } from "../utills/constants";
import LogoutWarningPopup from "./LogoutWarningPopup";

const adviserClientPages = [
  "/client-overview",
  "/cash-accounts-and-transactions",
  "/transfers-&-contributions",
  "/personal-details-and-beneficiaries",
  "/portfolio",
  "/performance",
  "/advice-fees",
  "/security_overview",
  "/withdrawals",
  "/client-reporting",
];
const environment = import.meta.env.VITE_ENVIRONMENT;

function Navbar({ drawerWidth }) {
  const [showWarning, setShowWarning] = useState(false);
  const logoutTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const { user, profileInfo, terceroUser, clientOverview } = useSelector(
    (state) => state?.auth
  );

  const [contributionModal, setContributionModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "#9892A6",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  const path = location.pathname.replace(/\/\d+$/, ""); // Remove / followed by any number

  if (adviserClientPages.includes(path)) {
    linkHeadingText = `${clientOverview?.firstName ?? ""} ${
      clientOverview?.lastName ?? ""
    }`;
  }

  React.useEffect(() => {
    if (!terceroUser?.Portfolios?.length) return;
    const options = terceroUser?.Portfolios?.map((item) => ({
      value: item.Id,
      label: `${item.CollectiveName} (${item.Reference})`,
    }));
    setSelectOptions(options);

    if (options.length > 0) {
      setSelectedPortfolio(options[0].value); // Set the default selected portfolio
      dispatch(currentPortfolio(options[0].value)); // Set the current portfolio in the store
      dispatch(portfolioOptions(terceroUser?.Portfolios));
    }
  }, [terceroUser]);

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedPortfolio(value);
    dispatch(currentPortfolio(value));
  };

  // Logout Method
  const logout = () => {
    // Remove the timestamp and clear local storage
    localStorage.removeItem("lastActivityTime");
    localStorage.clear();

    // Dispatch the logout action
    dispatch(logoutUser());

    // Close any open dialogs or warnings
    handleClose();
    setShowWarning(false);

    // Navigate to the signin page
    navigate("/signin");

    // Use a short timeout to ensure navigation and UI updates are processed
    setTimeout(() => {
      // Perform a hard refresh
      window.location.reload();
    }, 100); // You can adjust the timeout if needed
  };

  const showWarningMessage = () => {
    setShowWarning(true);
  };

  const resetTimer = () => {
    // Clear existing timers
    clearTimeout(logoutTimeoutRef.current);
    clearTimeout(warningTimeoutRef.current);

    // Set the warning timer for 9 minutes (9 * 60 * 1000 milliseconds)
    warningTimeoutRef.current = setTimeout(showWarningMessage, 9 * 60 * 1000);

    // Set the logout timer for 10 minutes (10 * 60 * 1000 milliseconds)
    logoutTimeoutRef.current = setTimeout(logout, 10 * 60 * 1000);

    // Hide warning message if user becomes active again
    setShowWarning(false);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Store the current time in localStorage
      localStorage.setItem("lastActivityTime", Date.now());
    };

    // Events to detect user activity
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check the last activity time on component mount
    const checkLastActivityTime = () => {
      const lastActivityTime = parseInt(
        localStorage.getItem("lastActivityTime"),
        10
      );
      console.log(lastActivityTime, "time");
      if (lastActivityTime && Date.now() - lastActivityTime > 10 * 1000) {
        // If more than 10 seconds have passed since last activity, log out the user
        logout();
      } else {
        // If less than 10 seconds have passed, reset the timer
        resetTimer();
      }
    };

    checkLastActivityTime(); // Initial check

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimeout(logoutTimeoutRef.current);
      clearTimeout(warningTimeoutRef.current);
    };
  }, [navigate, dispatch]);
  return (
    <AppBar
      position="absolute"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        width: {
          xs: "100%",
          lg: `calc(100% - ${drawerWidth}px)`,
        },
        zIndex: 1,
      }}
    >
      <Toolbar
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
          py: 2.85,
          ml: { md: 0, lg: 3 },
          borderBottom: "1px solid #D8D7D3",
        }}
      >
        <ContributionModel
          open={contributionModal}
          setOpen={setContributionModal}
        />
        <AddProductModal
          open={openProductModal}
          setOpen={setOpenProductModal}
        />

        <Box display="flex">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {environment !== "PRODUCTION" && (
              <>
                {" "}
                {(user?.role === Roles.FINANCIAL_ADVISER ||
                  user?.role === Roles.ADMINISTRATOR) &&
                  location.pathname.includes("client-overview") && (
                    <Button
                      sx={addButtonStyle}
                      endIcon={<AddIcon />}
                      onClick={() => setOpenProductModal(true)}
                    >
                      Add New Product
                    </Button>
                  )}
              </>
            )}
            {(user?.role === Roles.CLIENT ||
              user?.role === Roles.ADVISED_CLIENT) &&
              location.pathname !== "/contact-us" && (
                <StyledSelect
                  options={selectOptions}
                  onChange={handleSelectChange}
                  value={selectedPortfolio}
                  name="administratorsExport"
                  miniwidth="238px"
                />
              )}
            {user?.role === Roles.CLIENT && (
              <IconButton
                onClick={() => setContributionModal(true)}
                sx={{
                  p: 1,
                  ml: 1,
                  borderRadius: "50%",
                  boxShadow: "0px 10px 30px 0px #1126920D",
                  background: "white",
                  height: "49px",
                  width: "49px",
                }}
              >
                <ControlPointIcon />
              </IconButton>
            )}
          </Box>

          <Box
            onClick={handleProfileClick}
            sx={{
              display: "flex",
              cursor: "pointer",
              alignItems: "center",
              ml: 1,
            }}
          >
            <Card
              sx={{
                borderRadius: "30px",
                boxShadow: "0px 10px 30px 0px #1126920D",
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                p: 0.5,
              }}
            >
              <Avatar
                {...stringAvatar(
                  `${
                    profileInfo?.platinumProfileInfo?.FirstName ??
                    user?.firstName
                  } ${profileInfo?.platinumProfileInfo?.LastName}}`
                )}
              />
              <Box>
                <Typography variant="subtitle1" fontSize="14px">
                  {profileInfo?.platinumProfileInfo?.FirstName ??
                    user?.firstName}{" "}
                  {profileInfo?.platinumProfileInfo?.SecondName ??
                    user?.middleName}{" "}
                  {profileInfo?.platinumProfileInfo?.LastName ?? user?.lastName}
                </Typography>
              </Box>
              <ExpandMoreIcon />
            </Card>
          </Box>
        </Box>
      </Toolbar>

      <Toolbar
        sx={{
          width: "100%",
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          py: 2.85,
          borderBottom: "1px solid #D8D7D3",
        }}
      >
        <Box display="flex">
          {(user?.role === Roles.CLIENT ||
            user?.role === Roles.ADVISED_CLIENT) &&
            location.pathname !== "/contact-us" && (
              <StyledSelect
                options={selectOptions}
                onChange={handleSelectChange}
                value={selectedPortfolio}
                name="administratorsExport"
                miniwidth="100px"
              />
            )}
          <Box
            sx={{
              borderRadius: "50%",
              boxShadow: "0px 10px 30px 0px #1126920D",
              display: "flex",
              alignItems: "center",
              p: 0.4,
              ml: 0.6,
            }}
            onClick={handleProfileClick}
          >
            <Avatar
              {...stringAvatar(
                `${
                  profileInfo?.platinumProfileInfo?.FirstName ?? user?.firstName
                } ${
                  profileInfo?.platinumProfileInfo?.LastName ?? user?.lastName
                }}`
              )}
            />
          </Box>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {profileInfo && (
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleClose();
            }}
          >
            Profile
          </MenuItem>
        )}
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>

      <LogoutWarningPopup open={showWarning} setOpen={setShowWarning} />
    </AppBar>
  );
}

export default Navbar;
