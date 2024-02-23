import { Box, useMediaQuery, Fab } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../navbar/index";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import FriendListWidget from "../widgets/FriendListWidget";
import url from '../../api/Serverhost';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MyPostWidget from "../widgets/MyPostWidget";
import { useSelector } from "react-redux";
import AccountCreatedWidget from "../widgets/AccountCreatedWidget";


const ProfilePage = () => {
  const { _id } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getUser = async () => {
    const response = await fetch(`${url}/users/${userId}`, {
      method: "GET",
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!user || user.isDeactivated ) return null;

  return (
    <Box>
      <Box style={{ position: 'fixed', top: 0, width: '100%', zIndex: 999 }}>
        <Navbar />
      </Box>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
        mt={"5rem"}
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem" />
          {/* Editing */}
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {(user._id === _id) ? <MyPostWidget picturePath={user.picturePath} /> : <Box m={isNonMobileScreens ? "-2rem" : undefined} />}
          <PostsWidget userId={userId} isProfile />
          {/* Created Date Show */}
          <AccountCreatedWidget userId={userId} />
        </Box>
      </Box>
      {/* Scroll-to-top button */}
      <Fab
        color="primary"
        aria-label="scroll-to-top"
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={scrollToTop}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Box>
  );
};

export default ProfilePage;