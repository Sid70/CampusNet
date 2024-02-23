import { useState } from "react";
import {
  Box,
  Badge,
  IconButton,
  InputBase,
  Typography,
  MenuItem,
  FormControl,
  Modal,
  useTheme,
  useMediaQuery,
  Divider,
  Tooltip,
  Popover,
  Button,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Switch,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import {
  Search,
  // Message,
  Notifications,
  Menu,
  Close,
  PersonRemoveOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setSearchResults, setFriends } from "../../state/index";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import url from '../../api/Serverhost';
// import { otherServerUrl, otherFrontendUrl } from '../../api/OtherServer'
import UserImage from "../../components/UserImage";
import NavbarImage from './Navbar.png';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import MyPostWidget from "../widgets/MyPostWidget";
import CreatePostWidget from '../widgets/CreatePostWidget'

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [auth, setAuth] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const SearchData = useSelector((state) => state.searchResults);

  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

  // Color Setting
  const theme = useTheme();
  const { palette } = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const primaryDark = palette.primary.dark;

  // For Non Mobile Screen
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  // For Mobile Screen
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check for mobile screen
  const modalWidth = isMobile ? '90%' : '50%';
  const modalHeight = isMobile ? '90%' : '85%';

  const fullName = `${user.fullName}`;

  // Notification Setting
  const notifications = useSelector((state) => state.notifications); // Fetch notifications from Redux store
  const unreadCount = notifications.filter(
    (notification) => notification.postUserId === user._id && !notification.read
  ).length;

  // ************************************************************ Search Query *******************************************

  // Step 1: Add state for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // // Step 2: Modify the JSX to include a search input
  const handleSearch = async () => {
    // console.log('Search Query:', searchQuery);

    try {
      const response = await fetch(`${url}/home/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the data returned from the backend (e.g., update UI)
        // console.log('Search Results:', data);
        // Perform UI updates based on the search results
        dispatch(setSearchResults({ searchResults: data }));
        setIsModalOpen(true);

      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      // Handle errors or show error messages to the user
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    // Function to close the modal
    setIsModalOpen(false);
    navigate(0);
  };

  const patchFriend = async (friendId) => {
    const response = await fetch(
      `${url}/users/${user._id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  // Send data to another Backend ****************************************************************************
  // const sendDataToAnotherBackend = async () => {
  //   try {
  //     const response = await fetch(`${otherServerUrl}/send-data`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(user),
  //     });

  //     // Process the response if needed
  //     const responseData = await response.json();
  //     console.log('Data sent to another backend:', responseData);
  //   } catch (error) {
  //     console.error('Error sending data to another backend:', error);
  //   }
  // };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setAuth(event.target.checked);
    dispatch(setMode());
  };

  const open = Boolean(anchorEl);

  const handleOpenCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
  };

  const handleCloseCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };

  return (
    <FlexBetween padding="1rem 5%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Tooltip title="Home" placement="bottom">
          <Box sx={{
            "&:hover": {
              color: primaryLight,
              cursor: "pointer",
            },
          }}>
            <img src={NavbarImage} alt="CampusNet" className="navbar-logo" onClick={() => {
              navigate("/home");
              navigate(0);
            }}
              width={"200rem"}
            />
          </Box>
        </Tooltip>
        {isNonMobileScreens && (
          <Tooltip title="Search" placement="bottom">
            <FlexBetween
              backgroundColor={neutralLight}
              borderRadius="9px"
              gap="3rem"
              padding="0.1rem 1.5rem"
            >
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton onClick={handleSearch}>
                <Search />
              </IconButton>
            </FlexBetween>
          </Tooltip>
        )}

        {/* {console.log(user)} */}

        {/* Search Modal Component */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="search-modal"
          aria-describedby="search-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: modalWidth,
              height: modalHeight, // Adjust height as needed
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 3,
              pt: 0,
              overflow: 'auto', // Add overflow for scrolling
            }}
          >
            {/* Content for your modal */}
            {/* Add your modal content here */}
            <Typography id="search-modal" variant="h4" component="h4" sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, py: 2 }}>
              Peoples you may know
              {/* Close Button */}
              <IconButton
                aria-label="Close"
                onClick={handleCloseModal}
                sx={{ position: 'absolute', top: 10, right: -14, zIndex: 1 }}
              >
                <Close />
              </IconButton>
              <Divider sx={{
                mt: "8px"
              }} />
            </Typography>
            <Box id="search-modal-description" sx={{ mt: 2 }}>
              {SearchData.length === 0 ? "No records Found....." : SearchData && SearchData.map((obj, i = 1) => (
                <Box
                  key={i++}
                  gap="1rem"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '7px',
                    p: '8px 22px',
                    m: '4px',
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Box key={i++}
                    gap="1rem"
                    onClick={() => {
                      navigate(`/profile/${obj._id}`)
                      navigate(0)
                    }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'left',
                      alignItems: 'center',
                      '&:hover': {
                        color: primaryLight,
                        cursor: 'pointer',
                      },
                    }}>
                    <UserImage image={obj.picturePath} size="45" />
                    <Box>
                      <Typography variant="h5" fontWeight="500">
                        {obj.fullName}
                      </Typography>
                      <Typography>{(obj._id === user._id) ? "You" : (user.friends.map(item => item._id === obj._id).includes(true)) ? "Friend" : obj.location}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    {(obj._id === user._id) ? null : (user.friends.map(item => item._id === obj._id).includes(true)) ? (
                      <IconButton
                        onClick={() => patchFriend(obj._id)}
                        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                      >
                        <PersonRemoveOutlined sx={{ color: primaryDark }} />
                      </IconButton>
                    ) :
                      (
                        <IconButton
                          onClick={() => patchFriend(obj._id)}
                          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                        >
                          <PersonAddOutlined sx={{ color: primaryDark }} />
                        </IconButton>
                      )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Modal>
        {/* End of Modal Component */}
      </FlexBetween>

      {/* DESKTOP NAV */}
      {
        isNonMobileScreens ? (
          <FlexBetween gap="2rem">
            {/* Home */}
            <Tooltip title="Home" placement="bottom">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton onClick={() => navigate("/home")}>
                  <HomeIcon sx={{
                    fontSize: "27px",
                    color: dark,
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }} />
                </IconButton>
              </Box>
            </Tooltip>

            {/* Create Post */}
            <Tooltip title="Create Post" placement="bottom">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton onClick={handleOpenCreatePostModal}>
                  <AddCircleIcon sx={{
                    fontSize: "27px",
                    color: dark,
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }} />
                </IconButton>
              </Box>
            </Tooltip>

            {isCreatePostModalOpen && <CreatePostWidget isOpen={isCreatePostModalOpen} handleClose={handleCloseCreatePostModal} />}


            {/* Messanger */}
            {/* <Tooltip title="Messanger" placement="bottom">
              <IconButton onClick={() => {
                // navigate(`/chat/${user._id}`);
                sendDataToAnotherBackend();
                window.open(`${otherFrontendUrl}/register`, '_self')
              }}>
                <Message sx={{
                  fontSize: "27px",
                  color: dark,
                  "&:hover": {
                    cursor: "pointer",
                  },
                }} />
              </IconButton>
            </Tooltip> */}

            {/* Notification */}
            <Tooltip title="Notification" placement="bottom">
              <IconButton onClick={() => navigate(`/notification/${user._id}`)}>
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications sx={{
                    fontSize: "27px",
                    color: dark,
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Logout Section */}
            <FormControl variant="standard" >
              <Box
                sx={{
                  cursor: "pointer",
                }}
                onClick={handleClick}>
                <UserImage image={user.picturePath} alt={fullName} size="45" />
              </Box>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                PaperProps={{ style: { width: '300px' } }}
              >
                <MenuItem value={fullName} onClick={() => {
                  navigate(`../profile/${user._id}`)
                }}
                  sx={{
                    p: "1rem",
                    "&:hover": {
                      backgroundColor: "transparent", // Disabling hover effect
                    }
                  }}
                >
                  <UserImage image={user.picturePath} alt={fullName} size="50" />
                  <Box marginLeft={"0.7rem"}>
                    <Typography variant="h5">{fullName}</Typography>
                    <Typography color={palette.neutral.medium}>{user.occupation}</Typography>
                  </Box>
                </MenuItem>
                <MenuItem sx={{
                  "&:hover": {
                    backgroundColor: "transparent", // Disabling hover effect
                  }
                }}>
                  <Button variant="outlined" fullWidth color="success" sx={{ borderRadius: "1rem" }} onClick={() => {
                    navigate(`../profile/${user._id}`)
                  }}>
                    View profile
                  </Button>
                </MenuItem>
                <Divider />
                {/* Setting */}
                <MenuItem sx={{
                  "&:hover": {
                    backgroundColor: "transparent", // Disabling hover effect
                  }
                }}>
                  <Typography variant="h5" >Setting</Typography>
                </MenuItem>

                {/* Light Mode or Dark Mode */}
                <MenuItem
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent", // Disabling hover effect
                      textDecoration: "underline"
                    }
                  }}
                >
                  {/* Dark Mode or Light Mode */}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={auth}
                          onChange={handleChange}
                          aria-label="login switch"
                        />
                      }
                      label={theme.palette.mode === "dark" ? (
                        <>
                          <ListItemText primary="Light Mode" />
                        </>
                      ) : (
                        <>
                          <ListItemText primary="Dark Mode" />
                        </>
                      )}
                    />
                  </FormGroup>
                </MenuItem>

                {/* LogOut */}
                <Divider />
                <MenuItem sx={{
                  pb: "1rem",
                  "&:hover": {
                    backgroundColor: "transparent", // Disabling hover effect
                    textDecoration: "underline"
                  }
                }}
                  onClick={() => dispatch(setLogout())}
                >
                  Log Out
                </MenuItem>
              </Popover>
            </FormControl>
          </FlexBetween>
        ) : (
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        )
      }

      {/* Fixed Bottom Menu */}

      {
        !isNonMobileScreens ?
          (
            <>
              <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation>
                  <BottomNavigationAction
                    label="Home"
                    icon={<IconButton onClick={() => navigate("/home")}><HomeIcon sx={{
                      fontSize: "27px",
                      color: dark,
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }} /></IconButton>}
                  />
                  <BottomNavigationAction
                    label="Create Post"
                    icon={<IconButton onClick={handleOpenCreatePostModal}><AddCircleIcon sx={{
                      fontSize: "27px",
                      color: dark,
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }} /></IconButton>}
                  />
                  {isCreatePostModalOpen && <CreatePostWidget isOpen={isCreatePostModalOpen} handleClose={handleCloseCreatePostModal} />}

                  {/* <BottomNavigationAction
                    label="Messenger"
                    icon={<IconButton onClick={() => {
                      // navigate(`/chat/${user._id}`);
                      sendDataToAnotherBackend();
                      window.open(`${otherFrontendUrl}/register`, '_self')
                    }}><Message sx={{
                      fontSize: "27px",
                      color: dark,
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }} /></IconButton>}
                  /> */}
                  <BottomNavigationAction
                    label="Notification"
                    icon={(
                      <IconButton onClick={() => navigate(`/notification/${user._id}`)}>
                        <Badge badgeContent={unreadCount} color="error">
                          <Notifications sx={{
                            fontSize: "27px",
                            color: dark,
                            "&:hover": {
                              cursor: "pointer",
                            },
                          }} />
                        </Badge>
                      </IconButton>
                    )}
                  />
                </BottomNavigation>
              </Paper>

            </>
          )
          :
          null
      }

      {/* MOBILE NAV */}
      {
        !isNonMobileScreens && isMobileMenuToggled && (
          <Box>
            <Box
              position="fixed"
              right="0"
              bottom="0"
              height="100%"
              zIndex="10"
              maxWidth="400px"
              minWidth="350px"
              backgroundColor={background}
            >
              {/* CLOSE ICON */}
              <Box display="flex" justifyContent="space-between" alignItems={"center"} p="1rem">
                <Box display="flex" justifyContent="space-between" alignItems={"center"}>
                  <UserImage image={user.picturePath} size="45px" />
                  <Box sx={{ ml: "1rem", wordBreak: "break-all" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>{user.fullName}</Typography>
                    <Typography
                      color={palette.neutral.medium}
                      sx={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': {
                          color: palette.primary.main,
                        },
                      }}
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      View Profile
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                  <Close />
                </IconButton>
              </Box>

              <Divider />
              <Divider />

              {/* *************** Search  ********************** */}
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                gap="3rem"
                padding="0.1rem 1rem"
                width="75%"
                m={"1.5rem auto"}
              >
                <InputBase
                  placeholder="Search People..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton onClick={handleSearch}>
                  <Search />
                </IconButton>
              </FlexBetween>

              <Divider />
              <Divider />

              <Box>
                <Box sx={{ ml: "1rem", mt: "0.5rem" }} display={"flex"}>
                  <SettingsIcon />
                  <Typography variant="h5" sx={{ ml: "0.4rem", fontWeight: "bold" }}>Setting</Typography>
                </Box>
                {/* Mode Changes */}
                <Box>
                  <MenuItem
                    sx={{
                      "&:hover": {
                        backgroundColor: "transparent", // Disabling hover effect
                        textDecoration: "underline"
                      }
                    }}
                  >
                    {/* Dark Mode or Light Mode */}
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={auth}
                            onChange={handleChange}
                            aria-label="login switch"
                          />
                        }
                        label={theme.palette.mode === "dark" ? (
                          <>
                            <ListItemText primary="Light Mode" />
                          </>
                        ) : (
                          <>
                            <ListItemText primary="Dark Mode" />
                          </>
                        )}
                      />
                    </FormGroup>
                  </MenuItem>
                </Box>
              </Box>

              <Divider />
              <Divider />

              {/* LogOut Section */}
              <Box sx={{ position: "fixed", bottom: "1rem", width: "100%" }}>
                <Divider />
                <Box>
                  <MenuItem sx={{
                    textDecoration: "underline",
                    "&:hover": {
                      backgroundColor: "transparent", // Disabling hover effect
                      textDecoration: "underline"
                    }
                  }}
                    onClick={() => dispatch(setLogout())}
                  >
                    Log Out
                  </MenuItem>
                </Box>
              </Box>
            </Box>
          </Box>

        )
      }

    </FlexBetween>
  );
};

export default Navbar;
