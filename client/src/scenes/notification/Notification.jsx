import React from 'react';
import Navbar from '../navbar/index';
import {
    Container,
    Paper,
    Typography,
    Divider,
    List,
    ListItem,
    Button,
    Card,
    Box, // Import Box from Material-UI
    Fab
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, setUpdateNotification } from '../../state/index';
import UserImage from '../../components/UserImage';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Notification() {
    const notifications = useSelector((state) => state.notifications);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleMarkAsRead = (notification) => {
        dispatch(markAsRead({ notification }));
    };

    const handleClearNotifications = () => {
        const updatedNotifications = notifications.filter(
            (notification) => notification.postUserId !== user._id
        );

        dispatch(setUpdateNotification(updatedNotifications));
    };

    return (
        <>
            <Box style={{ position: 'fixed', top: 0, width: '100%', zIndex: 999 }}>
                <Navbar />
            </Box>
            <Box sx={{mt:"7rem"}}>
                <Container maxWidth="lg" sx={{ marginTop: 5 }}>
                    <Paper elevation={4} sx={{ padding: 3 }}>
                        <Typography variant="h3" gutterBottom>
                            Notifications
                        </Typography>
                        <Divider sx={{ marginY: 2 }} />
                        <List>
                            {notifications
                                .filter((notification) => notification.postUserId === user._id)
                                .map((notification, index) => (
                                    <Card
                                        sx={{
                                            maxWidth: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginY: '1rem',
                                            p: '2px',
                                        }}
                                        key={index}
                                    >
                                        <ListItem>
                                            {/* Left Box: UserImage */}
                                            <Box>
                                                <UserImage image={notification.picturePath} size='40px' />
                                            </Box>
                                            {/* Right Box: Content and Tick Icon */}
                                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="body1" sx={{ marginLeft: '10px' }}>
                                                    {notification.message}
                                                </Typography>
                                                {!notification.read && (
                                                    <Button onClick={() => handleMarkAsRead(notification)}>
                                                        <DoneIcon />
                                                    </Button>
                                                )}
                                            </Box>
                                        </ListItem>
                                    </Card>
                                ))}
                        </List>
                        <Button variant="outlined" onClick={handleClearNotifications}>
                            Clear All Notifications
                        </Button>
                    </Paper>
                </Container>
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
        </>
    );
}
