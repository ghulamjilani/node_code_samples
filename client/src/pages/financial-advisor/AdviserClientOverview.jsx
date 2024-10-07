import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Skeleton,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

import { MoneyIn } from "../../components/dashboard/overview/moneyIn";
import Transactions from "../../components/dashboard/overview/latest-orders";
import { Sales } from "../../components/dashboard/overview/sales";
import { OverallValue } from "../../components/dashboard/overview/OverallValue";
import { MoneyOut } from "../../components/dashboard/overview/moneyOut";
import { IncreaseFromInception } from "../../components/dashboard/overview/IncreaseFromInception";
import {
  GetDashboardStats,
  GetDashboardTransactions,
  GetUpdatedDashboardStats,
} from "../../api/dashboard";
import { getAdviserClient } from "../../api/clientHandler";
import { RouteSelect } from "../../components/financial-advisor/components/RouteSelect";
import { clientOverview } from "../../features/authSlice";

const environment = import.meta.env.VITE_ENVIRONMENT;

function formatValue(value, currency) {
  return value && currency
    ? currency +
        value?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
    : 0;
}

function calculateChangeInInception(currentValue, moneyIn, moneyOut) {
  // Ensure all inputs are numeric
  if (
    typeof currentValue !== "number" ||
    typeof moneyIn !== "number" ||
    typeof moneyOut !== "number"
  ) {
    throw new Error("Invalid input. All inputs must be numeric.");
  }

  const subtractionMoney = moneyIn - moneyOut;
  // Calculate the change in inception
  const changeInInception = currentValue - subtractionMoney;

  // Calculate the percentage change in inception relative to Money In
  const percentageChangeInInception =
    (changeInInception / subtractionMoney) * 100;

  return percentageChangeInInception === Infinity
    ? 0
    : percentageChangeInInception;
}

export default function AdviserClientOverview() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);
  const [apiCount, setApiCount] = useState(0);
  const selectedPortfolio = useSelector((state) => state.auth.currentPortfolio);
  const portfoliosDetail = useSelector((state) => state.auth.portfolioOptions);
  const client = useSelector((state) => state.auth.clientOverview);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const accessToken = localStorage.getItem("token");
  const [portfolioCurrency, setPortfolioCurrency] = useState();
  const [loading, setLoading] = useState(false);
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    xaxis: {
      categories: [],
    },
  });

  const [tableData, setTableData] = useState([]);
  const [cardData, setCardData] = useState({
    totalMoneyIn: 0,
    totalMoneyOut: 0,
    currentValue: 0,
    changeInInception: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: clientData } = await getAdviserClient(id);
        dispatch(clientOverview(clientData?.client));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("Error:", error);
      }
    };

    if (!client?.id) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const portfolio = selectedPortfolio
      ? portfoliosDetail?.filter((port) => port?.Id === selectedPortfolio)?.[0]
      : portfoliosDetail?.[0];

    if (portfolio) {
      const currentValue = portfolio?.LatestValue?.MarketValue;
      const portfolioSymbol = portfolio?.LatestValue?.Currency?.UpperSymbol;
      setPortfolioCurrency(portfolioSymbol);

      const fetchData = async () => {
        try {
          let data;
          if (apiCount === 0) {
            setLoading(true);
            const { data: dashboardData } = await GetDashboardStats(
              accessToken,
              portfolio?.Id,
              currentValue
            );
            data = dashboardData;
            setApiCount(apiCount + 1);
            setLoading(false);
          } else if (apiCount === 1) {
            setIsUpdating(true);
            const { data: dashboardData } = await GetUpdatedDashboardStats(
              accessToken,
              portfolio?.Id,
              currentValue
            );
            data = dashboardData;
            setApiCount(apiCount + 1);
            setIsUpdating(false);
          } else {
            return;
          }

          // Set the data directly from the backend response
          setCardData({
            totalMoneyIn: formatValue(
              data.cardData.totalMoneyIn,
              data.cardData.flowsCurrency
            ),
            totalMoneyOut: formatValue(
              data.cardData.totalMoneyOut,
              data.cardData.flowsCurrency
            ),
            currentValue: formatValue(currentValue, portfolioSymbol),
            changeInInception: calculateChangeInInception(
              currentValue,
              data.cardData.totalMoneyIn,
              data.cardData.totalMoneyOut
            ),
          });

          // Set chart data for performance and investments
          setChartSeries(data.graphData.series);

          // Update chart options with dates
          setChartOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: {
              ...prevOptions.xaxis,
              categories: data.graphData.categories,
            },
          }));
        } catch (error) {
          setLoading(false);
          setIsUpdating(false);
          console.log("Error:", error);
        }
      };
      if (portfoliosDetail?.length > 0) {
        fetchData();
      } else {
        setLoading(true);
      }
      fetchData();
    }
  }, [selectedPortfolio, portfoliosDetail, apiCount]);

  useEffect(() => {
    const portfolio = selectedPortfolio
      ? portfoliosDetail?.filter((port) => port?.Id === selectedPortfolio)?.[0]
      : portfoliosDetail?.[0];
    if (portfolio) {
      const fetchData = async () => {
        try {
          setTransactionLoading(true);
          const { data } = await GetDashboardTransactions(
            accessToken,
            portfolio?.Id,
            client?.terceroClientId
          );

          setTableData(data.transactions.Items || []);
          setTransactionLoading(false);
        } catch (error) {
          console.log("Error:", error);
        }
      };

      fetchData();
    }
  }, [selectedPortfolio, portfoliosDetail, client]);
  return (
    <Container maxWidth="xl">
      <RouteSelect clientId={id} client={client} page={"/client-overview"} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: { xs: "right", sm: "center" },
          mb: 1,
        }}
      >
        {environment !== "PRODUCTION" && (
          <>
            {isUpdating && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <CircularProgress size={20} />
                <Typography variant="body2">Updating...</Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      <Grid
        container
        spacing={2}
        mb={3}
        sx={{
          backgroundColor: "#f7f6f1",
        }}
      >
        <Grid item lg={3} md={6} sm={6} xs={12}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ height: "100%", borderRadius: "20px" }}
            />
          ) : (
            <OverallValue
              title={"Current Value"}
              sx={{
                height: "100%",
                borderRadius: "20px",
                boxShadow: "0px 10px 30px 0px #1126920D",
              }}
              value={cardData?.currentValue}
            />
          )}
        </Grid>
        <Grid item lg={3} md={6} sm={6} xs={12}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ height: "100%", borderRadius: "20px" }}
            />
          ) : (
            <MoneyIn
              diff={12}
              trend="up"
              sx={{
                height: "100%",
                borderRadius: "20px",
                boxShadow: "0px 10px 30px 0px #1126920D",
              }}
              value={cardData?.totalMoneyIn}
            />
          )}
        </Grid>
        <Grid item lg={3} md={6} sm={6} xs={12}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ height: "100%", borderRadius: "20px" }}
            />
          ) : (
            <MoneyOut
              diff={16}
              trend="down"
              sx={{
                height: "100%",
                borderRadius: "20px",
                boxShadow: "0px 10px 30px 0px #1126920D",
              }}
              value={cardData?.totalMoneyOut}
            />
          )}
        </Grid>

        <Grid item lg={3} md={6} sm={6} xs={12}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ height: "130px", borderRadius: "20px" }}
            />
          ) : (
            <IncreaseFromInception
              sx={{
                height: "100%",
                borderRadius: "20px",
                boxShadow: "0px 10px 30px 0px #1126920D",
              }}
              value={`${cardData?.changeInInception?.toFixed(2)}`}
              increase={
                cardData?.changeInInception?.toFixed(2) > 0 ? true : false
              }
            />
          )}
        </Grid>

        <Grid item lg={12} xs={12}>
          {loading ? (
            <Skeleton
              variant="rectangular"
              sx={{ height: "400px", borderRadius: "20px" }}
            />
          ) : (
            <Sales
              chartSeries={chartSeries}
              chartOptions={chartOptions}
              portfolioCurrency={portfolioCurrency}
              sx={{
                height: "100%",
                borderRadius: "20px",
                boxShadow: "0px 10px 30px 0px #1126920D",
                p: 1,
              }}
            />
          )}
        </Grid>
        <Grid item lg={12} xs={12}>
          {transactionLoading ? (
            <Skeleton
              variant="rectangular"
              sx={{ height: "400px", borderRadius: "20px" }}
            />
          ) : (
            <Transactions tableData={tableData} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
