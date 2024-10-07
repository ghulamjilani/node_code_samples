import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Box } from "@mui/material";

import ResponsiveDrawer from "../components/SidebarComponent";
import WelcomePopup from "../components/WelcomeMessage";
import {
  CashTransactions,
  Dashbaord,
  InvestmentPortfolio,
  PerformanceHistory,
  SingleInvestmentPortfolio,
  StockOverview,
  TransactionHistory,
  TransfersAndContributions,
  UserProfile,
} from "../pages/dashboard";
import Contact from "../pages/dashboard/ContactUs";
import { WithdrawalRequest } from "../pages/financial-advisor";
import { Roles } from "../utills/constants";

import {
  card,
  cardFill,
  contact,
  contactFill,
  crypto,
  cryptoFill,
  health,
  healthFill,
  home,
  homeFill,
  money,
  moneyFill,
  wallet,
  walletFill,
} from "../assets/sidebar_icons";

//array of main pages names and links
let generalPages = [
  { name: "Dashboard", link: "/", icon: home, fillIcon: homeFill },
  {
    name: "Investment Portfolio",
    link: "/investment-portfolio",
    icon: crypto,
    fillIcon: cryptoFill,
  },
  {
    name: "Cash Transactions",
    link: "/cash-transactions",
    icon: wallet,
    fillIcon: walletFill,
  },
  {
    name: "Performance History",
    link: "/performance-history",
    icon: health,
    fillIcon: healthFill,
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
];

// array of  stokcs pages
let stocksPage = [
  {
    name: "Transfers & Contributions",
    link: "/transfers-and-contributions",
    icon: money,
    fillIcon: moneyFill,
  },
  {
    name: "Withdrawals",
    link: "/withdrawals",
    icon: card,
    fillIcon: cardFill,
  },
];

export default function ClientLayout() {
  const user = useSelector((state) => state?.auth?.user);
  const [openPopup, setOpenPopup] = React.useState(false);

  React.useEffect(() => {
    if (!user?.isWelcomeMessageDisplayed && user?.role === Roles.CLIENT) {
      setOpenPopup(true);
    }
  }, [user]);

  return (
    <Box sx={{ background: "#f5f5f5" }}>
      <WelcomePopup open={openPopup} setOpen={setOpenPopup} />

      <ResponsiveDrawer
        generalPages={generalPages}
        settingPages={settingPages}
        stocksPage={stocksPage}
      >
        {startTimeActiveMaintenance && (
          <Alert
            sx={{
              mx: 3,
              my: 2,
              border: "2px solid #EF7918",
              borderRadius: "10px",
            }}
            severity="warning"
          >
            We would like to inform you that our platform will undergo scheduled
            maintenance on <b>{startTimeActiveMaintenance}</b>. During this
            period, you may experience temporary unavailability of services.
            This maintenance is crucial to ensure the security and reliability
            of our platform. We recommend that you complete any urgent
            transactions before the maintenance window begins.
          </Alert>
        )}
        <Routes>
          <Route path="/" element={<Dashbaord />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route
            path="/investment-portfolio"
            element={<InvestmentPortfolio />}
          />
          <Route
            path="/investment-portfolio/:id"
            element={<SingleInvestmentPortfolio />}
          />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/withdrawals" element={<WithdrawalRequest />} />
          <Route
            path="/transfers-and-contributions"
            element={<TransfersAndContributions />}
          />
          <Route path="/performance-history" element={<PerformanceHistory />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/cash-transactions" element={<CashTransactions />} />
          <Route path="/security-overview" element={<StockOverview />} />
          <Route path="*" element={<Navigate to="/signin" />} />
        </Routes>
      </ResponsiveDrawer>
    </Box>
  );
}
