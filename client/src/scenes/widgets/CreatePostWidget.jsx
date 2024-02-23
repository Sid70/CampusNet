import React, { useState } from 'react';
import {
    Modal, Box, Typography, Button, IconButton, Divider, useMediaQuery, TextareaAutosize, Avatar,
    //  Menu, MenuItem, Fade 
} from '@mui/material';
import { ImageOutlined, VideocamOutlined } from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import FlexBetween from '../../components/FlexBetween';
import UserImage from '../../components/UserImage'; // Assuming this is a custom component for user image
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
// import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
// import CelebrationIcon from '@mui/icons-material/Celebration';
// import EventIcon from '@mui/icons-material/Event';
// import WorkIcon from '@mui/icons-material/Work';
import url from '../../api/Serverhost';
import { setPosts } from '../../state';


const CreatePostWidget = ({ isOpen, handleClose }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [post, setPost] = useState('');
    const [isMedia, setIsMedia] = useState(false);
    // const [activities, setActivities] = useState('');

    const user = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const [files, setFiles] = useState([]);

    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const open = Boolean(anchorEl);
    // const handleActivitiesClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleActivitiesClose = () => {
    //     setAnchorEl(null);
    // };

    // const handleFileChange = (e) => {
    //     const selectedFiles = Array.from(e.target.files);
    //     setFiles([...files, ...selectedFiles]);
    // };

    const handleDeleteFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const handlePost = async () => {
        const formData = new FormData();
        formData.append("userId", user._id);
        formData.append("description", post);

        if (files && files.length > 0) {
            let picturePaths = []; // This will be an array of arrays
            let picture = [];
            for (let i = 0; i < files.length; i++) {
                picture.push(files[i])
                const filePathArray = [files[i].path]; // Create an array with the file path
                picturePaths.push(filePathArray); // Push the array containing the file path
                formData.append("picture", files[i]);
            }
            // Append each file path array separately to FormData with the key "picturePath"
            for (let j = 0; j < picturePaths.length; j++) {
                formData.append("picturePath", picturePaths[j]);
            }
        }

        const response = await fetch(`${url}/posts`, {
            method: "POST",
            body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setPost("");
        setFiles("");
        handleClose();
        window.location.reload();
    };

    const palette = {
        neutral: { light: '#eee' }, // Sample palette values, replace with your actual palette
        primary: { main: '#007bff' },
        background: { alt: '#fff' },
        secondary: { dark: '#333' },
    };

    const medium = '#777'; // Sample color value, replace with your actual color
    const mediumMain = '#777'; // Sample color value, replace with your actual color

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isNonMobileScreens ? "40%" : "95%",
        maxHeight: '80vh',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box display={"flex"} justifyContent={"space-between"}>
                    <Typography variant="h4" component="h2" id="modal-modal-title">
                        Create a new post
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />
                <Divider />
                <Box id="modal-modal-description" sx={{ mt: 2,}}>
                    <Box gap="1rem" display={"flex"}>
                        <UserImage image={user.picturePath} /> {/* Assuming you have a picturePath */}
                        <Box>
                            <Typography variant='h5'>{user.fullName}</Typography>
                            <Typography variant='h6'>{user.occupation}</Typography>
                        </Box>
                    </Box>
                    <Box my={"1rem"}>
                        <TextareaAutosize
                            placeholder="What's on your mind?"
                            onChange={(e) => setPost(e.target.value)}
                            value={post}
                            style={{
                                background: "none",
                                width: "100%",
                                border: 'none',
                                resize: 'none', // Prevent resizing of textarea
                                outline: 'none', // Remove default focus outline
                                fontSize: "1rem",
                                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                            }}
                        />
                    </Box>

                    {/* Add Imageew */}
                    {isMedia && (
                        <Dropzone
                            acceptedFiles="image/*, video/*" // Update accepted files to include both images and videos
                            multiple={true}
                            onDrop={(acceptedFiles) => setFiles([...files, ...acceptedFiles])}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <div>
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        width="100%"
                                        sx={{ '&:hover': { cursor: 'pointer' } }}
                                    >
                                        <input {...getInputProps()} />
                                        <Typography variant="body1">Add Media Here</Typography>
                                    </Box>
                                </div>
                            )}
                        </Dropzone>
                    )}

                    <Box mt="2rem" display={"flex"} gap={"1rem"} sx={{ width: "100%" }} flexWrap="wrap">
                        {files.map((file, index) => (
                            <Box key={index} display={"flex"} width={"fit-content"} >
                                <Box display={"flex"}>
                                    <Box position="relative">
                                        {file.type.startsWith('image/') ? ( // Check if file is an image
                                            <Avatar
                                                src={URL.createObjectURL(file)}
                                                variant="square"
                                                sx={{
                                                    width: '100px',
                                                    height: 'auto',
                                                }}
                                            />
                                        ) : file.type.startsWith('video/') ? ( // Check if file is a video
                                            <video
                                                src={URL.createObjectURL(file)}
                                                controls
                                                width="150px"
                                                height="auto"
                                            />
                                        ) : (
                                            <Typography variant="body1">Unsupported File Type</Typography>
                                        )}
                                        <IconButton
                                            onClick={() => handleDeleteFile(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: '-10px',
                                                right: '-9px',
                                                backgroundColor: theme.palette.background,
                                                color: "red"
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>



                    <Divider sx={{ margin: '1.25rem 0' }} />

                    <FlexBetween>
                        <FlexBetween gap="0.25rem" onClick={() => { setIsMedia(!isMedia); }}>
                            <ImageOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain} sx={{ '&:hover': { cursor: 'pointer', color: medium } }}>Image</Typography>
                        </FlexBetween>
                        <FlexBetween gap="0.25rem" onClick={() => { setIsMedia(!isMedia); }}>
                            <VideocamOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain} sx={{ '&:hover': { cursor: 'pointer', color: medium } }}>Video</Typography>
                        </FlexBetween>
                        {/* <FlexBetween gap="0.25rem">
                            <EmojiEmotionsIcon sx={{ color: mediumMain }} />
                            <Typography color={mediumMain} sx={{ '&:hover': { cursor: 'pointer', color: medium } }}
                                id="fade-button"
                                aria-controls={open ? 'fade-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleActivitiesClick}
                            >Activities</Typography>
                            <Menu
                                id="fade-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'fade-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleActivitiesClose}
                                TransitionComponent={Fade}
                            >
                                <MenuItem onClick={() => { setActivities('Celebrating') }}><CelebrationIcon sx={{ mr: "0.5rem" }} /> Celebrating</MenuItem>
                                <MenuItem onClick={() => { setActivities('Jobs') }}><WorkIcon sx={{ mr: "0.5rem" }} /> Jobs</MenuItem>
                                <MenuItem onClick={() => { setActivities('Events') }}><EventIcon sx={{ mr: "0.5rem" }} /> Events</MenuItem>
                            </Menu>
                        </FlexBetween> */}
                        {/* Similar logic for Video and Audio tabs */}
                        <Button
                            onClick={handlePost}
                            disabled={!post}
                            sx={{
                                color: palette.background.alt,
                                backgroundColor: palette.primary.main,
                                borderRadius: '3rem',
                                cursor: 'pointer',
                                '&:hover': { color: palette.secondary.dark, backgroundColor: palette.primary.light },
                            }}
                        >
                            POST
                        </Button>
                    </FlexBetween>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreatePostWidget;
