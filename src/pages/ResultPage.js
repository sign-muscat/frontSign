import {Box, Button, Flex, Text} from "@chakra-ui/react";
import QuestionTable from "../components/table/QuestionTable";
import RegistRank from "../components/button/RegistRank";
import {useNavigate} from "react-router-dom";

function ResultPage(/*{ difficulty, correctNum }*/) {
    const navigate = useNavigate();

    /* 이후 props로 전달 받을 예정 */
    const difficulty = 'easy';
    const correctNum = 3;

    return (
        <>
            <Box m='5' mt='10'>
                <Text fontSize='xl' fontWeight='700'>
                    🥳 맞춘 문제 ({correctNum}/5)
                </Text>
                <Text fontSize='md'>
                    이번 게임을 통해 아래 단어들을 배웠어요.
                </Text>
            </Box>
            <QuestionTable/>
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