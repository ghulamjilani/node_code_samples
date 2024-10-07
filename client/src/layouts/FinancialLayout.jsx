import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import ResponsiveDrawer from "../components/SidebarComponent";
import Contact from "../pages/dashboard/ContactUs";
import {
  AdviserAdviceFee,
  AdviserClientOverview,
  AdviserClientPerformanceHistory,
  AdviserClientProfile,
  AdviserDashboard,
  AdviserModelPortfolios,
  ClientReporting,
  Clients,
  DealingFlow,
  ReportingPage,
  WithdrawalRequest,
} from "../pages/financial-advisor";

import {
  contact,
  contactFill,
  layer,
  layerFill,
  people,
  peopleFill,
  crypto,
  cryptoFill,
  health,
  healthFill,
  home,
  homeFill,
  wallet,
  walletFill,
} from "../assets/sidebar_icons";

const environment = import.meta.env.VITE_ENVIRONMENT;
//array of main pages names and links
let generalPages = [
  { name: "Dashboard", link: "/", icon: home, fillIcon: homeFill },
  { name: "Clients", link: "/clients", icon: people, fillIcon: peopleFill },

  {
    name: "Illustrations",
    link: "/illustrations",
    icon: health,
    fillIcon: healthFill,
  },

  { name: "Documents", link: "/documents", icon: crypto, fillIcon: cryptoFill },
  { name: "Reporting", link: "/reporting", icon: wallet, fillIcon: walletFill },
  {
    name: "Model Portfolios",
    link: "/model-portfolios",
    icon: layer,
    fillIcon: layerFill,
  },
];
// ---------------------------------------
if (environment === "PRODUCTION") {
  generalPages = generalPages
    .map((page) => {
      if (page.name === "Documents" || page.name === "Illustrations") {
        return null;
      }
      if (page.name === "Reporting") {
        return { ...page, link: null };
      }
      return page;
    })
    .filter((page) => page !== null);
}

// array of  setting pages
let settingPages = [
  {
    name: "Contact Us",
    link: "/contact-us",
    icon: contact,
    fillIcon: contactFill,
  },
];

// array of  stokcs pages
let stocksPage = [];

export default function FinancialAdvisorLayout() {
  return (
    <Box sx={{ background: "#f5f5f5" }}>
      <ResponsiveDrawer
        generalPages={generalPages}
        settingPages={settingPages}
        stocksPage={stocksPage}
      >
        <Routes>
          <Route path="/" element={<AdviserDashboard />} />
          <Route
            path="/personal-details-and-beneficiaries/:id"
            element={<AdviserClientProfile />}
          />
          <Route
            path="/client-overview/:id"
            element={<AdviserClientOverview />}
          />
          <Route path="/client-reporting/:id" element={<ClientReporting />} />
          <Route path="/portfolio/:id" element={<DealingFlow />} />
          <Route path="/reporting" element={<ReportingPage />} />
          <Route
            path="/performance/:id"
            element={<AdviserClientPerformanceHistory />}
          />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/withdrawals/:id" element={<WithdrawalRequest />} />
          <Route path="/clients" element={<Clients />} />
          <Route
            path="/model-portfolios"
            element={<AdviserModelPortfolios />}
          />
          <Route path="/advice-fees/:id" element={<AdviserAdviceFee />} />

          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </ResponsiveDrawer>
    </Box>
  );
}
