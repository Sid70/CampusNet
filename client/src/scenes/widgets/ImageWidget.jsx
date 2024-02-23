import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import url from '../../api/Serverhost';
import { useMediaQuery } from '@mui/material';

function ImageWidget({ picturePath }) {

    const images = picturePath;
    const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;
    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <Box sx={{ width: "100%", my: "0.5rem" }}>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {images.map((step, index) => (
                    <div key={index++}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <Box
                                component={step.endsWith('.mp4') ? 'video' : 'img'}
                                sx={{
                                    display: 'block',
                                    overflow: 'hidden',
                                    width: '100%',
                                    borderRadius: "0.5rem",
                                    minHeight: isNonMobileScreens ? "300px" : "200px",
                                    height: "auto",
                                }}
                                src={`${url}/assets/${step}`}
                                // src={`${step}`}
                                controls={step.endsWith('.mp4')}
                            />

                        ) : null}
                    </div>
                ))}
            </SwipeableViews>
            {
                (maxSteps > 1) ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: "0.3rem"
                        }}
                    >
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            activeStep={activeStep}
                            sx={{
                                background: "none",
                                fontSize: "large"
                            }}
                        />
                    </Box>
                ) :
                    null
            }
        </Box>
    );
}

export default ImageWidget;
