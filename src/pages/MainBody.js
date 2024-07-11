import React, { useState } from 'react';
import { Box, VStack, Button, Text, HStack } from '@chakra-ui/react';
import HandDetection from '../HandDetection'; // HandDetection 컴포넌트를 별도 파일로 가정

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
            <Box bg="gray.100" p={5} borderRadius="md" w="100%" maxW="500px">
                <Text fontWeight="bold" mb={4}>🙏🤲 게임 시작!</Text>
            </Box>
            <Box p={5} borderRadius="md" w="100%" maxW="500px">
                <Text mb={4}>난이도:</Text>
                <HStack spacing={4} justify="center">
                    <Button
                        colorScheme={difficulty === '쉬움' ? 'yellow' : 'gray'}
                        onClick={() => handleDifficultySelect('쉬움')}
                    >
                        쉬움
                    </Button>
                    <Button
                        colorScheme={difficulty === '보통' ? 'yellow' : 'gray'}
                        onClick={() => handleDifficultySelect('보통')}
                    >
                        보통
                    </Button>
                    <Button
                        colorScheme={difficulty === '어려움' ? 'yellow' : 'gray'}
                        onClick={() => handleDifficultySelect('어려움')}
                    >
                        어려움
                    </Button>
                </HStack>
            </Box>
            <Box borderY="1px" borderColor="blueGray.50">
                <Text fontWeight="bold">소리손글 퀴즈란?</Text>
                <Text>화면의 손모양에 맞게 수어의 각 단계를 동작하여 정답을 맞추는 수어 학습용 퀴즈입니다.</Text>
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