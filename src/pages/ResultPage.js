import {Box, Button, Flex, Text} from "@chakra-ui/react";
import QuestionTable from "../components/table/QuestionTable";
import RegistRank from "../components/button/RegistRank";
import {useLocation, useNavigate} from "react-router-dom";

function ResultPage() {
    const navigate = useNavigate();

    const location = useLocation();
    const { wordList, difficulty } = location.state;

    const getCorrectNum = (words) => {
        let count = 0;
        words.forEach(word => {
            if (word.isCorrect === true) count++;
        })
        return count;
    }
    const correctNum = getCorrectNum(wordList);
    const totalNum = wordList.length;

    return (
        <>
            <Box m='5' mt='10'>
                <Text fontSize='xl' fontWeight='700'>
                    🥳 맞춘 문제 ({correctNum}/{totalNum})
                </Text>
                <Text fontSize='md'>
                    이번 게임을 통해 아래 단어들을 배웠어요.
                </Text>
            </Box>
            <QuestionTable wordList={wordList}/>
            <Flex justifyContent='flex-end' my={30} mr={4}>
                <Button colorScheme='gray' size='sm' mx='5px' onClick={() => navigate('/')}>
                    메인으로
                </Button>
                <RegistRank difficulty={difficulty} correctNum={correctNum}/>
            </Flex>
        </>
    );
}

export default ResultPage;