import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BackupIcon from "@mui/icons-material/Backup";

import { InputHeading, inputCommonStyle } from "../../components/Subcomponent";
import { contactUsRequest } from "../../api/settings";

function ContactUs() {
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState([]);
  const [formFile, setFormFile] = useState(null);
  const fileInputRef = useRef(null);

  const FILE_SIZE_LIMIT = 5 * 1024 * 1024;

  const handleDrop = (event) => {
    event.preventDefault();

    const selectedFile = event.dataTransfer.files[0];
    if (selectedFile.size > FILE_SIZE_LIMIT) {
      setError(true);
      setMsg(["File size must be less than 5MB"]);
    } else {
      setError(false);
      setMsg("");
      setFormFile(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const chooseFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.size > FILE_SIZE_LIMIT) {
      setError(true);
      setMsg(["File size must be less than 5 MB"]);
    } else {
      setError(false);
      setMsg("");
      setFormFile(selectedFile);
    }
  };

  const handleContactUs = async (event) => {
    event.preventDefault();

    if (event.currentTarget.message.value.length < 20) {
      setError(true);
      setMsg(["Message must be at least 20 characters long"]);
      return;
    }

    const loginData = new FormData(event.currentTarget);
    loginData.append("document", formFile);

    const request = await contactUsRequest(loginData);
    const { message, success, errors } = request;
    if (errors?.length) {
      setError(true);
      setMsg(errors.map((err) => err.message));
    } else {
      setError(!success);
      setMsg([message]);
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: "15px",
          p: 4,
          mb: 5,
        }}
      >
        <center>
          <form onSubmit={handleContactUs}>
            <Box
              sx={{
                width: { xs: "95%", sm: "75%", md: "65%" },
                bgcolor: "background.paper",
                p: 4,
                px: { xs: 2, sm: 6, md: 12 },
                mb: 5,
              }}
            >
              <Typography
                mb={3}
                variant="body1"
                fontSize={{ xs: "25px", md: "40px" }}
              >
                Get In Touch
              </Typography>
              {msg?.length
                ? msg.map((message) => {
                    return (
                      <Alert
                        sx={{ mb: 2 }}
                        severity={error ? "error" : "success"}
                      >
                        {message}
                      </Alert>
                    );
                  })
                : ""}

              <Box width={"100%"}>
                <InputHeading mb={1} text={"Message"} />
                <TextField
                  multiline={true}
                  rows={10}
                  fullWidth
                  sx={{ ...inputCommonStyle, height: 263 }}
                  placeholder="Write your message ...."
                  required
                  name="message"
                />

                {formFile ? (
                  <Box
                    sx={{
                      background: "#90EAFF",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 1.5,
                      my: 2,
                    }}
                  >
                    <Typography variant="body1">{formFile.name}</Typography>
                    <CloseIcon
                      sx={{ color: "#000", cursor: "pointer" }}
                      onClick={() => {
                        setFormFile(null);
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      border: "2px dashed #9c9c9c",
                      borderRadius: "5px",
                      padding: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      my: 2,
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleBoxClick}
                  >
                    <Typography
                      variant="body1"
                      fontSize={{ xs: "16px", md: "18px" }}
                      color="#606075"
                      my={2.5}
                    >
                      Drag and drop your file here,
                      <br /> or click to upload.
                    </Typography>
                    <BackupIcon sx={{ fontSize: "54px", color: "#000" }} />
                    <label
                      htmlFor="getFile"
                      style={{
                        cursor: "pointer",
                        color: "#fe8d57",
                        fontWeight: "600",
                      }}
                    >
                      <input
                        type="file"
                        id="getFile"
                        accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .gif, .bmp, .txt, .rtf"
                        style={{ display: "none" }}
                        onChange={chooseFile}
                        ref={fileInputRef}
                      />
                    </label>
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                sx={{
                  background: "#001C32",
                  color: "white",
                  px: 3,
                  py: 1.5,
                  mt: 2,
                  fontWeight: 600,
                  fontSize: 16,
                  borderRadius: 2,
                  "&:hover": {
                    background: "#001C32",
                    color: "white",
                  },
                }}
              >
                Send Message
              </Button>
            </Box>
          </form>
        </center>
      </Box>
    </Container>
  );
}

export default ContactUs;
