import React, {useRef, useState, useEffect} from 'react';
import {
    Box, VStack, Text, Button, Image, Progress, Heading, Flex, HStack, keyframes, useToast,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import Webcam from 'react-webcam';
import Confetti from 'react-confetti';
import {useNavigate} from 'react-router-dom';
import CountdownCircleTimer from "./components/CountdownCircleTimer";
import WordStepper from "./components/WordStepper";
import {useDispatch} from "react-redux";
import {callGetWordImageAPI} from "./apis/GameAPICalls";
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

function HandDetection({totalQuestions, questionArr, posesPerQuestion, questions}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const webcamRef = useRef(null);

    const [questionNumber, setQuestionNumber] = useState(1);
    const [poseNumber, setPoseNumber] = useState(1);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);

    const [countdown, setCountdown] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);

    const [isWrongAnswer, setIsWrongAnswer] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = React.useRef();

    const flash = keyframes`
        from { opacity: 1; }
        to { opacity: 0; }
    `;

    useEffect(() => {
        dispatch(callGetWordImageAPI(poseNumber))
    }, [poseNumber, questionNumber, dispatch]);

    const startCountdown = () => {
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    setIsFlashing(true);
                    setTimeout(() => {
                        setIsFlashing(false);
                    }, 300);

                    clearInterval(timer);
                    captureImage();
                    return null;
                }
                return prevCount - 1;
            });
        }, 1000);
    };

    const captureImage = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
    
        try {
            const imageBlob = await fetch(imageSrc).then(res => res.blob());
            const wordNo = (questionNumber - 1) * 2 + poseNumber;
            const wordDes = 100 + questionNumber;
    
            const formData = new FormData();
            formData.append('file', imageBlob, 'capture.jpg');
            formData.append('wordNo', wordNo.toString());
            formData.append('wordDes', wordDes.toString());
    
            const response = await api.post('/answerfile/', formData);
    
            if (response.data) {
                if (response.data.isSimilar !== undefined) {
                    if (response.data.isSimilar) {
                        nextPose(true);
                    } else {
                        setIsWrongAnswer(true);
                        setIsAlertOpen(true);
                    }
                } else {
                    console.warn('Server response does not contain isSimilar field');
                    toast({
                        title: "서버 응답 오류",
                        description: "서버 응답에 필요한 정보가 누락되었습니다.",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                    });
                }
    
                if (response.data.image) {
                    setCapturedImage(`data:image/png;base64,${response.data.image}`);
                } else {
                    console.warn('Server did not return image data');
                }
            } else {
                console.error('Server response is empty');
                toast({
                    title: "서버 응답 오류",
                    description: "서버 응답이 비어있습니다.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
    
        } catch (error) {
            console.error('Error sending image to server:', error);
            let errorMessage = "서버와의 통신 중 오류가 발생했습니다.";
            
            if (error.response) {
                console.error('Server responded with error:', error.response.data);
                errorMessage = error.response.data.detail || errorMessage;
            } else if (error.request) {
                console.error('No response received:', error.request);
                errorMessage = "서버로부터 응답을 받지 못했습니다.";
            } else {
                console.error('Error setting up request:', error.message);
            }

            toast({
                title: "오류 발생",
                description: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            
            setIsWrongAnswer(true);
            setIsAlertOpen(true);
        }
    };

    const nextPose = (isCorrect) => {
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
        if (poseNumber < posesPerQuestion[questionNumber - 1]) {
            setPoseNumber(prev => prev + 1);
        } else {
            nextQuestion();
        }
        setCapturedImage(null);
    };

    const nextQuestion = () => {
        setAnsweredQuestions(prev => prev + 1);
        if (questionNumber < totalQuestions) {
            setQuestionNumber(prev => prev + 1);
            setPoseNumber(1);
        } else {
            navigate('/finish', {state: {correctAnswers, totalQuestions}});
        }
    };

    const skipQuestion = () => {
        setAnsweredQuestions(prev => prev + 1);
        if (questionNumber < totalQuestions) {
            setQuestionNumber(prev => prev + 1);
            setPoseNumber(1);
        } else {
            navigate('/finish', {state: {correctAnswers, totalQuestions}});
        }
    };

    const retryPose = () => {
        setCapturedImage(null);
        setIsWrongAnswer(false);
        setIsAlertOpen(false);
    };

    return (
        <VStack spacing={5} align="center" w="100%" p={5}>
            <Flex w="100%" h="60px" justifyContent="space-between" alignItems="center">
                <Heading fontSize={30} fontWeight="600">문제 {questionNumber}.</Heading>
                <Flex bg="blueGray.50" w="80%" h="100%" borderRadius="5px" fontWeight="600" alignItems="center"
                      justifyContent="center">{questions[questionNumber - 1]}</Flex>
            </Flex>

            <Box borderRadius="md" w="100%" maxW="640px" position="relative">
                <Text mb={4}>
                    맞춘 문제 수: {correctAnswers}/{answeredQuestions} ({answeredQuestions > 0 ? (correctAnswers / answeredQuestions * 100).toFixed(1) : 0}%)
                </Text>
                <WordStepper
                    questionNumber={questionNumber}
                    posesPerQuestion={posesPerQuestion}
                    poseNumber={poseNumber}
                />

                <Progress value={answeredQuestions} max={totalQuestions} mb={4} display="none"/>
                <Box position="relative" width="100%" height="376.5px" borderRadius={5} overflow="hidden">
                    {!capturedImage ? (
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    ) : (
                        <Image src={capturedImage} alt="Captured"/>
                    )}
                    {countdown && (
                        <Box position='absolute' top='0' right='0' p={4}>
                            <CountdownCircleTimer seconds={countdown} totalSeconds={3}/>
                        </Box>
                    )}
                    {isFlashing && (
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            bg="white"
                            animation={`${flash} 0.3s ease-out`}
                        />
                    )}
                </Box>
                {!capturedImage && !isWrongAnswer && (
                    <HStack justifyContent="space-between" mt={4}>
                        <Button onClick={skipQuestion}>문제 건너뛰기</Button>
                        <Button onClick={startCountdown} isDisabled={countdown !== null}>
                            사진 찍기
                        </Button>
                    </HStack>
                )}
                {isWrongAnswer && (
                    <HStack justifyContent="space-between" mt={4}>
                        <Button onClick={skipQuestion}>문제 건너뛰기</Button>
                        <Button onClick={retryPose} colorScheme="blue">
                            다시 시도
                        </Button>
                    </HStack>
                )}
            </Box>

            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsAlertOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            틀렸습니다!
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            정답과 일치하지 않습니다. 다시 시도해보세요.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                                확인
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
        </VStack>
    );
}

export default HandDetection;