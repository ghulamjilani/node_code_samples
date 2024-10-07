import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";

import {
  headTableCellStyle,
  sectionHeading,
  tableCellStyle,
} from "../../components/Subcomponent";
import { getFormattedDate } from "../../utills/dateFormatter";
import { formatNumber } from "../../utills/generalFunctions";

export default function HMRCpage({
  HMRCProtectionsData,
  HMRCAllowancesData,
  loading,
  tabValue,
}) {
  return (
    <>
      {tabValue === 1 && (
        <>
          <Box mt={2}>
            {/* Lump Sum & Death Benefit Allowance table */}
            <Typography variant="body1" sx={{ ...sectionHeading, mb: 2 }}>
              Lump Sum & Death Benefit Allowance
            </Typography>

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
                      <TableCell sx={headTableCellStyle}>
                        Standard Allowance (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Protected Allowance (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Used Internally (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Transfers In (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Used Externally (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Transitional (£)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {HMRCAllowancesData?.map((item, indx) => (
                      <TableRow key={indx}>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsdbaStandardAllowance)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsdbaProtectedAllowance)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsdbaUsedInternally)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsdbaUsedTransferIn)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsdbaUsedExternally)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsdbaUsedTransitional)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {HMRCAllowancesData?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          align="center"
                          sx={{ py: 3, fontSize: "16px", fontWeight: 600 }}
                        >
                          No Lump Sum & Death Benefit Allowance Data Found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
          {/* Lump Sum Allowance table */}
          <Box mt={3}>
            <Typography variant="body1" sx={{ ...sectionHeading, mb: 2 }}>
              Lump Sum Allowance
            </Typography>

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
                      <TableCell sx={headTableCellStyle}>
                        Standard Allowance (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Protected Allowance (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Used Internally (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Transfers In (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Used Externally (£)
                      </TableCell>
                      <TableCell sx={headTableCellStyle}>
                        Transitional (£)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {HMRCAllowancesData?.map((item, indx) => (
                      <TableRow key={indx}>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsaStandardAllowance)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsaProtectedAllowance)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsaUsedInternally)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsaUsedTransferIn)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsaUsedExternally)}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          {formatNumber(item?.lsaUsedTransitional)}
                        </TableCell>
                      </TableRow>
                    ))}

                    {HMRCAllowancesData?.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          align="center"
                          sx={{ py: 3, fontSize: "16px", fontWeight: 600 }}
                        >
                          No Lump Sum Allowance Data Found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </>
      )}
      {tabValue === 2 && (
        <>
          {/* HMRC Protections table */}
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
                    <TableCell sx={headTableCellStyle}>
                      Protection Type
                    </TableCell>
                    <TableCell sx={headTableCellStyle}>
                      HMRC Registration Ref
                    </TableCell>
                    <TableCell sx={headTableCellStyle}>
                      HMRC Registration Date
                    </TableCell>
                    <TableCell sx={headTableCellStyle}>
                      Revocation Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {HMRCProtectionsData?.map((item, indx) => (
                    <TableRow key={indx}>
                      <TableCell sx={tableCellStyle}>
                        {item?.protectionType ?? "--"}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {item?.hmrcRegistrationReference ?? "--"}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {item?.hmrcRegistrationDate
                          ? getFormattedDate(item?.hmrcRegistrationDate)
                          : "--"}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {item?.revocationDate
                          ? getFormattedDate(item?.revocationDate)
                          : "--"}
                      </TableCell>
                    </TableRow>
                  ))}

                  {HMRCProtectionsData?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        align="center"
                        sx={{ py: 3, fontSize: "16px", fontWeight: 600 }}
                      >
                        No HMRC Protections Data Found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </>
  );
}
