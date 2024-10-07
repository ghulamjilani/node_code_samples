import { InputAdornment, TextField } from "@mui/material";

export const StyledInput = ({ ...props }) => {
  return (
    <TextField
      {...props}
      sx={{
        my: 1,
        height: "58px",
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
          paddingLeft: "12px",
        },
      }}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="end">{props?.icon}</InputAdornment>
        ),
      }}
    />
  );
};
