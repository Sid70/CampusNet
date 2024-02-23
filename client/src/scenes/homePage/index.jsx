import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, Fab } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from '../navbar/index';
import UserWidget from '../widgets/UserWidget';
import MyPostWidget from '../widgets/MyPostWidget';
import PostsWidget from '../widgets/PostsWidget';
import AdvertWidget from '../widgets/AdvertWidget';
import FriendListWidget from '../widgets/FriendListWidget';
import url from '../../api/Serverhost';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const getUser = async (_id) => {
  try {
    const response = await fetch(`${url}/profile/${_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const { _id } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser(_id);
      setUser(userData);
    };

    fetchData();
  }, [_id]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!user) {
    return null;
  }

  const { picturePath } = user;

  return (
    <Box>
      <Box sx={{ position: "fixed", top: 0, zIndex: 100, width: "100%" }}>
        <Navbar />
      </Box>

      <Box
        width="100%"
        padding="2rem 4%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="0.5rem"
        justifyContent="space-between"
        mt={"5rem"}
      >
        <Box width={isNonMobileScreens ? '26%' : undefined} sx={{ position: "relative" }}>
          <Box sx={{ position: "sticky", top: "7rem" }}>
            <UserWidget userId={_id} picturePath={user.picturePath} />
          </Box>
        </Box>
        <Box
          width={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}
        >
          <Box>
            <MyPostWidget picturePath={picturePath} />
          </Box>

          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <Box>
              <AdvertWidget />
            </Box>
            <Box m="2rem" />
            <Box>
              <FriendListWidget userId={_id} />
            </Box>
          </Box>
        )}
      </Box>

      {/* Scroll-to-top button */}
      <Fab
        color="primary"
        aria-label="scroll-to-top"
        style={{
          position: 'fixed',
          bottom: 60,
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

export default HomePage;
