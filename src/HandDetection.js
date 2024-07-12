import React, { useRef, useState, useEffect } from 'react';
import {Box, VStack, Text, Button, Image, Progress, Heading, Flex, HStack, keyframes,Stepper,
    Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepSeparator} from '@chakra-ui/react';
import Webcam from 'react-webcam';
import { Hands } from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import CountdownCircleTimer from "./components/CountdownCircleTimer";

function HandDetection() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [poseNumber, setPoseNumber] = useState(1); // 포즈 번호 추가
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  let camera = null;

  const totalQuestions = 8;
  const posesPerQuestion = [3, 2, 4, 3, 5]; // 각 질문당 포즈의 갯수
  const questions = ["바나나", "사과", "오렌지", "포도", "키위"];

  const flash = keyframes`
    from { opacity: 1; }
    to { opacity: 0; }
  `;

    let paddingVertical;
    if (posesPerQuestion[questionNumber - 1] === 1 || posesPerQuestion[questionNumber - 1] >= 6) {
        paddingVertical = '0';
    } else if (posesPerQuestion[questionNumber - 1] === 2) {
        paddingVertical = '11rem';
    } else if (posesPerQuestion[questionNumber - 1] === 3) {
        paddingVertical = '8rem';
    } else if (posesPerQuestion[questionNumber - 1] === 4) {
        paddingVertical = '6rem';
    } else if (posesPerQuestion[questionNumber - 1] === 5) {
        paddingVertical = '4rem';
    }

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

  // const nextQuestion = (isCorrect) => {
  //   setAnsweredQuestions(prev => prev + 1);
  //   if (isCorrect) {
  //     setCorrectAnswers(prev => prev + 1);
  //     setShowConfetti(true);
  //     setTimeout(() => setShowConfetti(false), 5000);
  //   }
  //   if (questionNumber < totalQuestions) {
  //     setQuestionNumber(prev => prev + 1);
  //     setCapturedImage(null);
  //   } else {
  //     // 모든 문제를 다 풀었을 때 결과 페이지로 이동
  //     navigate('/finish', { state: { correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers, totalQuestions } });
  //   }
  // };

  const nextQuestion = () => {
    setAnsweredQuestions(prev => prev + 1);
    if (questionNumber < totalQuestions) {
      setQuestionNumber(prev => prev + 1);
      setPoseNumber(1);
    } else {
      navigate('/finish', { state: { correctAnswers, totalQuestions } });
    }
  };


  // const skipQuestion = () => {
  //   nextQuestion(false);
  // };

  const skipQuestion = () => {
    setAnsweredQuestions(prev => prev + 1);
    if (questionNumber < totalQuestions) {
      setQuestionNumber(prev => prev + 1);
      setPoseNumber(1);
    } else {
      navigate('/finish', { state: { correctAnswers, totalQuestions } });
    }
  };

  // 서버로 이미지 전송 및 응답을 가정한 함수
  const fakeServerRequest = (imageSrc) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isCorrect = Math.random() > 0.5; // 임의로 정답 여부 결정
        resolve(isCorrect);
      }, 1000);
    });
  };

  return (
    <VStack spacing={5} align="center" w="100%" p={5}>
      <Flex w="100%" h="60px" justifyContent="space-between" alignItems="center">
        <Heading fontSize={30} fontWeight="600">문제 {questionNumber}.</Heading>
        <Flex bg="blueGray.50" w="80%" h="100%" borderRadius="5px" fontWeight="600" alignItems="center" justifyContent="center">{questions[questionNumber - 1]}</Flex>
      </Flex>

      <Box borderRadius="md" w="100%" maxW="640px" position="relative">
        <Text mb={4}>맞춘 문제 수: {correctAnswers}/{answeredQuestions} ({answeredQuestions > 0 ? (correctAnswers/answeredQuestions*100).toFixed(1) : 0}%)</Text>

        <Flex justifyContent="center" position="absolute" h="100%" right="-100px" top="0" py={paddingVertical} >
              <Stepper orientation='vertical' index={poseNumber - 1} gap="0" height='100%' justifyContent="center">
                  {Array.from({ length: posesPerQuestion[questionNumber - 1] }).map((_, index) => (
                      <Step key={index}>
                          <StepIndicator
                              sx={{
                                  borderColor : "amber.300!important",
                                  bg : index === poseNumber -1 ? 'amber.300' : index < poseNumber -1 ? ' amber.300!important':'white',
                                  color: index === poseNumber -1 ? 'white' : index < poseNumber -1 ? 'white':'black'
                              }}
                          >
                              <StepStatus
                                  complete={<StepIcon />}
                                  incomplete={<StepNumber />}
                                  active={<StepNumber />}
                              />
                          </StepIndicator>
                          <Flex flexShrink="0" h="32px" alignItems="center" justifyContent="center">
                              {/*<StepTitle borderRadius="3px" py={1} px={2} color={index === questionNumber -1 ? 'amber.300': 'black'}>{index + 1} 단계</StepTitle>*/}
                              {/*<StepDescription>description</StepDescription>*/}
                          </Flex>
                          <StepSeparator bg={index === poseNumber -1 ? 'blueGray.50' : index < poseNumber -1 ? ' amber.300!important':'blueGray.50' } />
                      </Step>
                  ))}
              </Stepper>
        </Flex>

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
            <Image src={capturedImage} alt="Captured" />
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
        {!capturedImage ? (
          <HStack justifyContent="space-between" mt={4}>
            <Button onClick={skipQuestion}>건너뛰기</Button>
            <Button onClick={startCountdown} isDisabled={countdown !== null}>
              사진 찍기
            </Button>
          </HStack>
        ) : (
          // <HStack justifyContent="space-between" mt={4}>
          //   <Button onClick={() => nextQuestion(false)}>틀림</Button>
          //   <Button onClick={() => nextQuestion(true)} colorScheme="green">
          //     맞음
          //   </Button>
          // </HStack>
            <HStack justifyContent="space-between" mt={4}>
              <Button onClick={() => nextPose(false)}>틀림</Button>
              <Button onClick={() => nextPose(true)} colorScheme="green">
                맞음
              </Button>
            </HStack>
        )}
      </Box>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
    </VStack>
  );
}

export default HandDetection;