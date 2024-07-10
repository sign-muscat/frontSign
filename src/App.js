// import { Routes, Route } from 'react-router-dom';
// import MainLayout from './layouts/MainLayout.js';
// import MainPage from './pages/MainPage.js';
// import HandDetection from './HandDetection';

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainLayout/>}>
//         <Route index element={<MainPage/>}/>
//         <Route path="hand-detection" element={<HandDetection />}/>
//       </Route>
//     </Routes>
//   );
// }

// export default App;
import React, { useState } from 'react';
import { Box, VStack, Heading, Button, Text, HStack } from '@chakra-ui/react';
import HandDetection from './HandDetection'; // HandDetection 컴포넌트를 별도 파일로 가정

function SorisonQuiz() {
  const [difficulty, setDifficulty] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
  };

  const startGame = () => {
    if (difficulty) {
      setGameStarted(true);
    }
  };

  if (gameStarted) {
    return <HandDetection difficulty={difficulty} />;
  }

  return (
    <VStack spacing={8} align="center" w="100%" p={5}>
      <Heading>소리손글 퀴즈</Heading>
      <Box bg="gray.100" p={5} borderRadius="md" w="100%" maxW="500px">
        <Text fontWeight="bold" mb={4}>게임 시작!</Text>
        <Text mb={4}>난이도:</Text>
        <HStack spacing={4} justify="center">
          <Button 
            colorScheme={difficulty === '상' ? 'yellow' : 'gray'} 
            onClick={() => handleDifficultySelect('상')}
          >
            상
          </Button>
          <Button 
            colorScheme={difficulty === '중' ? 'yellow' : 'gray'} 
            onClick={() => handleDifficultySelect('중')}
          >
            중
          </Button>
          <Button 
            colorScheme={difficulty === '하' ? 'yellow' : 'gray'} 
            onClick={() => handleDifficultySelect('하')}
          >
            하
          </Button>
        </HStack>
      </Box>
      <Button colorScheme="blue" onClick={startGame} isDisabled={!difficulty}>
        시작하기
      </Button>
      {difficulty && (
        <Text>
          {difficulty}을 선택하셨습니다. 시작하기 버튼을 눌러 게임을 시작하세요.
        </Text>
      )}
      <Box>
        <Text fontWeight="bold">소리손글 퀴즈란?</Text>
        <Text>
          화면의 손모양에 맞춰 수어의 각 단계를 동작하여 정답을 맞추는 수어 학습용 퀴즈입니다.
        </Text>
      </Box>
    </VStack>
  );
}

export default SorisonQuiz;