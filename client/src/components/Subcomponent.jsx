import {
  Typography,
  FormControl,
  Box,
  Select,
  MenuItem,
  styled,
  InputBase,
  Stack,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export const BootstrapInput = styled(InputBase)(({ padding, border }) => ({
  "& .MuiInputBase-input": {
    border: border || "1px solid #F3F4F8",
    borderRadius: "10px",
    padding: padding || "16.5px 14px",
    "&:focus": {
      border: border || "1px solid #151515",
      borderRadius: "10px",
    },
  },
}));

const BpIcon = styled("span")(() => ({
  borderRadius: "50%",
  width: 20,
  height: 20,
  border: "1px solid #B3ABBC",
}));

const BpCheckedIcon = styled("span")(() => ({
  backgroundColor: "#001c32",
  borderRadius: "50%",
  "&::before": {
    display: "block",
    width: 20,
    height: 20,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: '""',
  },
  "&:hover": {
    backgroundColor: "#001c32",
  },
}));

export function HeadingTypo({ text }) {
  return (
    <Typography
      variant="body1"
      sx={{
        background: "#001c32",
        borderRadius: "13px",
        color: "#fff",
        fontSize: "24px",
        fontWeight: "700",
        textAlign: "center",
        p: 2,
        mt: 2,
        mb: 4,
      }}
    >
      {text}
    </Typography>
  );
}

export const CustomSelect = ({
  options,
  defaultValue,
  value,
  name,
  register,
  textColor,
  background = "transparent",
  padding,
  border,
  givenWidth,
  onchangeFunction,
}) => {
  if (!register) {
    return console.error("Register is not a function!");
  }

  return (
    <Select
      fullWidth
      IconComponent={ExpandMoreIcon}
      input={<BootstrapInput padding={padding} border={border} />}
      defaultValue={defaultValue}
      value={value}
      required
      {...register(name)}
      onChange={onchangeFunction}
      sx={{
        color: textColor,
        background: background,
        borderRadius: "10px",
        width: givenWidth,
        "& .MuiSelect-icon": {
          color: textColor,
          marginRight: givenWidth ? 0.6 : 0,
        },
      }}
    >
      {options?.map((option, index) => (
        <MenuItem key={index} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export function RadioButtonsGroup({
  options,
  isRow,
  defaultValue,
  name,
  register,
  onchangeFunction,
  fontReduce,
}) {
  return (
    <FormControl sx={{ width: "100%", mt: 0.8 }}>
      <RadioGroup
        row={isRow}
        defaultValue={defaultValue}
        onChange={onchangeFunction}
      >
        {options.map((value, i) => (
          <FormControlLabel
            sx={{
              marginTop: isRow ? 0 : fontReduce ? "10px" : "20px",
              "& .MuiTypography-root": {
                color: fontReduce && "#8A92A6 !important",
                fontSize: fontReduce && "12px !important",
              },
            }}
            key={i}
            value={value}
            control={
              <Radio
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
                {...register(name)}
              />
            }
            label={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export const InputHeading = ({ text, optional, ...props }) => {
  return (
    <Typography
      variant="body1"
      {...props}
      sx={{
        fontSize: "16px",
        fontWeight: "600",
        textAlign: "left",
      }}
    >
      {text} {!optional && <span style={{ color: "red" }}>*</span>}
    </Typography>
  );
};

export const LightInputHead = ({ text, optional, ...props }) => {
  return (
    <Typography
      variant="body1"
      {...props}
      sx={{
        fontSize: "13px",
        fontWeight: "400",
        textAlign: "left",
        color: "#8A92A6",
      }}
    >
      {text} {!optional && <span style={{ color: "red" }}>*</span>}
    </Typography>
  );
};

export const DescribeText = ({ text, ...props }) => {
  return (
    <Typography
      {...props}
      variant="subtitle2"
      fontSize="11px"
      fontWeight="400"
      color="#8A92A6"
    >
      {text}
    </Typography>
  );
};

export const SignupStepperButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        width: "100%",
        height: "58px",
        padding: "8px 24px 8px 24px",
        borderRadius: "10px",
        background: "#001C32",
        color: "#fff",
        textTransform: "capitalize",
        fontSize: "16px",
        fontWeight: "600",
        "&:hover": {
          background: "#001C32",
        },
        "&:disabled": {
          background: "#001C32",
          color: "#8A92A6",
        },
      }}
    >
      {children}
    </Button>
  );
};

export const StepperBackButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        width: "100%",
        height: "58px",
        padding: "8px 24px 8px 24px",
        borderRadius: "10px",
        background: "#F3F4F8",
        color: "#001C32",
        textTransform: "capitalize",
        fontSize: "16px",
        fontWeight: "600",
        "&:hover": {
          background: "#F3F4F8",
        },
      }}
    >
      {children}
    </Button>
  );
};

export const inputCommonStyle = {
  my: 1,
  height: "58px",
  width: "100%",
  color: "#001c32",
  border: "1px solid #f3f4f8",
  borderRadius: "10px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #151515",
    },
  },
  input: {
    color: "#001c32",
    paddingLeft: "13px",
  },
};

export const tableCellStyle = {
  color: "#001C32",
  fontSize: "14px",
  fontWeight: 400,
};

export const headTableCellStyle = {
  color: "#8392AB",
  fontSize: "14px",
  fontWeight: 600,
};

export const sectionHeading = {
  color: "#001C32",
  fontSize: "20px",
  fontWeight: "500",
};

export const StyledSelect = ({
  options,
  defaultValue,
  miniwidth,
  name,
  ...props
}) => {
  return (
    <Select
      {...props}
      IconComponent={ExpandMoreIcon}
      input={<BootstrapInput padding="8px 20px" border="1px solid #8A92A6" />}
      defaultValue={defaultValue}
      name={name}
      required
      sx={{
        color: "#031129",
        background: "transparent",
        borderRadius: "10px",
        fontSize: "14px",
        width: miniwidth,
        "& .MuiSelect-icon": {
          color: "#031129",
          marginRight: 0.4,
        },
      }}
    >
      {options?.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export const addButtonStyle = {
  background: "#031129",
  color: "#fff",
  textTransform: "capitalize",
  fontSize: "14px",
  borderRadius: "10px",
  padding: "8px 20px",

  "&:hover": {
    background: "#031129",
  },
  "&:disabled": {
    color: "#9892A6",
  },
};

// --->> pagination component
export const PaginationComponent = ({
  goToPreviousPage,
  goToNextPage,
  page,
  totalPages,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      mt={3}
      gap={1.5}
    >
      <Box
        sx={paginationBoxStyle}
        style={{ cursor: "pointer" }}
        border="0.56px solid #BCBCBC"
        onClick={goToPreviousPage}
      >
        <KeyboardArrowLeftIcon
          fontSize="small"
          sx={{ color: page === 1 && "#BCBCBC" }}
        />
      </Box>

      <Box
        sx={paginationBoxStyle}
        bgcolor="#031129"
        color="#fff"
        fontSize="12px"
        fontWeight="600"
      >
        {page}
      </Box>

      <Box
        sx={paginationBoxStyle}
        color="#BCBCBC"
        fontSize="13px"
        fontWeight="700"
      >
        of
      </Box>
      <Box
        sx={paginationBoxStyle}
        border="0.56px solid #031129"
        fontSize="12px"
        fontWeight="600"
      >
        {totalPages}
      </Box>

      <Box
        sx={paginationBoxStyle}
        style={{ cursor: "pointer" }}
        border="0.56px solid #BCBCBC"
        onClick={goToNextPage}
      >
        <KeyboardArrowRightIcon
          fontSize="small"
          sx={{ color: page === totalPages && "#BCBCBC" }}
        />
      </Box>
    </Stack>
  );
};
///////////////////////////////////

export const DescriptionText = ({ text }) => {
  return (
    <Typography
      variant="subtitle2"
      fontSize="12px"
      fontWeight="400"
      color="#8A92A6"
      mt={1}
    >
      {text}
    </Typography>
  );
};

export const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#000",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#000",
    fontSize: "13px",
  },
}));

export function HeadingCommon({ text }) {
  return (
    <Typography
      variant="body1"
      sx={{
        background: "linear-gradient(90deg, #0066A7 0%, #001C31 100%)",
        borderRadius: "13px",
        color: "#FEFEFE",
        fontSize: "16px",
        fontWeight: "700",
        textAlign: "center",
        p: 1,
        mb: 4,
      }}
    >
      {text}
    </Typography>
  );
}
