import { Backdrop } from "@mui/material";

function CustomLoading({ loading }) {
  return (
    <>
      <Backdrop
        sx={{
          backgroundColor: "transparent",
          zIndex: 9999999999999,
        }}
        open={loading}
      >
        <div className="cont">
          <div className="dots d1" />
          <div className="dots d2" />
          <div className="dots d3" />
          <div className="dots d4" />
          <div className="dots d5" />
          <div className="dots d6" />
          <div className="dots d7" />
          <div className="dots d8" />
        </div>
      </Backdrop>
    </>
  );
}

export default CustomLoading;
