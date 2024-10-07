import { Box } from "@mui/material";
import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ResponsiveDrawer from "../components/SidebarComponent";
import Contact from "../pages/dashboard/ContactUs";
import { AdviceFirms, Clients, FinanceAdivsor } from "../pages/super-admin";

import {
  contact,
  contactFill,
  layer,
  layerFill,
  MaintenanceVector,
  people,
  peopleFill,
  user,
  userFill,
  usertag,
  usertagFill,
} from "../assets/sidebar_icons";

//array of main pages names and links
let generalPages = [
  {
    name: "Advice Firms",
    link: "/",
    icon: usertag,
    fillIcon: usertagFill,
  },
  {
    name: "Clients",
    link: "/clients",
    icon: people,
    fillIcon: peopleFill,
  },
  {
    name: "MES Administrators",
    link: "/mes-administrators",
    icon: user,
    fillIcon: userFill,
  },
];
// ---------------------------------------

// array of  setting pages
let settingPages = [
  {
    name: "Contact Us",
    link: "/contact-us",
    icon: contact,
    fillIcon: contactFill,
  },
  {
    name: "Maintenance",
    link: "/launch-maintenance",
    icon: MaintenanceVector,
    fillIcon: MaintenanceVector,
  },
];

// array of  stokcs pages
let stocksPage = [
  {
    name: "Model Portfolios",
    link: "/model-portfolios",
    icon: layer,
    fillIcon: layerFill,
  },
];

export default function SuperAdminLayout() {
  return (
    <Box sx={{ background: "#f5f5f5" }}>
      <ResponsiveDrawer
        generalPages={generalPages}
        settingPages={settingPages}
        stocksPage={stocksPage}
      >
        <Routes>
          <Route path="/" element={<AdviceFirms />} />
          <Route path="/financial-advisors" element={<FinanceAdivsor />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </ResponsiveDrawer>
    </Box>
  );
}
