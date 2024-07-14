import React, {useRef, useState, useEffect} from 'react';
import {
    Box, VStack, Text, Button, Image, Progress, Heading, Flex, HStack, keyframes, useDisclosure, useToast,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import Webcam from 'react-webcam';
import {Hands} from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';
import Confetti from 'react-confetti';
import {useNavigate} from 'react-router-dom';
import CountdownCircleTimer from "./components/CountdownCircleTimer";
import WordStepper from "./components/WordStepper";
import {useDispatch, useSelector} from "react-redux";
import {callGetWordImageAPI} from "./apis/GameAPICalls";
import SuccessModal from "./components/SuccessModal";
import axios from 'axios';

function HandDetection({difficulty, totalQuestions, questionArr, posesPerQuestion, questions}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const toast = useToast();

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);

    const [questionNumber, setQuestionNumber] = useState(1);
    const [poseNumber, setPoseNumber] = useState(1);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [wordList, setWordList] = useState([]);

    const [countdown, setCountdown] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);

    const [isWrongAnswer, setIsWrongAnswer] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = React.useRef();

    const {wordImage} = useSelector(state => state.GameReducer);

    const flash = keyframes`
        from { opacity: 1; }
        to { opacity: 0; }
    `;

    useEffect(() => {
        dispatch(callGetWordImageAPI(questionArr[questionNumber - 1], poseNumber))
    }, [poseNumber, dispatch]);

    useEffect(() => {
        console.log("word: ", wordList);
        if(questionNumber > totalQuestions)
            navigate('/finish', {state: {wordList, difficulty}});
    }, [wordList]);

    useEffect(() => {
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);

        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
            cameraRef.current = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current && webcamRef.current.video) {
                        await hands.send({image: webcamRef.current.video});
                    }
                },
                width: 640,
                height: 480
            });
            cameraRef.current.start();
        }

        return () => {
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
    }, []);

    const onResults = (results) => {
        if (!webcamRef.current || !webcamRef.current.video) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawingUtils.drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS,
                    {color: '#00FF00', lineWidth: 5});
                drawingUtils.drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
            }
        }
        canvasCtx.restore();
    }

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
        console.log('Debug values:');
        console.log('questionNumber:', questionNumber);
        console.log('poseNumber:', poseNumber);

        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);

        const isCorrect = Math.random() < 0.8;  // 80% 확률로 정답 처리

        if (isCorrect) {
            nextPose(true);  // 정답 처리
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        } else {
            setIsWrongAnswer(true);
            setIsAlertOpen(true);
        }

    };

    const nextPose = (isCorrect) => {
        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
        }
        if (poseNumber < posesPerQuestion[questionNumber - 1]) {
            setPoseNumber(prev => prev + 1);
        } else {
            setAnsweredQuestions(prev => prev + 1);  // 여기에 추가
            onOpen();
        }
        setCapturedImage(null);
        setIsWrongAnswer(false);
        setIsAlertOpen(false);
    };

    const nextQuestion = () => {
        setWordList(prev => [
            ...prev,
            { wordDes: questionArr[questionNumber - 1], wordName: questions[questionNumber - 1], isCorrect: true}
        ]);
        setAnsweredQuestions(prev => prev + 1);
        setQuestionNumber(prev => prev + 1);
        if (questionNumber < totalQuestions) {
            setPoseNumber(1);
        }
    };

    const skipQuestion = () => {
        setWordList(prev => [
            ...prev,
            { wordDes: questionArr[questionNumber - 1], wordName: questions[questionNumber - 1], isCorrect: false}
        ]);
        // setAnsweredQuestions(prev => prev + 1);  // 이 줄을 제거
        setQuestionNumber(prev => prev + 1);
        if (questionNumber < totalQuestions) {
            setPoseNumber(1);
        }
        nextPose(false);  // 여기에 추가
    };

    const retryPose = () => {
        setCapturedImage(null);
        setIsWrongAnswer(false);
        setIsAlertOpen(false);
    };

    return (
        <>
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
                            <>
                                <Webcam
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </>
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
                        {!capturedImage && wordImage &&
                            <Image src={wordImage} alt="Guide"
                                   position="absolute"
                                   top={0}
                                   left={0}
                                   opacity={0.3}
                                   width="100%"
                                   height="100%"/>
                        }
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
            <SuccessModal nextQuestion={nextQuestion} isOpen={isOpen} onClose={onClose}
                          wordDes={questionArr[questionNumber - 1]}/>
        </>
    );
}

export default HandDetection;