import React, { useEffect, useState } from 'react';
import { CircularProgress, CircularProgressLabel, Box, Text } from "@chakra-ui/react";

const CountdownCircleTimer = ({ seconds, totalSeconds }) => {
    const [timeLeft, setTimeLeft] = useState(seconds);

    useEffect(() => {
        setTimeLeft(seconds);
    }, [seconds]);

    const progressValue = (timeLeft / totalSeconds) * 100;

    return (
        <Box textAlign="center">
            <CircularProgress value={progressValue} size="50px" color="yellow.500">
                <CircularProgressLabel>
                    <Text fontSize="2xl" fontWeight='bold' color='yellow.400'>{timeLeft}</Text>
                </CircularProgressLabel>
            </CircularProgress>
        </Box>
    );
};

export default CountdownCircleTimer;
