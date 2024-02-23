// src/CaptchaGenerator.js
import React, { useState } from 'react';
import { TextField, Box, IconButton, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        captcha += characters.charAt(randomIndex);
    }

    return captcha;
};


const CaptchaGenerator = () => {
    const [captcha, setCaptcha] = useState(generateCaptcha());

    const handleReload = () => {
        setCaptcha(generateCaptcha());
    };

    return (
        <div style={{ display: "flex", alignItems: "baseline", margin: "1px" }}>
            <TextField label="Enter CAPTCHA" variant="outlined" style={{ marginBottom: 10 }} />
            <Box display="flex" alignItems="center" style={{ padding: "2px 8px", }}>
                <Typography variant="h5" style={{ fontWeight: "bold", letterSpacing: "5px", border: "1px solid lightgray", padding: "5px 2rem" }}>{captcha}</Typography>
                <IconButton onClick={handleReload} color="primary" style={{ marginLeft: 10 }}>
                    <RefreshIcon />
                </IconButton>
            </Box>
        </div>
    );
};

export default CaptchaGenerator;
