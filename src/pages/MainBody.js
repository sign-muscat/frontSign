import React, { useState } from 'react';
import {Box, VStack, Button, Text, HStack, Flex, Badge, Heading, Table} from '@chakra-ui/react';
import HandDetection from '../HandDetection';
import {InfoOutlineIcon} from "@chakra-ui/icons";
import RankTable from "../components/table/RankTable"; // HandDetection 컴포넌트를 별도 파일로 가정

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
        <VStack spacing={7} align="center" w="100%" p={5}>
            <Button bg="blueGray.50" w="100%" minH="60px" onClick={startGame} isDisabled={!difficulty}>
                🙏🤲 게임 시작!
                {difficulty && (<Badge bg="amber.300" ml={3} p={1} fontSize={12}>{difficulty}</Badge>)}
            </Button>

            <Flex borderRadius="md" w="100%" justifyContent="space-between">
                <Text fontWeight="bold">• 난이도</Text>
                <Flex flexDirection="column">
                    <HStack spacing={2} justify="center">
                        <Button
                            minW="90px"
                            variant={difficulty === '쉬움' ? 'amber' : 'gray'}
                            onClick={() => handleDifficultySelect('쉬움')}
                        >
                            쉬움
                        </Button>
                        <Button
                            minW="90px"
                            variant={difficulty === '보통' ? 'amber' : 'gray'}
                            onClick={() => handleDifficultySelect('보통')}
                        >
                            보통
                        </Button>
                        <Button
                            minW="90px"
                            variant={difficulty === '어려움' ? 'amber' : 'gray'}
                            onClick={() => handleDifficultySelect('어려움')}
                        >
                            어려움
                        </Button>
                    </HStack>
                    <Flex mt={3}>
                        <InfoOutlineIcon mr={2}/>
                        <Text whiteSpace="pre-wrap" fontSize="12" fontWeight="500">
                            쉬움은 1~2단계, 보통은 3~4단계, 어려움은 5~6단계로{"\n"}
                            이루어진 수어가 출제됩니다.
                        </Text>
                    </Flex>
                </Flex>
            </Flex>

            <Box borderY="1px" borderColor="blueGray.50" py={6} w="100%">
                <Text fontWeight="bold" mb={2}>소리손글 퀴즈란?</Text>
                <Text>화면의 손모양에 맞게 수어의 각 단계를 동작하여 정답을 맞추는 수어 학습용 퀴즈입니다.</Text>
            </Box>

            <Box>
                <Heading>
                    🏆 오늘의 랭킹 (2024/07/09)
                </Heading>
                <Text>오늘 하루 플레이한 게임의 총 정답률로 순위가 결정돼요.</Text>
            </Box>

            <Box w="100%" bg="gray.50" borderRadius="lg" p={5}>
                <Box>
                    <RankTable difficulty="어려움"/>
                </Box>
                <Box borderY="1px" borderColor="blueGray.50" marginY={5}>
                    <RankTable difficulty="보통"/>
                </Box>
                <Box>
                    <RankTable difficulty="쉬움"/>
                </Box>
            </Box>

        </VStack>
    );
}

export default SorisonQuiz;