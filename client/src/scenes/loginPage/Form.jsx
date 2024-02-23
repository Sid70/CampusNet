import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Modal,
  Link,
  Alert,
  Collapse,
  IconButton,
  InputAdornment,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import CloseIcon from '@mui/icons-material/Close';
import url from '../../api/Serverhost';
import DeactivatedAccountMessage from "./deactivateAccount/DeactivatedAccountMessage";
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PhoneInput from 'material-ui-phone-number';
import CircularProgress from '@mui/material/CircularProgress';

const registerSchema = yup.object().shape({
  fullName: yup.string().required("required"),
  mobileNumber: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  fullName: "",
  mobileNumber: "",
  bio: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const generateCaptcha = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captcha += characters.charAt(randomIndex);
  }

  return captcha;
};

const scrollToDown = () => {
  window.scrollTo({
    top: 600,
    behavior: 'smooth',
  });
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [Alertopen, setAlertOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Captcha System
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaValue, setCaptchaValue] = useState('');

  const handleReload = () => {
    setCaptcha(generateCaptcha());
  };

  // OTP System
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  // New Password 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false);


  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    try {
      const savedUserResponse = await fetch(`${url}/auth/register`, {
        method: "POST",
        body: formData,
      });

      if (!savedUserResponse.ok) {
        // Check if the request was successful
        const errorData = await savedUserResponse.json();
        console.log("Error occurred:", errorData.error);
        setMessage(errorData.error);
        setAlertOpen(true);
        scrollToDown();
      } else {
        const savedUser = await savedUserResponse.json();
        onSubmitProps.resetForm();

        if (savedUser) {
          setPageType("login");
          navigate(0);
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setMessage("An unexpected error occurred.");
      setAlertOpen(true);
      scrollToDown();
    }
  };


  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch(`${url}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        }
      );
      const loggedIn = await loggedInResponse.json();
      onSubmitProps.resetForm();

      if (loggedIn.error) {
        console.log("Error occurred:", loggedIn.error); // Log the error message
        setMessage(loggedIn.error);
        setAlertOpen(true);
        scrollToDown();
      } else {
        console.log("Successful login");
        if (loggedIn.user.isDeactivated) {
          setAlertOpen(true);
          console.log("deactivated Account")
          setMessage(<DeactivatedAccountMessage remainingDays={loggedIn.user.daysRemaingToDeleteAccount} />);
          scrollToDown();
        }
        else {
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token
            })
          );
          navigate("/home");
        }
      }
    } catch (error) {
      console.error(error)
    }
  };

  // Forget password Modal open & close

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowForgotPasswordModal(false);
  };

  // Show create password

  const handleCreatePassword = () => {
    setShowCreatePasswordModal(true);
  };

  const handleCloseCreatePasswordModal = () => {
    setShowCreatePasswordModal(false);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (captcha !== captchaValue) {
      setAlertOpen(true);
      setMessage("Invalid Captcha!");
      scrollToDown();
      setCaptchaValue("");
      handleReload();
      return;
    }

    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  // OTP MAnagement
  const handleSubmitEmail = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true

    try {
      const response = await fetch(`${url}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const res = await response.json();

      if (response.ok) {
        alert(res.message); // Display success message
        setOtpSent(true);
      } else {
        alert(res.message); // Display error message
      }
    } catch (error) {
      console.error(error); // Log any caught errors
      // Display error message or handle error state
    } finally {
      setLoading(false); // Set loading state back to false after request completes
    }
  };



  const handleSubmitOTP = async (event) => {
    event.preventDefault();
    try {
      // Handle OTP verification logic here
      console.log('Entered OTP:', otp);

      const response = await fetch(`${url}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parsing the error response body
        alert(errorData.message); // Display the error message in an alert box
      }
      else {
        handleCreatePassword();
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Confirm Password 
  const ConfirmPasswordChange = async (event) => {
    event.preventDefault();
    try {
      console.log(confirmPassword);

      const response = await fetch(`${url}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
      }
      else {
        const Data = await response.json();
        alert(Data.message);
        handleCloseCreatePasswordModal();
      }
    } catch (error) {
      console.error(error); // Handle error
    }
  }

  const getPageTitleText = () => {
    switch (pageType) {
      case "login":
        return "Sign in";
      case "register":
        return "Sign Up";
      default:
        return "";
    }
  };

  // Stepper Implementation
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = ['Personal Info', 'Location & Picture', 'Email & Password'];


  return (
    <>
      <Avatar sx={{ m: 'auto', bgcolor: 'secondary.main' }}>
        {(pageType === 'login' ? (<LoginIcon fontSize="medium" />) : <PersonAddAltIcon fontSize="medium" />)}
      </Avatar>

      <Typography component="h4" variant="h4" sx={{ mb: "1rem", textAlign: "center" }}>
        {getPageTitleText()}
      </Typography>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => {

          const handleDrop = (acceptedFiles) => {
            setFieldValue("picture", acceptedFiles[0]);
          };
          const getStepContent = (step) => {
            switch (step) {
              case 0:
                return (
                  <>
                    <TextField
                      label="Full Name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="fullName"
                      value={values.fullName || ''}
                      error={Boolean(touched.fullName) && Boolean(errors.fullName)}
                      helperText={touched.fullName && errors.fullName}
                      sx={{ mb: "1rem" }}
                      fullWidth
                      required
                    />

                    <PhoneInput
                      defaultCountry={'in'}
                      label="Mobile Number"
                      value={values.mobileNumber || ''}
                      name="mobileNumber"
                      error={Boolean(touched.mobileNumber) && Boolean(errors.mobileNumber)}
                      helperText={touched.mobileNumber && errors.mobileNumber}
                      onChange={(value) => handleChange({ target: { name: 'mobileNumber', value } })}
                      onBlur={handleBlur}
                      variant="outlined"
                      fullWidth
                      sx={{ mb: "1rem" }}
                      inputProps={{
                        autoComplete: 'off'
                      }}
                    />



                    {/* Its Not Required */}
                    <TextField
                      sx={{ width: "100%", wordWrap: "break-word" }}
                      id="bio"
                      multiline
                      value={values.bio}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Add Bio......"
                      rows={3}
                    />

                    <Box sx={{ mt: "1rem", textAlign: "end" }}>
                      <Button variant="contained" onClick={handleNext} disabled={!values.fullName || !values.mobileNumber} >
                        Next
                      </Button>
                    </Box>

                  </>
                );
              case 1:
                return (
                  <>
                    {console.log(values)}
                    <TextField
                      label="Location"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="location"
                      value={values.location || ''} // Initialize with an empty string if the value is undefined
                      error={Boolean(touched.location) && Boolean(errors.location)}
                      helperText={touched.location && errors.location} // Use lowercase helpertext prop
                      sx={{ mb: "1rem" }}
                      fullWidth
                      required
                    />

                    <FormControl fullWidth sx={{ mb: "1rem" }}>
                      <InputLabel id="occupation-select-label">Occupation *</InputLabel>
                      <Select
                        onBlur={handleBlur}
                        labelId="occupation-select-label"
                        id="occupation-select"
                        value={values.occupation || ''}
                        label="occupation*"
                        name="occupation"
                        onChange={handleChange}
                        error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                        helperText={touched.occupation && errors.occupation}
                        required
                      >
                        <MenuItem value="">Select Occupation</MenuItem>
                        <MenuItem value="Student">Student</MenuItem>
                        <MenuItem value="Professor">Professor</MenuItem>
                        <MenuItem value="Club Secretary">Club Secretary</MenuItem>
                      </Select>
                      {touched.occupation && !values.occupation && (
                        <Box color="red" fontSize="0.65rem" sx={{ marginLeft: "0.98rem" }}>
                          required
                        </Box>
                      )}
                    </FormControl>

                    <Box
                      gridColumn="span 4"
                      border={`1px solid ${palette.neutral.medium}`}
                      borderRadius="5px"
                      p="1rem"
                    >
                      <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <Box
                            {...getRootProps()}
                            border={`2px dashed ${palette.primary.main}`}
                            p="1rem"
                            sx={{ "&:hover": { cursor: "pointer" } }}
                          >
                            <input {...getInputProps()} />
                            {!values.picture ? (
                              <p>Add Picture Here *</p>
                            ) : (
                              <FlexBetween>
                                <Typography>{values.picture.name}</Typography>
                                <EditOutlinedIcon />
                              </FlexBetween>
                            )}
                          </Box>
                        )}
                      </Dropzone>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: "1rem" }}>
                      <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                      <Button variant="contained" onClick={handleNext} disabled={!values.location || !values.occupation || !values.picture} >
                        Next
                      </Button>
                    </Box>
                  </>
                );
              case 2:
                return (
                  <>
                    <TextField
                      label="Email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      name="email"
                      error={Boolean(touched.email) && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{ mb: "1rem" }}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Password"
                      required
                      type={showPassword ? "text" : "password"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      name="password"
                      error={Boolean(touched.password) && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: "1rem" }}
                      fullWidth
                    />

                    {/* Implement Captcha Features */}
                    <Box>
                      <Box sx={{ mt: "0rem" }}>
                        <label htmlFor="Enter Captcha">Enter the text as shown in the below</label><br />
                        <input type="text" placeholder="Enter Captcha" id="Enter Captcha" style={{ marginTop: "3px", padding: "10px", width: isNonMobile ? "40%" : "70%" }} value={captchaValue}
                          onChange={(e) => setCaptchaValue(e.target.value)}
                          required
                        />
                      </Box>
                      <Box display="flex" alignItems="center" sx={{ mt: "0.5rem" }}>
                        <Typography variant="h5" style={{ fontWeight: "bold", letterSpacing: "5px", border: "1px solid lightgray", padding: "5px 2rem" }}>{captcha}</Typography>
                        <IconButton onClick={handleReload} color="primary" style={{ marginLeft: 10 }}>
                          <RefreshIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: "0.5rem" }}>
                      <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                      <Button variant="contained" type="submit" disabled={!values.email || !values.password || !captchaValue} >
                        Register
                      </Button>
                    </Box>
                  </>
                );
              default:
                return 'Unknown step';
            }
          };

          return (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >

                {/* For Register Page */}

                {isRegister && (
                  <Box sx={{ gridColumn: "span 4" }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: "1rem" }}>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                    <Box sx={{ mb: "1rem" }}>

                      <Box>{getStepContent(activeStep)}</Box>

                    </Box>

                  </Box>
                )}
              </Box>

              {/* For LogIn Page */}

              {isLogin && (
                <>
                  <TextField
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ mb: "1rem" }}
                    fullWidth
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={Boolean(touched.password) && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: "1rem" }}
                    fullWidth
                  />

                  {/* Forget Password Button */}
                  <Box display="flex" justifyContent="flex-end" mt={"1rem"}>
                    <Link
                      type="button"
                      component="button"
                      variant="body2"
                      onClick={() => handleForgotPassword()}
                      sx={{
                        textDecoration: "underline",
                        color: palette.primary.main,
                        "&:hover": {
                          color: palette.info.light,
                          cursor: "pointer",
                        },
                      }}
                    >
                      Forgot Your Password?
                    </Link>
                  </Box>

                  {/* Implement Captcha Features */}
                  <Box>
                    <Box sx={{ mt: "1rem" }}>
                      <label htmlFor="Enter Captcha">Enter the text as shown in the below</label><br />
                      <input type="text" placeholder="Enter Captcha" id="Enter Captcha" style={{ marginTop: "3px", padding: "10px", width: isNonMobile ? "40%" : "70%" }} value={captchaValue}
                        onChange={(e) => setCaptchaValue(e.target.value)}
                        required
                      />
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mt: "1rem" }}>
                      <Typography variant="h5" style={{ fontWeight: "bold", letterSpacing: "5px", border: "1px solid lightgray", padding: "5px 2rem" }}>{captcha}</Typography>
                      <IconButton onClick={handleReload} color="primary" style={{ marginLeft: 10 }}>
                        <RefreshIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Button */}
                  <Box sx={{ my: 2, textAlign: "end" }}>
                    <Button
                      type="button"
                      onClick={() => navigate(0)}
                      color="secondary"
                      variant="contained"
                      sx={{ mr: 2 }}
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                    >
                      Login
                    </Button>
                  </Box>
                </>
              )}

              <Box>
                {/* Show Alert Box */}
                <Box sx={{ width: '100%' }}>
                  <Collapse in={Alertopen}>
                    <Alert
                      severity="error"
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
                      sx={{ mb: 2 }}
                    >
                      {message}
                    </Alert>
                  </Collapse>
                </Box>

                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                    setCaptchaValue("");
                    handleReload();
                    setAlertOpen(false)
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      color: palette.info.light,
                      cursor: "pointer",
                    },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
              </Box>
            </form>
          )
        }}
      </Formik>

      {/* Modal for forgot password */}
      <Modal
        open={showForgotPasswordModal}
        onClose={handleCloseModal}
        aria-labelledby="forgot-password-modal"
        aria-describedby="forgot-password-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: "2rem",
        }}
          width={isNonMobile ? "48%" : "93%"}
        >
          <Box
            width="100%"
            p="1rem 2rem"
            textAlign="center"
          >
            <Typography id="forgot-password-modal" fontWeight="bold" fontSize={isNonMobile ? "28px" : "22px"} color="primary" gutterBottom>
              Forget Your Passward?
            </Typography>
          </Box>

          <Typography>Enter the email address associated with your account and we'll send you an OTP (One Time Password) to reset your password</Typography>

          <Box id="forgot-password-description" sx={{ mt: 2 }}>
            {!otpSent ? ( // Display email input if OTP hasn't been sent
              <form onSubmit={handleSubmitEmail}>
                <TextField
                  type="email"
                  label="Enter your Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginBottom: '20px' }}
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading} // Disable the button when loading is true
                >
                  {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                </Button>
                <Button variant="contained" type="button" color="warning" sx={{ marginLeft: "1rem" }} onClick={handleCloseModal}>
                  Cancel
                </Button>
              </form>
            ) : ( // Display OTP input if OTP has been sent
              <form onSubmit={handleSubmitOTP}>
                <Box sx={{
                  display: "flex",
                  alignItems: "baseline"
                }}>
                  <TextField
                    type="password"
                    label="Enter OTP"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ marginBottom: '10px' }}
                    required
                  />
                  <Button
                    variant="contained"
                    type="button"
                    color="secondary"
                    onClick={handleSubmitEmail} // Add your function to send another OTP here
                    sx={{ marginLeft: "1rem", fontSize: "0.5rem" }}
                  >
                    Resend
                  </Button>
                </Box>
                <Typography style={{ marginBottom: '10px', color: 'red' }}>
                  *Note: If you are a registered user, please check your email for the OTP.
                </Typography>


                <Button variant="contained" color="primary" type="submit">
                  Verify OTP
                </Button>
                <Button variant="contained" type="button" color="warning" sx={{ marginLeft: "1rem" }} onClick={() => {
                  handleCloseModal();
                  navigate(0)
                }}>
                  Go Back
                </Button>
              </form>
            )}
          </Box>
          {/* Additional modal content goes here */}
        </Box>
      </Modal>

      {/* Modal for Create Password */}
      <Modal
        open={showCreatePasswordModal}
        onClose={handleCloseCreatePasswordModal}
        aria-labelledby="create-password-modal"
        aria-describedby="create-password-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: '2rem',
          }}
          width={isNonMobile ? '48%' : '93%'}
        >
          <Box width="100%" p="1rem 2rem" textAlign="center">
            <Typography
              id="create-password-modal"
              fontWeight="bold"
              fontSize={isNonMobile ? '28px' : '22px'}
              color="primary"
              gutterBottom
            >
              Reset Your Password
            </Typography>
          </Box>

          <Typography>
            To create a new password for your account, please enter a strong and secure password below. Ensure it meets the password requirements for your account's security. We'll use this new password to reset your account's credentials.
          </Typography>

          <Box id="create-password-description" sx={{ mt: 2 }}>
            {/* Text fields for new password and confirm password */}
            <TextField
              type="password"
              label="New Password"
              variant="outlined"
              fullWidth
              style={{ marginBottom: '1rem' }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              style={{ marginBottom: '0.5rem' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Box style={{ marginBottom: '0.5rem' }}>
              {(newPassword !== confirmPassword) && (confirmPassword !== "") && (
                <Typography variant="caption" color="error">
                  Confirm Password do not match.
                </Typography>
              )}
            </Box>

            {/* Buttons for confirmation and cancellation */}
            <Box sx={{ display: 'flex', justifyContent: 'start' }} >
              <Button variant="contained" color="primary" sx={{ marginRight: '1rem' }} onClick={ConfirmPasswordChange} disabled={newPassword !== confirmPassword || newPassword === '' || confirmPassword === ''}>
                Confirm
              </Button>
              <Button variant="contained" color="warning" onClick={handleCloseCreatePasswordModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Box>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </>
  );
};

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/Sid70">
        CampusNet
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Form;
