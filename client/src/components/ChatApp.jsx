import React, { useState, useEffect } from 'react';
import {
  Box, useMediaQuery,
  TextField, IconButton,
  Typography,
  useTheme,
  InputBase,
  Tooltip,
} from '@mui/material';
import { useParams } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import UserImage from "./UserImage";
import url from '../api/Serverhost'
import { useSelector } from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlexBetween from './FlexBetween';
import { AddCircleOutlineOutlined, Search } from '@mui/icons-material';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import SimpleWebRTC from 'simplewebrtc';


export default function ChatApp() {
  const { userId } = useParams();
  const theme = useTheme();
  const { palette } = useTheme();
  const mostDark = theme.palette.background.default;
  const medium = palette.neutral.medium;

  const dark = theme.palette.neutral.dark;
  const alt = theme.palette.background.alt;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [friends, setFriends] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const user = useSelector((state) => state.user);

  // ********************************************************************************************************************
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Audio call and video call ***********************************************************************

  const [webrtc, setWebRTC] = useState(null); // State to hold SimpleWebRTC instance
  useEffect(() => {
    // Initialize SimpleWebRTC
    const rtc = new SimpleWebRTC({
      // Configuration options go here
    });

    rtc.on('readyToCall', () => {
      // Ready to make a call
    });

    rtc.on('videoAdded', (video, peer) => {
      // Handle remote video stream
    });

    rtc.on('audioAdded', (audio, peer) => {
      // Handle remote audio stream
    });

    setWebRTC(rtc);

    // Cleanup function
    return () => {
      rtc.stopLocalVideo();
      rtc.leaveRoom();
    };
  }, []);

  const handleVideoCall = () => {
    // Check if a user is selected
    if (selectedUser) {
      // Start local video
      webrtc.startLocalVideo();

      // Send a message to all peers in the room
      webrtc.sendToAll('message', { type: 'video-call' });
    }
  };

  const handleAudioCall = () => {
    // Check if a user is selected
    if (selectedUser) {
      // Start local audio
      webrtc.startLocalAudio();

      // Send a message to all peers in the room
      webrtc.sendToAll('message', { type: 'audio-call' });
    }
  };

  // */******************************************************************************************* */

  let combinedMessages = [];
  let sortedMessages = [];

  if (messages[0]) {
    combinedMessages = [...messages[0].senderMessages, ...messages[0].recipientMessages];

    sortedMessages = combinedMessages.sort((a, b) => {
      const timestampA = new Date(a.time).getTime();
      const timestampB = new Date(b.time).getTime();
      return timestampA - timestampB;
    });
  }

  let LastMessageInfo = []; // last message an object

  let MessageInfo = {
    Lastmessage: "",
  };

  try {
    LastMessageInfo = combinedMessages[sortedMessages.length - 1];
    MessageInfo = {
      Lastmessage: LastMessageInfo.chat,
    }

  }
  catch (err) {
    LastMessageInfo = [];
  }

  const fetchMessages = async (selectedUserId) => {
    try {
      const response = await fetch(`${url}/chat/messages/${selectedUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // ***********************************************************


  // For Get Friend List ( Access Friend Schema )
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/chat/${userId}/getFriends`, {
          method: "GET",
        });
        const data = await response.json();
        setFriends(data); // Update the state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);

  const sendMessage = async () => {
    try {
      const newMessageData = {
        senderId: userId, // Replace "user1" with the ID of the logged-in user
        recipient: selectedUser._id,
        content: newMessage,
        timestamp: Date.now(),
      };

      const response = await fetch(`${url}/chat/sendMessages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessageData),
      });


      if (!response.ok) {
        console.error('Failed to send message');
        return;
      }

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");
      fetchMessages(selectedUser._id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // *********************************************************************************************************************
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/chat/${userId}/getFriends`, {
          method: "GET",
        });
        const data = await response.json();
        setFriends(data); // Update the state with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);

  if (friends === null) {
    return <div>Loading...</div>;
  }

  const handleUserClick = async (user) => {
    setSelectedUser(user); // Update selected user when a user is clicked
    await fetchMessages(user._id);
  };


  return (
    <>
      <Box
        width="100%"
        height="87.1vh"
        display={isNonMobileScreens ? "flex" : "block"}
        justifyContent="space-between"
        borderTop={"1px solid"}
        borderBottom={"1px solid"}
        borderColor={medium}
      // textOverflow={"unset"}
      >
        {/* Side Navbar */}
        <Box
          flexBasis={isNonMobileScreens ? "40%" : undefined}
          sx={{
            overflowY: 'auto',
            color: "black",
            backgroundColor: mostDark,
            borderRight: "1px solid",
            borderColor: medium,
            minWidth: isNonMobileScreens ? "380px" : undefined
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              fontFamily: "sans-serif",
              color: dark,
              fontWeight: "bold",
            }}
          >
            {/* Heading : shows user profile and use name with location and three dot icon*/}
            <Box
              borderBottom={"1px solid"}
              borderColor={medium}
              sx={{
                p: "0rem 1rem",
                backgroundColor: theme.palette.neutral.light,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}>
                <UserImage image={user.picturePath} />
                <Box
                  sx={{
                    p: "0.8rem",
                  }}
                >
                  <Typography
                    variant="h4"
                    color={dark}
                    fontWeight="200"
                    fontSize={"1.23rem"}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography color={medium}>{user.occupation}</Typography>
                </Box>
                <Typography>(You)</Typography>
              </Box>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Box>
            {/* Search Box */}
            <Box
              sx={{
                p: "1rem",
                backgroundColor: alt,
              }}>
              <Tooltip title="Search" placement="bottom">
                <FlexBetween
                  backgroundColor={alt}
                  borderRadius="9px"
                  gap="3rem"
                  padding="0.1rem 1rem"
                  border={"1px solid"}
                  borderColor={medium}
                >
                  <InputBase
                    placeholder="Search or start new chat"
                  />
                  <IconButton>
                    <Search />
                  </IconButton>
                </FlexBetween>
              </Tooltip>
            </Box>
          </Box>


          {friends.map((user) => (
            <Box
              key={user._id}
              onClick={() => {
                handleUserClick(user);
              }}
              display="flex"
              alignItems="center"
              margin={"10px 10px 4px 10px"}
              gap="1rem"
              p="0.6rem 0.5rem"
              border={"1px solid"}
              borderColor={medium}
              sx={{
                backgroundColor: theme.palette.neutral.light,
                color: dark,
                '&:hover': {
                  backgroundColor: alt,
                  cursor: 'pointer',
                }
              }}
            >
              <UserImage image={user.picturePath} size="50px" />
              <Box>
                <Box sx={{ marginBottom: "8px", display: "flex" }}>
                  <Typography variant='h5'>{`${user.firstName} ${user.lastName}`}</Typography>
                  <Typography variant='h6' color={medium}>&nbsp;&nbsp;({`${user.occupation}`})</Typography>
                </Box>

                <Typography variant='h6' color={medium}>{(selectedUser === null) ? `Last Messages : ` : (selectedUser._id === user._id) ? `Last Messages: ` + MessageInfo.Lastmessage : "Last Messages: "}</Typography>
              </Box>
            </Box>
          ))}


        </Box>

        {/* Right Side */}
        <Box
          display="flex"
          flexDirection="column"
          height={isNonMobileScreens ? "100%" : undefined}
          width={isNonMobileScreens ? "76%" : undefined}
          margin={isNonMobileScreens ? "0%" : "20px 0px"}
        >
          {/* Page display before selectig the user */}
          {/* {(selectedUser === null) ? (<></>) : null} */}

          {/* Selected user name and profile picture */}
          {selectedUser && (
            <Box>
              <Box
                sx={{
                  p: "0rem 1rem",
                  backgroundColor: theme.palette.neutral.light,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
                borderBottom={"1px solid"}
                borderColor={medium}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}>
                  <UserImage image={selectedUser.picturePath} />
                  <Box
                    sx={{
                      p: "0.8rem",
                    }}
                  >
                    <Typography
                      variant="h4"
                      color={dark}
                      fontWeight="500"
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      {selectedUser.firstName} {selectedUser.lastName}
                    </Typography>
                    <Typography
                      color={medium}
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      {selectedUser.occupation}
                    </Typography>
                  </Box>
                </Box>
                {/* Icon and video call and audio call features */}
                <Box>
                  <IconButton sx={{ mr: "1rem" }} onClick={handleVideoCall}>
                    <VideocamIcon fontSize='medium' />
                  </IconButton>
                  <IconButton sx={{ mr: "1rem" }} onClick={handleAudioCall}>
                    <CallIcon fontSize='medium' />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Chat messages */}
          <Box
            flex="1"
            sx={{
              position: "relative",
              backgroundColor: mostDark,
              overflowY: "scroll",
              scrollBehavior: "smooth",
              p: "1rem",
            }}
          >
            {selectedUser && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {/* Display chat messages */}
                {/* *********************************************************************************** */}
                {sortedMessages.map((message, i) => (
                  <Box key={i} style={{ textAlign: message.senderId === userId ? 'right' : 'left' }}
                    sx={{
                      alignSelf: message.senderId === userId ? "flex-end" : "flex-start",
                      backgroundColor: message.senderId === userId ? "green" : theme.palette.warning.light,
                      borderRadius: "8px",
                      padding: "0.5rem 1rem",
                      color: "white",
                    }}
                  >
                    {/* Show sender's name and chat */}
                    <p style={{ margin: 0, padding: 0, fontSize: '0.8rem', color: '#888' }}>
                      {message.senderId === userId ? 'You' : `${selectedUser.firstName} ${selectedUser.lastName}`}
                    </p>
                    <p style={{ margin: '4px 0', padding: 0 }}>{message.chat}</p>
                    <p style={{ margin: 0, padding: 0, fontSize: '0.7rem', color: '#888' }}>{message.time}</p>
                  </Box>
                ))}
                {/* ***************************************************************************** */}
              </Box>
            )}
          </Box>

          {/* Message input */}
          {selectedUser && (
            <Box
              display="flex"
              alignItems="center"
              p="0.4rem"
              bgcolor={theme.palette.neutral.light}
              border={"1px solid"}
              borderLeft={0}
              borderColor={medium}
            >
              {/* Emoji icon button */}
              <IconButton>
                <InsertEmoticonIcon fontSize='large' />
              </IconButton>
              {/* Add icon button */}
              <IconButton>
                <AddCircleOutlineOutlined fontSize='large' />
              </IconButton>
              <TextField
                sx={{ width: "100%", wordWrap: "break-word" }}
                flex="1"
                id="outlined-textarea"
                multiline
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                maxRows={4}
              />
              <IconButton onClick={sendMessage}>
                <SendIcon id={"bottom"} fontSize='large' />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}