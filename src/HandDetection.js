import React, { useRef, useState, useEffect } from 'react';
import { Box, VStack, Text, Button, Image, Progress, HStack } from '@chakra-ui/react';
import Webcam from 'react-webcam';
import { Hands } from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import * as drawingUtils from '@mediapipe/drawing_utils';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

function HandDetection() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  let camera = null;

  const totalQuestions = 5;
  const questions = ["바나나", "사과", "오렌지", "포도", "키위"];

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
  };

  const nextQuestion = (isCorrect) => {
    setAnsweredQuestions(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    if (questionNumber < totalQuestions) {
      setQuestionNumber(prev => prev + 1);
      setCapturedImage(null);
    } else {
      // 모든 문제를 다 풀었을 때 결과 페이지로 이동
      navigate('/finish', { state: { correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers, totalQuestions } });
    }
  };

  const skipQuestion = () => {
    nextQuestion(false);
  };

  return (
    <VStack spacing={4} align="center" w="100%" p={5}>
      <Box bg="gray.100" p={5} borderRadius="md" w="100%" maxW="640px">
        <Text fontWeight="bold" mb={4}>문제 {questionNumber}. {questions[questionNumber - 1]}</Text>
        <Text mb={4}>맞춘 문제 수: {correctAnswers}/{answeredQuestions} ({answeredQuestions > 0 ? (correctAnswers/answeredQuestions*100).toFixed(1) : 0}%)</Text>
        <Progress value={answeredQuestions} max={totalQuestions} mb={4} />
        <Box position="relative" width="640px" height="480px">
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
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bg="rgba(0,0,0,0.5)"
              color="white"
              fontSize="6xl"
              p={4}
              borderRadius="full"
            >
              {countdown}
            </Box>
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
          <HStack justifyContent="space-between" mt={4}>
            <Button onClick={() => nextQuestion(false)}>틀림</Button>
            <Button onClick={() => nextQuestion(true)} colorScheme="green">
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