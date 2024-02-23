import {
    ImageOutlined,
} from "@mui/icons-material";
import { VideocamOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Divider,
    Typography,
    useTheme,
    Button,
    IconButton,
    TextareaAutosize,
    Avatar,
} from "@mui/material";
import FlexBetween from "../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../components/UserImage";
import { useState } from "react";
import { useSelector } from "react-redux";
import url from '../api/Serverhost';
import { useNavigate } from "react-router-dom";

const EditPost = ({ postId, closeEditDialog }) => {
    const [post, setPost] = useState('');
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
    const theme = useTheme();
    const [isMedia, setIsMedia] = useState(false);
    const navigate = useNavigate();

    const user = useSelector((state) => state.user);
    // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    const [files, setFiles] = useState([]);

    const handlePost = async () => {
        const formDataFields = {
            userId: _id,
            description: post,
            picturePath: [],
        };

        files.map((file) => formDataFields.picturePath.push(file.name));

        try {
            const response = await fetch(`${url}/posts/${postId}/EditPost`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataFields),
            });

            if (response.ok) {
                // Show an alert message indicating success
                window.alert('Data updated successfully');
                closeEditDialog();
                navigate(0)
                
            } else {
                // Handle the case where the request fails
                throw new Error('Failed to edit post');
            }
        } catch (error) {
            console.error('Error editing post:', error);
        }
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };


    return (
        <Box padding={"0.5rem 1.5rem 0.75rem 1.5rem"}>
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
            {/* {(isImage || isVideo || isAudio) && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    {(isImage) ?
                        <>
                            <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <FlexBetween>
                                        <Box
                                            {...getRootProps()}
                                            border={`2px dashed ${palette.primary.main}`}
                                            p="1rem"
                                            width="100%"
                                            sx={{ "&:hover": { cursor: "pointer" } }}
                                        >
                                            <input {...getInputProps()} />
                                            {!image ? (
                                                <p>Add Image Here</p>
                                            ) : (
                                                <FlexBetween>
                                                    <Typography>{image.name}</Typography>
                                                    <EditOutlined />
                                                </FlexBetween>
                                            )}
                                        </Box>
                                        {image && (
                                            <IconButton
                                                onClick={() => setImage(null)}
                                                sx={{ width: "15%" }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        )}
                                    </FlexBetween>
                                )}
                            </Dropzone>
                        </> : null}

                    {(isVideo) ?
                        <>
                            <Dropzone
                                acceptedFiles=".mp4"
                                multiple={false}
                                onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <FlexBetween>
                                        <Box
                                            {...getRootProps()}
                                            border={`2px dashed ${palette.primary.main}`}
                                            p="1rem"
                                            width="100%"
                                            sx={{ "&:hover": { cursor: "pointer" } }}
                                        >
                                            <input {...getInputProps()} />
                                            {!video ? (
                                                <p>Add Video Here</p>
                                            ) : (
                                                <FlexBetween>
                                                    <Typography>{video.name}</Typography>
                                                    <EditOutlined />
                                                </FlexBetween>
                                            )}
                                        </Box>
                                        {video && (
                                            <IconButton
                                                onClick={() => setVideo(null)}
                                                sx={{ width: "15%" }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        )}
                                    </FlexBetween>
                                )}
                            </Dropzone>
                        </> : null}
                    {(isAudio) ?
                        <>
                            <Dropzone
                                acceptedFiles=".pdf"
                                multiple={false}
                                onDrop={(acceptedFiles) => setAudio(acceptedFiles[0])}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <FlexBetween>
                                        <Box
                                            {...getRootProps()}
                                            border={`2px dashed ${palette.primary.main}`}
                                            p="1rem"
                                            width="100%"
                                            sx={{ "&:hover": { cursor: "pointer" } }}
                                        >
                                            <input {...getInputProps()} />
                                            {!audio ? (
                                                <p>Add Audio Here</p>
                                            ) : (
                                                <FlexBetween>
                                                    <Typography>{audio.name}</Typography>
                                                    <EditOutlined />
                                                </FlexBetween>
                                            )}
                                        </Box>
                                        {audio && (
                                            <IconButton
                                                onClick={() => setAudio(null)}
                                                sx={{ width: "15%" }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        )}
                                    </FlexBetween>
                                )}
                            </Dropzone>
                        </> : null
                    }
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => {
                    setIsImage(!isImage);
                    setIsVideo(false);
                    setIsAudio(false);
                }}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => {
                    setIsImage(false);
                    setIsVideo(!isVideo);
                    setIsAudio(false);
                }} >
                    <GifBoxOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>Video</Typography>
                </FlexBetween>

                <FlexBetween gap="0.25rem" onClick={() => {
                    setIsImage(false);
                    setIsVideo(false);
                    setIsAudio(!isAudio);
                }}>
                    <MicOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>Audio</Typography>
                </FlexBetween>

                <Button
                    onClick={() => {
                        handlePost()
                        closeEditDialog()
                        setTimeout(() => {
                            window.alert('Updated successfully');
                            window.location.reload();
                        }, 1000);
                    }}
                    disabled={!post}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                        cursor: "pointer",
                        "&:hover": { color: palette.secondary.dark , backgroundColor: palette.primary.light }
                    }}
                >
                    POST
                </Button>
            </FlexBetween> */}
        </Box>
    );
};

export default EditPost;