import {
  ChatBubbleOutlineOutlined,
  Edit,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import ImageWidget from "./ImageWidget"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendIcon from '@mui/icons-material/Send';
import { addNotification, setPost } from "../../state/index";
import UserImage from "../../components/UserImage";
import DeleteIcon from '@mui/icons-material/Delete';
import url from '../../api/Serverhost';


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [comment, setComment] = useState("");
  const [editcomment, setEditComment] = useState("");
  const [indexOfEditingComment, setindexOfEditingComment] = useState(-1);

  const { palette } = useTheme();
  const main = palette.neutral.main;

  const user = useSelector((state) => state.user);


  // ***********************************************

  const handleShare = async () => {
    try {
      // Check if the share API is available in the browser
      if (navigator.share) {
        // Define the data to be shared
        const shareData = {
          title: description,
          text: description, // You can customize the text to be shared
          url: `${url}/profile/${postId}`, // Replace with the URL of your application or the post URL
        };

        // Use the Web Share API to share the data
        await navigator.share(shareData);
      } else {
        // Fallback behavior if the share API is not available
        const shareableLink = `${url}/posts/${postId}`; // Replace with the URL of your shareable post
        window.open(shareableLink, "_blank");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };


  const [isEditButton, setisEditButton] = useState(false);


  const EditComment = async () => {

    try {
      const response = await fetch(`${url}/posts/${postId}/editComment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, index: indexOfEditingComment, editcomment })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setisEditButton(false); // Reset the edit button state after successful edit
        setindexOfEditingComment(-1); // Reset the index of editing comment after successful edit
        setEditComment(""); // Clear the editcomment state after successful edit

        if (loggedInUserId !== postUserId) {
          // Dispatch a notification for new comment to the post owner (postUserId)
          const name = user.fullName;
          const picturePath = user.picturePath;
          const Time = new Date().getTime();

          const notification = {
            action: 'edit_comment',
            name,
            picturePath,
            actionPerformedBy: loggedInUserId,
            message: `${name} has commented "${comment}" on your post.`,
            postUserId,
            Time,
          };
          dispatch(addNotification(notification));
        }

      } else {
        throw new Error('Failed to Edit comment');
      }
    } catch (error) {
      console.error('Error Edit comment:', error);
    }
  }

  const DeleteComment = async (index) => {
    try {
      const response = await fetch(`${url}/posts/${postId}/deleteComment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, index })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const patchLike = async () => {
    const response = await fetch(`${url}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId })
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    if (loggedInUserId !== postUserId) {
      const name = user.fullName;
      const Time = new Date().getTime();
      const picturePath = user.picturePath;

      if (!isLiked) {
        const notification = {
          action: `like`,
          name,
          picturePath,
          actionPerformedBy: loggedInUserId,
          message: `${name} has liked on your post.`,
          postUserId,
          Time,
        };
        dispatch(addNotification(notification));
      }
    }
  };

  const patchComment = async () => {
    try {
      const response = await fetch(`${url}/posts/${postId}/comments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
        setComment("");
        if (loggedInUserId !== postUserId) {
          // Dispatch a notification for new comment to the post owner (postUserId)
          const name = user.fullName;
          const picturePath = user.picturePath;
          const Time = new Date().getTime();
          const notification = {
            action: 'new_comment',
            name,
            picturePath,
            actionPerformedBy: loggedInUserId,
            message: `${name} has commented "${comment}" on your post.`,
            postUserId,
            Time,
          };
          dispatch(addNotification(notification));
        }
      } else {
        throw new Error('Failed to patch comment');
      }
    } catch (error) {
      console.error('Error patching comment:', error);
    }
  };



  return (
    <WidgetWrapper m="2rem 0">
      <Box sx={{ width: "100%", wordBreak: "break-word" }}>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
          postId={postId}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>

      </Box>


      {/* Image */}

      <Box>
        <ImageWidget picturePath={picturePath}/>
      </Box>

      <FlexBetween mt="0.2rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "red" }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton onClick={handleShare}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      <Box sx={{ width: "100%", wordBreak: "break-word" }}>
        {isComments && (
          <>
            <Box display="flex" mt="0.5rem">
              <InputBase value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your Comment..."
                sx={{
                  margin: "1px 0px",
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "0.5rem",
                  padding: "0rem 1rem",
                }}
              />
              {
                (comment === "") ? (
                  <IconButton>
                    <SendIcon />
                  </IconButton>
                ) :
                  (
                    <IconButton onClick={patchComment}>
                      <SendIcon />
                    </IconButton>
                  )
              }
            </Box>
            <Box mt="0.5rem">
              {comments.map((comment, i) => (
                <Box key={`${name}-${i}`}>
                  <Divider />
                  <>
                    <Box display="flex">
                      <Box sx={{ color: main, m: "0.5rem 0" }} display="flex" justifyContent="space-between" width={"100%"} >
                        <Box p={"0.2rem"}>
                          <UserImage image={comment.picturePath} size="29px" />
                        </Box>
                        <Box p={"0.2rem"} width={"100%"}>
                          {comment.fullName}

                          {isEditButton && (indexOfEditingComment === i) && ((loggedInUserId === comment.userId)) && (
                            <Box display="flex" width={"100%"}>
                              <InputBase value={editcomment}
                                onChange={(e) => setEditComment(e.target.value)}
                                placeholder="Edit your Comment..."
                                sx={{
                                  width: "100%",
                                  backgroundColor: palette.neutral.light,
                                  borderRadius: "0.5rem",
                                  p: "0.2rem 0.5rem"
                                }}
                              />
                              <IconButton onClick={EditComment}>
                                <SendIcon />
                              </IconButton>
                            </Box>
                          )}

                          <Box>
                            {(isEditButton) && (indexOfEditingComment === i) && ((loggedInUserId === postUserId) || (loggedInUserId === comment.userId)) ?
                              null : (
                                <Box sx={{ backgroundColor: palette.background.default, p: "0.5rem", borderRadius: "10px" }}>
                                  {comment.commentText}
                                </Box>
                              )
                            }
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex" }}>
                          <Box>
                            {(loggedInUserId === comment.userId) ?
                              <IconButton onClick={() => {
                                setisEditButton(!isEditButton);
                                setindexOfEditingComment(i);
                                return;
                              }}>
                                <Edit />
                              </IconButton> : null}
                          </Box>

                          <Box>
                            {(loggedInUserId === postUserId) || (loggedInUserId === comment.userId) ?
                              <IconButton onClick={() => DeleteComment(i)}>
                                <DeleteIcon style={{ color: 'red' }} />
                              </IconButton> : null}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </>
                </Box>
              ))}
              <Divider />
            </Box>
          </>
        )}
      </Box>

    </WidgetWrapper>
  );
};


export default PostWidget;