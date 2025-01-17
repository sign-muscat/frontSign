import React, { useState } from 'react';
import {Box, VStack, Button, Text, HStack, Flex, Badge} from '@chakra-ui/react';
import {InfoOutlineIcon} from "@chakra-ui/icons";
import TodayRank from "../components/TodayRank";
import {useNavigate} from "react-router-dom";

function SorisonQuiz() {
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState('쉬움');

    const handleDifficultySelect = (level) => {
        setDifficulty(level);
    };

    const startGame = () => {
        navigate('/game', {state: difficulty});
    };

    return (
        <VStack spacing={7} align="center" w="100%" p={5}>
            <Box w="100%">
                <Button bg="blueGray.50" w="100%" minH="80px" onClick={startGame} isDisabled={!difficulty}>
                    🙏🤲 게임 시작!
                    {difficulty && (<Badge bg="amber.300" ml={3} p={1} fontSize={12}>{difficulty}</Badge>)}
                </Button>

                <Flex borderRadius="md" justifyContent="space-between" mt={5}>
                    <Text fontWeight="bold">• 난이도</Text>
                    <Flex flexDirection="column">
                        <HStack spacing={2} justify="center">
                            <Button
                                p={0}
                                w="80px"
                                h="32px"
                                fontSize={14}
                                fontWeight="500"
                                variant={difficulty === '쉬움' ? 'amber' : 'gray'}
                                onClick={() => handleDifficultySelect('쉬움')}
                            >
                                쉬움
                            </Button>
                            <Button
                                p={0}
                                w="80px"
                                h="32px"
                                fontSize={14}
                                fontWeight="500"
                                variant={difficulty === '보통' ? 'amber' : 'gray'}
                                onClick={() => handleDifficultySelect('보통')}
                            >
                                보통
                            </Button>
                            <Button
                                p={0}
                                w="80px"
                                h="32px"
                                fontSize={14}
                                fontWeight="500"
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
            </Box>

            <Box borderY="1px" borderColor="blueGray.50" py={6} w="100%">
                <Text fontWeight="bold" mb={2}>소리손글 퀴즈란?</Text>
                <Text>화면의 손모양에 맞게 수어의 각 단계를 동작하여 정답을 맞추는 수어 학습용 퀴즈입니다.</Text>
            </Box>

            <TodayRank/>
        </VStack>
    );
}

export default SorisonQuiz;