import { Box, Divider, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import url from '../../api/Serverhost';
import { useEffect, useState } from "react";
import Friend from "../../components/Friend";
import { WorkOutlineOutlined } from "@mui/icons-material";


const AccountCreatedWidget = ({ userId }) => {
    const { palette } = useTheme();
    const [user, setUser] = useState(null);
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

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

    if (!user) return null;

    const timestamp = user.createdAt;
    const date = new Date(timestamp);

    // Extracting the date components
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so adding 1
    const day = date.getDate();

    // Formatting the date
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

    return (
        <WidgetWrapper m="2rem 0">
            <Friend
                friendId={userId}
                name={user.fullName}
                subtitle={user.location}
                userPicturePath={user.picturePath}
                postId={"1"}
            />
            <Box m="1rem 0" textAlign="center">
                <Box>
                    <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
                    <Typography color={medium}>{user.occupation}</Typography>
                    <Divider sx={{ mt: "1rem" }} />
                </Box>
                <Typography mt="1rem">
                    Account Created
                </Typography>
                <Typography>
                    {formattedDate}
                </Typography>
            </Box>

        </WidgetWrapper>
    );
};

export default AccountCreatedWidget;
