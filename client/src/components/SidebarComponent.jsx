import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";

import Navbar from "./Navbar";
import { logoutUser } from "../features/authSlice";
import { isClientPortal } from "../utills/authenticationCheck";

import { Logout } from "../assets/sidebar_icons";
import mesLogo from "../../src/assets/mesLogo.png";

function ResponsiveDrawer(props) {
  const dispatch = useDispatch();
  const { window, children, generalPages, stocksPage, settingPages } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const check2 = useMediaQuery("(max-width:1200px)");
  const drawerWidth = 285;

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutUser());
    navigate("/signin");
  };

  const drawer = (
    <>
      <Box
        onClick={() => {
          navigate("/");
          check2 && handleDrawerToggle();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: 2,
          my: 3,
        }}
      >
        <img src={mesLogo} alt="Logo" width="46px" height="46px" />
        <Typography fontSize={15} fontWeight={600} color="#fff">
          {isClientPortal() ? "MyExpatSIPP" : "MES"} Platform
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#F6F6F633" }} />
      <Typography
        sx={{
          fontWeight: 500,
          fontSize: 10,
          color: "#8A92A6",
          pl: 2.3,
          mt: 2.5,
        }}
      >
        MAIN
      </Typography>
      <List>
        {generalPages.map((page, index) => (
          <Link
            key={index}
            to={page.link}
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <ListItem
              disablePadding
              sx={{
                backgroundColor:
                  pathname === page.link ? "#31d093" : "transparent",
                boxShadow:
                  pathname === page.link &&
                  "0px 3px 6px 0px #001C321A, 0px 11px 11px 0px #001C3217, 0px 25px 15px 0px #001C320D, 0px 44px 18px 0px #001C3203 ,0px 69px 19px 0px #001C3200",
                borderRadius: "10px",
                mb: 1,
              }}
              onClick={() => check2 && handleDrawerToggle()}
            >
              <ListItemButton
                sx={{
                  justifyContent: "center",
                  minHeight: 48,
                  px: 2,
                }}
                disableRipple={true}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 1.5,
                  }}
                >
                  <img src={page.fillIcon} width="22px" height="22px" />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 1,
                      color: pathname === page.link ? "#fff" : "#f5f5f5",
                      fontWeight: pathname === page.link ? 600 : "normal",
                      fontSize: 14,
                      letterSpacing: "0.4px",
                    }}
                  >
                    {page.name}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider sx={{ borderColor: "#F6F6F633" }} />
      {stocksPage.length ? (
        <>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 10,
              color: "#8A92A6",
              pl: 2.3,
              mt: 2,
            }}
          >
            Pension Details
          </Typography>
          <List>
            {stocksPage.map((page, stockIndex) => (
              <Link
                key={stockIndex}
                to={page.link}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor:
                      pathname === page.link ? "#31d093" : "transparent",
                    boxShadow:
                      pathname === page.link &&
                      "0px 3px 6px 0px #001C321A, 0px 11px 11px 0px #001C3217, 0px 25px 15px 0px #001C320D, 0px 44px 18px 0px #001C3203 ,0px 69px 19px 0px #001C3200",
                    borderRadius: "10px",
                    mb: 1,
                  }}
                  onClick={() => check2 && handleDrawerToggle()}
                >
                  <ListItemButton
                    sx={{
                      justifyContent: "center",
                      minHeight: 48,
                      px: 2,
                    }}
                    disableRipple={true}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1.5,
                      }}
                    >
                      <img src={page.fillIcon} width="22px" height="22px" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 1,
                          color: pathname === page.link ? "#fff" : "#f5f5f5",
                          fontWeight: pathname === page.link ? 600 : "normal",
                          fontSize: 14,
                          letterSpacing: "0.4px",
                        }}
                      >
                        {page.name}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider sx={{ borderColor: "#F6F6F633" }} />
        </>
      ) : (
        ""
      )}
      {settingPages?.length ? (
        <>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: 10,
              color: "#8A92A6",
              pl: 2.3,
              mt: 2,
            }}
          >
            Contact
          </Typography>

          <List>
            {settingPages.map((page, index) => (
              <Link
                key={index}
                to={page.link}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <ListItem
                  sx={{
                    backgroundColor:
                      pathname === page.link ? "#31d093" : "transparent",
                    boxShadow:
                      pathname === page.link &&
                      "0px 3px 6px 0px #001C321A, 0px 11px 11px 0px #001C3217, 0px 25px 15px 0px #001C320D, 0px 44px 18px 0px #001C3203 ,0px 69px 19px 0px #001C3200",
                    borderRadius: "10px",
                    mb: 1,
                  }}
                  disablePadding
                  onClick={() => check2 && handleDrawerToggle()}
                >
                  <ListItemButton
                    sx={{
                      justifyContent: "center",
                      minHeight: 48,
                      px: 2,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1.5,
                      }}
                    >
                      <img src={page.fillIcon} width="22px" height="22px" />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 1,
                          color: pathname === page.link ? "#fff" : "#f5f5f5",
                          fontWeight: pathname === page.link ? 600 : "normal",
                          fontSize: 14,
                          letterSpacing: "0.4px",
                        }}
                      >
                        {page.name}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider sx={{ borderColor: "#F6F6F633" }} />
        </>
      ) : (
        ""
      )}

      <Box sx={{ flexGrow: 1 }} />
      <ListItem disablePadding onClick={handleLogout}>
        <ListItemButton
          sx={{
            justifyContent: "center",
            minHeight: 48,
            px: 2,
            mb: 1,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              color: "#8A92A6",
              mr: 1.5,
            }}
          >
            <img src={Logout} width="22px" height="22px" />
          </ListItemIcon>
          <ListItemText
            primary={"Logout"}
            sx={{
              "& .MuiTypography-root": {
                color: "#f5f5f5",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.4px",
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    </>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* ------- Navbar ------- */}
        <Navbar
          handleDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />

        <Box
          sx={{
            width: { lg: drawerWidth },
            transition: "0.3s ease-in-out",
            zIndex: 0,
          }}
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: "block",
              "& .MuiDrawer-paper": {
                width: 280,
                background: "#001c32",
                boxShadow: " 8px 0px 32px 0px #0010290D",
                px: 2,
              },
              height: "100%",
            }}
          >
            {drawer}
          </Drawer>
          {/* desktop view drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "flex" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                transition: "0.07s ease-in-out",
                m: 1,
                px: 2,
                height: "97vh",
                background: "#001c32",
                borderRadius: 6,
                boxShadow: "8px 0px 32px 0px #0010290D",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: {
              xs: "100%",
              lg: `calc(100% - ${drawerWidth}px)`,
            },
            minHeight: "100vh",
            height: "100%",
            transition: "0.07s ease-in-out",
            pt: { xs: 13, md: 14 },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
ResponsiveDrawer.propTypes = { window: PropTypes.func };
export default ResponsiveDrawer;
