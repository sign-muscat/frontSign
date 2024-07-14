import React, {useRef, useState, useEffect} from 'react';
import {
    Box, VStack, Text, Button, Image, Progress, Heading, Flex, HStack, keyframes, useToast,
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
import axios from 'axios';

function HandDetection({totalQuestions, questionArr, posesPerQuestion, questions, difficulty}) { //2. 테스트를 위해 난이도 추가
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();



    //다소리 문제 이미지 적용 테스트
    //1. GameAPICalls 로 응답받는 데이터가 image URL 일 경우로 추측 하고 테스트 했을 경우!!-> 이건 성공
    const getWordImage = useSelector((state) => state.GameReducer.wordImage ? state.GameReducer.wordImage.image : undefined);
    console.log("뭐야. 왜 안돼. :", getWordImage)

    useEffect(() => {
        console.log('업데이트된 getWordImage:', getWordImage);  // 상태가 업데이트될 때마다 로그 출력
    }, [getWordImage]);

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);

    const [questionNumber, setQuestionNumber] = useState(1);
    const [poseNumber, setPoseNumber] = useState(1);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);

    const [countdown, setCountdown] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);

    // 새로운 state 추가
    const [isWrongAnswer, setIsWrongAnswer] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = React.useRef();

    const flash = keyframes`
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    `;

    useEffect(() => {
        dispatch(callGetWordImageAPI(poseNumber))
    }, [poseNumber, dispatch]);

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

        try {
            const imageBlob = await fetch(imageSrc).then(res => res.blob());
            const wordNo = (questionNumber - 1) * 2 + poseNumber;
            const wordDes = 100 + questionNumber;

            console.log('Calculated values:');
            console.log('wordNo:', wordNo);
            console.log('wordDes:', wordDes);

            const formData = new FormData();
            formData.append('file', imageBlob, 'capture.jpg');
            formData.append('wordNo', wordNo.toString());
            formData.append('wordDes', wordDes.toString());

            console.log('Sending data to server:');
            console.log('file:', imageBlob);
            console.log('wordNo:', wordNo);
            console.log('wordDes:', wordDes);

            const response = await axios.post('http://localhost:8000/answerfile/', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Full server response:', response);
            console.log('Server response data:', response.data);
            console.log('Server response status:', response.status);

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
                }

                if (response.data.image) {
                    setCapturedImage(`data:image/png;base64,${response.data.image}`);
                } else {
                    console.warn('Server did not return image data');
                }
            } else {
                console.error('Server response is empty');
            }

        } catch (error) {
            console.error('Error sending image to server:', error);
            if (error.response) {
                console.error('Server responded with error:', error.response.data);
                console.error('Status code:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
        }
    };


    // 서버로 이미지 전송 및 응답을 가정한 함수
    const fakeServerRequest = (imageSrc) => {
        /*TODO: 여기에 dispatch 해서 POST 요청 - 정답 확인 추가 (아래 임시 전송 지우고) */
        /*TODO: 이미지, questionNumber를 키값 "wordDes"로, poseNumber를 키값 "wordNo"로 넘겨야 함. */

        return new Promise((resolve) => {
            setTimeout(() => {
                const isCorrect = Math.random() > 0.5; // 임의로 정답 여부 결정
                resolve(isCorrect);
            }, 1000);
        });
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
                    <Image src={getWordImage} alt="Pose" position="absolute" top="0" left="0" width="100%" height="100%" />
                </Box>
                {!capturedImage && (
                    <HStack justifyContent="space-between" mt={4}>
                        <Button onClick={skipQuestion}>문제 건너뛰기</Button>
                        <Button onClick={startCountdown} isDisabled={countdown !== null}>
                            사진 찍기
                        </Button>
                    </HStack>
                )}
            </Box>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
        </VStack>
    );
}

export default HandDetection;