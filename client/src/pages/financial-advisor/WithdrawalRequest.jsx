import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";

import {
  addButtonStyle,
  BootstrapTooltip,
  headTableCellStyle,
  tableCellStyle,
} from "../../components/Subcomponent";
import { RouteSelect } from "../../components/financial-advisor/components/RouteSelect";
import HMRCpage from "./HMRCpage";
import { clientOverview } from "../../features/authSlice";
import {
  getHMRCdataApis,
  getWithdrawalRequests,
} from "../../api/financialAdviser";
import { getAdviserClient } from "../../api/clientHandler";
import { formatNumber } from "../../utills/generalFunctions";
import { getFormattedDate } from "../../utills/dateFormatter";
import { Roles } from "../../utills/constants";

import tooltip from "../../assets/tooltip.png";

const ValueBox = ({ title, value, tooltipText }) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "20px",
        boxShadow: "0px 10px 30px 0px #1126920D",
      }}
    >
      <CardContent>
        <Box pt={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" color="#8A92A6" fontWeight="600">
              {title}
            </Typography>
            {tooltipText && (
              <BootstrapTooltip title={tooltipText} arrow>
                <img
                  src={tooltip}
                  alt=""
                  width="14px"
                  style={{ cursor: "pointer" }}
                />
              </BootstrapTooltip>
            )}
          </Stack>
          <Typography
            variant="body1"
            fontSize="22px"
            fontWeight="600"
            color="#001C32"
            mt={1.3}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function WithdrawalRequest() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, currentPortfolio, portfolioOptions } = useSelector(
    (state) => state?.auth
  );

  const [client, setClient] = useState({});
  const [crystallisedData, setCrystallisedData] = useState({});
  const [withdrawHistoryData, setWithdrawHistoryData] = useState([]);
  const [HMRCProtectionsData, setHMRCProtectionsData] = useState([]);
  const [HMRCAllowancesData, setHMRCAllowancesData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const portfolio = currentPortfolio
    ? portfolioOptions?.filter((port) => port?.Id === currentPortfolio)?.[0]
    : portfolioOptions?.[0];

  // sumOfCrystalliseValues and percentage calculations
  const crystallisedValue = crystallisedData?.crystallisedValue ?? 0;
  const uncrystallisedValue = crystallisedData?.uncrystallisedValue ?? 0;
  const hasCrystallised = crystallisedValue > 0;
  const hasUncrystallised = uncrystallisedValue > 0;

  const sumOfCrystalliseValues =
    hasCrystallised || hasUncrystallised
      ? crystallisedValue + uncrystallisedValue
      : 0;

  const crystallisedPercentage = hasCrystallised
    ? (crystallisedValue / sumOfCrystalliseValues) * 100
    : 0;
  const uncrystallisedPercentage = hasUncrystallised
    ? (uncrystallisedValue / sumOfCrystalliseValues) * 100
    : 0;
  ////////////////////////////////////////////////
  const portfolioCurrencySymbol = portfolio?.LatestValue?.Currency?.UpperSymbol;
  const portfolioMarketValue = portfolio?.LatestValue?.MarketValue;

  const fetchData = async () => {
    try {
      setLoading(true);
      // -->> withdrawal and HRMC api for direct client
      if (user?.role !== Roles.CLIENT) {
        const { data: clientData } = await getAdviserClient(id);
        dispatch(clientOverview(clientData?.client));
        setClient(clientData?.client);
      }

      if (currentPortfolio) {
        const { data } = await getWithdrawalRequests(currentPortfolio);

        if (data?.withdrawalsData) {
          setCrystallisedData(data?.withdrawalsData);
        }
        if (data?.withdrawalCrystallisationHistory?.value?.length) {
          setWithdrawHistoryData(data?.withdrawalCrystallisationHistory?.value);
        }

        setTimeout(async () => {
          const { data } = await getHMRCdataApis(currentPortfolio);

          // Set HMRC Data
          if (data?.HMRCAllowancesData?.length) {
            setHMRCAllowancesData(data?.HMRCAllowancesData);
          }
          if (data?.HMRCProtectionsData?.length) {
            setHMRCProtectionsData(data?.HMRCProtectionsData);
          }

          setLoading(false);
        }, 14000);
      }
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setCrystallisedData({});
    setWithdrawHistoryData([]);
    setHMRCAllowancesData([]);
    setHMRCProtectionsData([]);

    fetchData();
  }, [currentPortfolio]);

  return (
    <Container maxWidth="xl">
      {user?.role !== Roles.CLIENT && (
        <RouteSelect clientId={id} client={client} page={"/withdrawals"} />
      )}

      {loading ? (
        <Skeleton
          variant="rectangular"
          sx={{ height: "100px", borderRadius: "20px", mb: 2 }}
        />
      ) : (
        <Grid container spacing={2} mb={2}>
          <Grid item md={3} sm={6} xs={12}>
            <ValueBox
              title={"Uncrystallised Fund"}
              tooltipText={
                "The uncrystallised fund is is the part of your pension that hasn’t been accessed yet. You can usually withdraw 25% of this part tax free."
              }
              value={`${uncrystallisedPercentage.toFixed(2)}% (${
                portfolioCurrencySymbol ?? ""
              }${formatNumber(
                (portfolioMarketValue * uncrystallisedPercentage) / 100
              )})`}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <ValueBox
              title={"Crystallised Fund"}
              tooltipText={
                "The crystallised fund is the part of your pension that is in drawdown and any withdrawals from this part will be subject to tax through PAYE."
              }
              value={`${crystallisedPercentage.toFixed(2)}% (${
                portfolioCurrencySymbol ?? ""
              }${formatNumber(
                (portfolioMarketValue * crystallisedPercentage) / 100
              )})`}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <ValueBox
              title={"LSA remaining"}
              value={`£${formatNumber(HMRCAllowancesData[0]?.lsaRemaining)}`}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <ValueBox
              title={"LSDBA remaining"}
              value={`£${formatNumber(HMRCAllowancesData[0]?.lsdbaRemaining)}`}
            />
          </Grid>
        </Grid>
      )}

      <Box
        sx={{
          borderRadius: "12px",
          background: "#ffffff",
          padding: "25px",
          height: "100%",
        }}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          gap={1}
          mb={3}
        >
          {[
            "Crystallisation History",
            "HMRC Allowances",
            "HMRC Protections",
          ].map((label, index) => (
            <Button
              key={index}
              sx={{
                ...addButtonStyle,
                backgroundColor: tabValue === index ? "#031129" : "transparent",
                border: tabValue === index ? "none" : "1px solid #031129",
                color: tabValue === index ? "#fff" : "#031129",
                "&:hover": {
                  background: tabValue === index ? "#031129" : "transparent",
                },
              }}
              onClick={() => setTabValue(index)}
            >
              {label}
            </Button>
          ))}
        </Stack>

        <HMRCpage
          HMRCAllowancesData={HMRCAllowancesData}
          HMRCProtectionsData={HMRCProtectionsData}
          loading={loading}
          tabValue={tabValue}
        />

        {tabValue === 0 && (
          <>
            {loading ? (
              <Skeleton
                variant="rectangular"
                sx={{ height: "300px", borderRadius: "20px" }}
              />
            ) : (
              <TableContainer className="dashboardTable">
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headTableCellStyle}>Date</TableCell>
                      <TableCell sx={headTableCellStyle}>Type</TableCell>
                      <TableCell sx={headTableCellStyle}>Amount</TableCell>
                      <TableCell sx={headTableCellStyle}>
                        LTA used (%)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>LSA used</TableCell>
                      <TableCell sx={headTableCellStyle}>LSDBA used</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {withdrawHistoryData?.map((item, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell sx={tableCellStyle}>
                          {item?.date ? getFormattedDate(item?.date) : "--"}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {item?.bceType}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {`${portfolioCurrencySymbol}${formatNumber(
                            item?.grossAmount
                          )}`}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {parseFloat(item?.ltaPercentage * 100).toFixed(2)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {`£${formatNumber(item?.lsaAmountUsed)}`}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {`£${formatNumber(item?.lsdbaAmountUsed)}`}
                        </TableCell>
                      </TableRow>
                    ))}

                    {withdrawHistoryData?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          align="center"
                          sx={{ py: 3, fontSize: "16px", fontWeight: 600 }}
                        >
                          No BCE information yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}
