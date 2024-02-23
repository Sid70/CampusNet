import { useDispatch, useSelector } from "react-redux";
import Navbar from "../navbar/index";
import { Box, useMediaQuery, TextField, IconButton, useTheme, Typography, Button, Divider, Accordion, AccordionSummary, AccordionDetails, Stack, CircularProgress } from "@mui/material";
import { Edit as EditIcon, ExpandMore } from "@mui/icons-material"; // Import EditIcon
import UserImage from "../../components/UserImage";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Formik } from "formik";
import url from '../../api/Serverhost';
import { useEffect, useState, useRef } from "react";
import { setLogout, updateUser } from "../../state";
import CallIcon from '@mui/icons-material/Call';

export default function EditUserDetails() {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const inputFileRef = useRef(null);
  const userId = useSelector((state) => state.user);
  const { _id } = userId;
  const { palette } = useTheme();
  const theme = useTheme();
  const dark = palette.neutral.dark;
  const alt = theme.palette.background.alt;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [isProssesing, setIsProssesing] = useState(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Accordian
  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Image Update Part ******************************************
  const [selectedImage, setSelectedImage] = useState(userId.picturePath);
  const handleEditIconClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
  // ******************************************************************************************


  // Get Use
  const getUser = async () => {
    const response = await fetch(`${url}/profile/${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    fullName,
    mobileNumber,
    bio,
    location,
    occupation,
    picturePath,
    email,
  } = user;


  const UpdateSchema = yup.object().shape({
    fullName: yup.string().required("required"),
    mobileNumber: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
  });

  const handleFormSubmit = async (values, actions) => {
    try {
      await UpdateData(values);
      alert("Data Updated Successfully.");
      actions.resetForm();
      navigate("/home");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const UpdateData = async (values) => {

    values._id = _id;
    values.picturePath = selectedImage;

    try {
      const savedUserResponse = await fetch(`${url}/profile/editUserDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!savedUserResponse.ok) {
        throw new Error(`Network response was not ok, status: ${savedUserResponse.status}`);
      }

      const savedUser = await savedUserResponse.json();
      dispatch(updateUser({ user: savedUser.user }))
      console.log('Response from UpdateData:', savedUser);

    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error to be caught by the higher-level catch block
    }
  };

  // Delete Account Function

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${url}/users/${_id}/deleteAccount`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      dispatch(
        setLogout({
          user: null,
          token: null
        })
      );

      navigate("/");
    } catch (error) {
      console.error('Error:', error.message);
      navigate("/")
      throw error;
    }
  };

  const onDeleteAccount = async () => {
    console.log("Delete Account");
    setIsProssesing(true);
    try {
      if (window.confirm('Are you sure you want to delete your account permanently?')) {
        // Simulating deletion process with a delay of 3 seconds (adjust as needed)

        await delay(2000);
        await deleteAccount();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProssesing(false);
    }
  }

  // For deactivation

  const deactivateAccount = async () => {
    try {
      const response = await fetch(`${url}/users/${_id}/deactivateAccount`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate account');
      }

      dispatch(
        setLogout({
          user: null,
          token: null
        })
      );

      navigate("/");
    } catch (error) {
      console.error('Error:', error.message);
      // navigate("/");
      throw error;
    }
  }

  const onDeactivateAccount = async () => {
    console.log("Deactivate Account");
    setIsProssesing(true);
    try {
      if (window.confirm('Are you sure you want to delete your account temporarily?')) {

        await delay(2000);
        await deactivateAccount();
        // navigate("/")
      }
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setIsProssesing(false);
    }
  }

  return (
    <>
      <Box sx={{ position: "fixed", top: 0, zIndex: 100, width: "100%" }}>
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding="2rem 5%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        background={alt}
        mt={"5rem"}
      >
        {/* Left Side  */}
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          bgcolor={alt}
          p="3rem 0rem"
          borderRadius={"10px"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          height="fit-content"
        >
          {/* User Image */}
          <Box position="relative">
            <UserImage image={picturePath} size="240px" />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={inputFileRef}
              onChange={(event) => setSelectedImage(event.target.files[0].name)}
            />
            <IconButton
              aria-label="Edit"
              size="small"
              sx={{
                position: "absolute",
                bottom: "-0.8rem",
                right: "7rem",
                backgroundColor: palette.info.main,
                color: "white", // Change the color of the edit icon
                "&:hover": {
                  backgroundColor: palette.info.light, // Change the background color on hover
                  color: "white", // Change the icon color on hover
                },
              }}
              onClick={handleEditIconClick}
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Box mt="2rem">
            <Typography
              variant="h4"
              color={dark}
              fontWeight="400"
            >
              {fullName}
            </Typography>
          </Box>

          <Box mt="1rem" width={"100%"} p={"0rem 2rem"} sx={{ wordBreak: "break-all" }}>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="400"
              textAlign={"left"}
            >
              Bio:
            </Typography>
            <Typography
              variant="h6"
              color={dark}
              fontWeight="200"
              textAlign={"left"}
            >
              {bio}

            </Typography>
          </Box>

          <Box mt="2rem" width={"100%"} p={"0rem 2rem"} sx={{ wordBreak: "break-all" }}>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="400"
              textAlign={"left"}
            >
              Personal Details:
            </Typography>
          </Box>
          <Box width="100%" p={"1rem 2rem"}>
            <Box display="flex" alignItems="center" gap="0.5rem" mb="0.5rem" sx={{ wordBreak: "break-all" }}>
              <LocationOnOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>{location}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="0.5rem" mb="0.5rem" sx={{ wordBreak: "break-all" }}>
              <CallIcon fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>{mobileNumber}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="0.5rem" sx={{ wordBreak: "break-all" }}>
              <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
              <Typography color={medium}>{occupation}</Typography>
            </Box>
          </Box>
        </Box>

        <Box mt="2rem" />
        {/* Right Side */}
        <Box
          flexBasis={isNonMobileScreens ? "72%" : undefined}
          bgcolor={alt}
          padding="1rem"
          display="flex"
          flexDirection="column"
          borderRadius={"10px"}
          zIndex="0"
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              p: "1rem 1rem",
              fontFamily: "sans-serif",
              color: dark,
              fontWeight: "bold",
            }}
          >
            Manage Account
          </Typography>
          <Formik
            initialValues={{
              email,
              bio,
              fullName,
              mobileNumber,
              occupation,
              location,
              password: '',
            }}
            validationSchema={UpdateSchema}
            onSubmit={handleFormSubmit}
          >
            {(formik) => (
              <form style={{ marginTop: "0.3rem", padding: "0rem 1rem" }} onSubmit={formik.handleSubmit}
              >
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                  }}
                >
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    sx={{ gridColumn: "span 2" }}
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && formik.errors.email ? true : false}
                    helperText={formik.touched.email && formik.errors.email}
                    required
                  />
                  <TextField
                    label="Full Name"
                    name="fullName"
                    sx={{ gridColumn: "span 2" }}
                    {...formik.getFieldProps("fullName")}
                    error={formik.touched.fullName && formik.errors.fullName ? true : false}
                    helperText={formik.touched.fullName && formik.errors.fullName}
                    required
                  />
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Bio"
                    sx={{ gridColumn: "span 4" }}
                    rows={3}
                    multiline
                    maxRows={4}
                    {...formik.getFieldProps("bio")}
                  />
                  <TextField
                    label="Mobile Number"
                    name="mobileNumber"
                    sx={{ gridColumn: "span 2" }}
                    {...formik.getFieldProps("mobileNumber")}
                    error={formik.touched.mobileNumber && formik.errors.mobileNumber ? true : false}
                    helperText={formik.touched.mobileNumber && formik.errors.mobileNumber}
                    required
                  />
                  <TextField
                    label="Location"
                    name="location"
                    sx={{ gridColumn: "span 2" }}
                    {...formik.getFieldProps("location")}
                    error={formik.touched.location && formik.errors.location ? true : false}
                    helperText={formik.touched.location && formik.errors.location}
                    required
                  />
                  <TextField
                    label="Occupation"
                    name="occupation"
                    sx={{ gridColumn: "span 2" }}
                    {...formik.getFieldProps("occupation")}
                    error={formik.touched.occupation && formik.errors.occupation ? true : false}
                    helperText={formik.touched.occupation && formik.errors.occupation}
                    required
                  />
                  <TextField
                    label="Create New Password"
                    type="password"
                    name="password"
                    sx={{ gridColumn: "span 2" }}
                    {...formik.getFieldProps("password")}
                    error={formik.touched.password && formik.errors.password ? true : false}
                    helperText={formik.touched.password && formik.errors.password}
                    required
                  />
                </Box>

                <Box gap="30px" width={"100%"} display={"flex"} mt={"2rem"} >
                  <Button
                    type="submit"
                    sx={{
                      p: "1rem",
                      width: isNonMobileScreens ? "25%" : "50%",
                      backgroundColor: palette.primary.main,
                      color: palette.background.alt,
                      "&:hover": {
                        color: palette.primary.main,
                        backgroundColor: palette.grey[100],
                      },
                    }}
                    disabled={formik.isSubmitting}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => navigate(`/home`)}
                    sx={{
                      p: "1rem",
                      width: isNonMobileScreens ? "25%" : "50%",
                      backgroundColor: palette.error.dark,
                      color: palette.background.alt,
                      "&:hover": {
                        color: palette.error.main,
                        backgroundColor: palette.grey[100],
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            )}
          </Formik>

          <Divider sx={{ mt: "1.5rem" }} />
          {/* Danger Zone */}
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                p: "1rem 1rem",
                fontFamily: "sans-serif",
                color: "red",
                fontWeight: "bolder",
              }}
            >
              Danger Zone
            </Typography>
            <Box border={"0.5px solid red"}
              sx={{
                m: "0rem 1rem",
                p: "1rem 1rem 0.8rem 1rem"
              }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Deactivating or deleting your CampusNet account
              </Typography>
              <Box sx={{ fontWeight: "200", marginBottom: "1rem" }}>
                If you want to take a break from CampusNet, you can deactivate your account. If you want to permanently delete your CampusNet account, let us know
              </Box>

              {/* Delete Account */}
              <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
                sx={{ marginBottom: '1rem', p: "0.5rem 0rem", border: "0.5px solid red" }}

              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>Delete Account</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6">
                    This is permanent.
                  </Typography>
                  <Typography>
                    When you delete your CampusNet account, you won't be able to retrieve the content or information you've shared on CampusNet. Your Messenger and all of your messages will also be deleted.
                  </Typography>
                  <Stack spacing={3} direction="row" sx={{ justifyContent: "end", mt: "0.5rem" }}>
                    <Button variant="outlined" size="large"
                      onClick={handleChange('panel1')}>Cancel</Button>
                    {/* DO it for All */}
                    <Button
                      variant="contained"
                      size="large"
                      onClick={onDeleteAccount}
                      disabled={isProssesing}
                      style={{ position: 'relative' }}
                    >
                      {isProssesing && (
                        <CircularProgress size={24} style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12 }} />
                      )}
                      Delete Account
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              {/* Deactivate Account */}
              <Accordion
                expanded={expanded === 'panel2'}
                onChange={handleChange('panel2')}
                sx={{ marginBottom: '1rem', p: "0.5rem 0rem", border: "0.5px solid red" }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>Deactivate Account</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="h6">
                    This can be temporary.
                  </Typography>
                  <Typography>
                    Your account will be disabled and your name and photos will be removed from most things you've shared. You'll be able to continue using Messenger.
                  </Typography>
                  <Box>
                    <Stack spacing={3} direction="row" sx={{ justifyContent: "end", mt: "0.5rem" }}>
                      <Button variant="outlined" size="large"
                        onClick={handleChange('panel2')}>Cancel</Button>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={onDeactivateAccount}
                        disabled={isProssesing}
                        style={{ position: 'relative' }}
                      >
                        {isProssesing && (
                          <CircularProgress size={24} style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12 }} />
                        )}
                        Deactivate Account
                      </Button>
                    </Stack>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
