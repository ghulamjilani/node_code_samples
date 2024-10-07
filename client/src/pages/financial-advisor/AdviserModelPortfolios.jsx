import { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  Select,
  Skeleton,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  BootstrapInput,
  headTableCellStyle,
  sectionHeading,
  tableCellStyle,
} from "../../components/Subcomponent";
import {
  getPortfolioInvestmentInfo,
  getPortfolioLists,
} from "../../api/contributions";
import { AdviserClients } from "../../components/financial-advisor/components/AdviserClients";

export default function AdviserModelPortfolios() {
  const [portfolioListArray, setPortfolioListArray] = useState([]);
  const [allocationPercentageList, setAllocationPercentageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [otherLoading, setOtherLoading] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState();
  const accessToken = localStorage.getItem("token");

  const handleSrategyFunction = async () => {
    try {
      setLoading(true);
      const { data } = await getPortfolioLists(accessToken);

      const portfoliosArray = data?.modelStructures;
      const sortedArray = portfoliosArray?.sort((a, b) =>
        a?.name.localeCompare(b?.name)
      );

      setPortfolioListArray(sortedArray);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    handleSrategyFunction();
  }, []);

  const handlePortfolioList = async (event) => {
    const selectedValue = event.target.value;

    setCurrentPortfolio(
      portfolioListArray?.filter((p) => p.id === selectedValue)?.[0]?.name
    );

    if (selectedValue) {
      try {
        setOtherLoading(true);
        const { data } = await getPortfolioInvestmentInfo(
          accessToken,
          selectedValue
        );

        setAllocationPercentageList(data?.list);
        setOtherLoading(false);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  return (
    <Container maxWidth="xl">
      {loading ? (
        <Skeleton
          variant="rectangular"
          sx={{ height: "200px", borderRadius: "20px" }}
        />
      ) : (
        <>
          <Box
            sx={{
              borderRadius: "12px",
              background: "#ffffff",
              padding: "25px",
              height: "100%",
              mb: "20px",
            }}
          >
            <Typography variant="body1" sx={sectionHeading} mb={2}>
              Portfolio Allocation
            </Typography>
            <Select
              IconComponent={ExpandMoreIcon}
              fullWidth
              input={<BootstrapInput />}
              defaultValue={"Select a Portfolio"}
              name="portfolioListItem"
              required
              onChange={handlePortfolioList}
              sx={{
                color: "#212121",
                background: "transparent",
                borderRadius: "10px",
                "& .MuiSelect-icon": {
                  color: "#757575",
                },
              }}
            >
              <MenuItem value={"Select a Portfolio"} disabled={true}>
                Select a Portfolio
              </MenuItem>
              {portfolioListArray?.map((option, index) => (
                <MenuItem key={index} value={option?.id}>
                  {option?.name}
                </MenuItem>
              ))}
            </Select>
            {otherLoading ? (
              <Skeleton
                variant="rectangular"
                sx={{ height: "200px", mt: 4, borderRadius: "20px" }}
              />
            ) : (
              <TableContainer sx={{ mt: 4 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headTableCellStyle}>
                        Investment Name
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>ISIN </TableCell>
                      <TableCell sx={headTableCellStyle}>Currency</TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Allocation %
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocationPercentageList?.map((item, rowIdxxx) => {
                      return (
                        <TableRow key={rowIdxxx}>
                          <TableCell sx={tableCellStyle}>
                            {item?.InvestmentName}
                          </TableCell>
                          <TableCell sx={tableCellStyle}>
                            {item?.ISIN}
                          </TableCell>
                          <TableCell sx={tableCellStyle}>
                            {item?.Currency}
                          </TableCell>
                          <TableCell sx={tableCellStyle}>
                            {item?.Allocation}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {!allocationPercentageList?.length && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          align="center"
                          sx={{ py: 3, fontSize: "16px", fontWeight: 600 }}
                        >
                          No Portfolios Found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          <AdviserClients
            modelStructurName={currentPortfolio}
            portfolioPage={true}
          />
        </>
      )}
    </Container>
  );
}
