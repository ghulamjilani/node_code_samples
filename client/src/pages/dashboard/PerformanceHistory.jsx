import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chart from "react-apexcharts";
import {
  Box,
  Container,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { Sales } from "../../components/dashboard/overview/sales";
import { sectionHeading } from "../../components/Subcomponent";
import { GetDashboardStats } from "../../api/dashboard";

function PerformanceHistory() {
  const [portfolioCurrency, setPortfolioCurrency] = useState();

  const accessToken = localStorage.getItem("token");
  const smallScreenCheck = useMediaQuery("(min-width:700px)");
  const currentPortfolio = useSelector((state) => state.auth.currentPortfolio);
  const terceroUser = useSelector((state) => state.auth.terceroUser);

  const [loading, setLoading] = useState(false);
  const [chartSeries, setChartSeries] = useState([]);
  const [watchedStocksData, setWatchedStocksData] = useState();
  const [chartOptions, setChartOptions] = useState({
    xaxis: {
      categories: [],
    },
  });

  useEffect(() => {
    const portfolio = currentPortfolio
      ? terceroUser?.Portfolios?.filter(
          (port) => port.Id === currentPortfolio
        )?.[0]
      : terceroUser?.Portfolios?.[0];
    if (portfolio) {
      const portfolioSymbol = portfolio?.LatestValue?.Currency?.UpperSymbol;
      setPortfolioCurrency(portfolioSymbol);

      const fetchData = async () => {
        try {
          setLoading(true);
          const { data } = await GetDashboardStats(accessToken, portfolio?.Id);
          setWatchedStocksData(data.cardData.PortfolioStats);

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

          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log("Error:", error);
        }
      };

      fetchData();
    }
  }, [currentPortfolio, accessToken]);

  const barchartOptions = {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        dataLabels: {
          position: "top",
        },
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#b22222", // Red color for negative values
            },
            {
              from: 0,
              to: Infinity,
              color: "#31D093", // Green color for positive values
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return isNaN(val) ? "" : val + "%";
      },
      offsetY: smallScreenCheck ? -20 : -12.5,
      style: {
        fontSize: smallScreenCheck ? "12px" : "7.5px",
        colors: ["#304758"],
      },
    },

    xaxis: {
      categories: [
        "Annualised",
        "From Inception",
        "Year to Date",
        "1 Month",
        "3 Months",
        "6 Months",
        "1 Year",
        "2 Years",
        "3 Years",
      ],
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      labels: {
        show: true,
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  return (
    <Container maxWidth="xl">
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

      {loading ? (
        <Skeleton
          variant="rectangular"
          sx={{ height: "400px", borderRadius: "20px", my: 2 }}
        />
      ) : (
        <Box
          sx={{
            borderRadius: "12px",
            background: "#ffffff",
            padding: "25px",
            my: 2,
            pb: 6,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "left", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Typography variant="body1" sx={sectionHeading}>
              Portfolio Stats
            </Typography>
          </Stack>
          <Chart
            height={350}
            options={barchartOptions}
            series={[
              {
                name: "Stats Percentage",
                data: [
                  (watchedStocksData?.Annualised * 100).toFixed(2),
                  (watchedStocksData?.FromStartDate * 100).toFixed(2),
                  (watchedStocksData?.YearToDate * 100).toFixed(2),
                  (watchedStocksData?.OneMonth * 100).toFixed(2),
                  (watchedStocksData?.ThreeMonth * 100).toFixed(2),
                  (watchedStocksData?.SixMonth * 100).toFixed(2),
                  (watchedStocksData?.OneYear * 100).toFixed(2),
                  (watchedStocksData?.TwoYear * 100).toFixed(2),
                  (watchedStocksData?.ThreeYear * 100).toFixed(2),
                ],
              },
            ]}
            type="bar"
            width="100%"
          />
        </Box>
      )}
    </Container>
  );
}

export default PerformanceHistory;
