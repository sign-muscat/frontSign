import React, {useRef, useState, useEffect} from 'react';
import {
    Box, VStack, Text, Button, Image, Progress, Heading, Flex, HStack, keyframes
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

function HandDetection({totalQuestions, questionArr, posesPerQuestion, questions, difficulty}) { //2. 테스트를 위해 난이도 추가
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //다소리 문제 이미지 적용 테스트
    //1. GameAPICalls 로 응답받는 데이터가 image URL 일 경우로 추측 하고 테스트 했을 경우!!-> 이건 성공
    // const getWordImage = useSelector((state) => state.GameReducer.wordImage.image);
    //
    // useEffect(() => {
    //     console.log('업데이트된 getWordImage:', getWordImage);  // 상태가 업데이트될 때마다 로그 출력
    // }, [getWordImage]);

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [questionNumber, setQuestionNumber] = useState(1);
    const [poseNumber, setPoseNumber] = useState(1); // 포즈 번호 추가
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState(0);

    const [countdown, setCountdown] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);

    let camera = null;

    const flash = keyframes`
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    `;
    //다소리 문제 이미지 적용 테스트
    //2. 받아 오는 단어 이름과, 포즈 숫자로 저장된 이미지 파일들 불러오기. -> 진행 중인데 중단!!
    // 난이도를 변경하는 함수
    // const getDifficultyLevel = (difficulty) => {
    //     switch (difficulty) {
    //         case '쉬움':
    //             return 'easy';
    //         case '보통':
    //             return 'normal';
    //         case '어려움':
    //             return 'hard';
    //         default:
    //             return 'easy';
    //     }
    // };

    //const wordImage = `../public/images/actionQuestion/${difficulty}/${questions[questionNumber - 1]}`;



    useEffect(() => {

        dispatch(callGetWordImageAPI(poseNumber))
        //2. 테스트 중인데 중단!
        //const difficultyLevel = getDifficultyLevel(difficulty); // 난이도 값을 설정
        //dispatch(callGetWordImageAPI(poseNumber, difficultyLevel)); // poseNumber와 난이도 값 전달
    }, [poseNumber]);

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
            camera = new cam.Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current && webcamRef.current.video) {
                        await hands.send({image: webcamRef.current.video});
                    }
                },
                width: 640,
                height: 480
            });
            camera.start();
        }

        return () => {
            if (camera) {
                camera.stop();
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

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);

        //서버로 이미지 전송 및 응답 처리 [임시]
        fakeServerRequest(imageSrc).then((isCorrect) => {
            if (isCorrect) {
                nextPose(true);
            } else {
                nextPose(false);
            }
        });
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


    //console.log("마지막으로 찍어보는 값!!! poseImage!! : " , poseImage)
    //console.log("마지막으로 찍어보는 값!!! getWordImage!! : " , getWordImage)
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


                    {/*<Image src={getWordImage} alt="Pose" position="absolute" top="0" left="0" width="100%" height="100%" />*/}


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