import { Box, Typography, useTheme, useMediaQuery, Button, TextField, Collapse, Alert, IconButton } from "@mui/material";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import url from '../../api/Serverhost';
import CloseIcon from '@mui/icons-material/Close';
import Logo from './Navbar.png';
import PhoneInput from 'material-ui-phone-number';

export default function ReactivateAccountPage() {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();

  const [Alertopen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [msg, setMsg] = useState("error");


  const initialFormData = {
    fullName: '',
    mobileNumber: '',
    email: '',
    issueDescription: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleMobileNumberChange = (value) => {
    // Assuming 'value' is the phone number value provided by PhoneInput
    setFormData(prevData => ({
      ...prevData,
      mobileNumber: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/reactivateAccount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertOpen(true);
        setMessage(data.message);
        setMsg("success");
        setFormData(initialFormData)
      } else {
        setAlertOpen(true);
        setMessage(data.message);
      }
      console.log(formData);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Box>
        {/* Navbar */}
        <Box
          width="100%"
          backgroundColor={theme.palette.background.alt}
          p="1rem 5%"
          textAlign="center"
          position="sticky"
          top="0"
          zIndex="1000"
        >
          <Typography fontWeight="bold" fontSize="32px" color="primary" onClick={() => { navigate("/") }} sx={{
            "&:hover": {
              cursor: "pointer",
            }
          }}>
            <img src={Logo} alt="CampusNet" className="navbar-logo" onClick={() => {
              navigate("/home");
              navigate(0);
            }}
              width={"250rem"}
            />
          </Typography>
        </Box>

        <Box
          width={isNonMobileScreens ? "60%" : "93%"}
          p="2rem"
          m="1.5rem auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Typography fontWeight="500" variant="h4" sx={{ mb: "0.4rem" }}>
            Your Personal Account was Disabled
          </Typography>

          <Box>
            <Typography fontWeight="100" variant="h6">
              If you believe your account was disabled in error, we understand your concern and want to assist you in investigating the situation further. To help us address this issue, please provide the following information so that we can initiate an investigation:
            </Typography>
            <Typography fontWeight="500" variant="h6">
              ( As per your Login Details )
            </Typography>
            <form style={{ marginTop: "1rem" }} onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="25px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobileScreens ? undefined : "span 4" },
                }}
              >
                <TextField
                  label="Login email address"
                  onChange={handleChange}
                  name="email"
                  value={formData.email}
                  sx={{ gridColumn: 'span 4' }}
                  fullWidth
                  required
                />

                <TextField
                  label="Full Name"
                  name="fullName"
                  onChange={handleChange}
                  value={formData.fullName}
                  sx={{ gridColumn: 'span 2' }}
                  fullWidth
                  required
                />

                <PhoneInput
                  defaultCountry={'in'}
                  label="Mobile Number"
                  name="mobileNumber"
                  onChange={handleMobileNumberChange}
                  value={formData.mobileNumber}
                  variant="outlined"
                  sx={{ mb: "1rem", gridColumn: 'span 2' }}
                  inputProps={{
                    autoComplete: 'off'
                  }}
                  required
                />

                <textarea
                  aria-label="issue description"
                  placeholder="Issue Description"
                  rows={3}
                  name="issueDescription"
                  onChange={handleChange}
                  value={formData.issueDescription}
                  required
                  style={{ gridColumn: 'span 4', resize: 'vertical', width: '100%', padding: '10px' }}
                />

              </Box>

              <Box sx={{ width: '100%', mt: "1rem" }}>
                <Collapse in={Alertopen}>
                  <Alert
                    severity={msg}
                    style={{ fontSize: "0.9rem" }}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setAlertOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 1 }}
                  >
                    <span>
                      {message}.
                      <span
                        onClick={() => {
                          navigate("/");
                        }}
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          marginLeft: "0.4rem"
                        }}
                      >
                        Go Back to Login Page
                      </span>
                    </span>
                  </Alert>
                </Collapse>
              </Box>

              <Box sx={{ marginTop: "0.5rem" }}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button type="reset" variant="contained" color="error" sx={{ ml: "1rem" }} onClick={()=>{navigate(0)}}>
                  Reset
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}
