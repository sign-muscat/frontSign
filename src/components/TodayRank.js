import {Box, Heading, Text} from "@chakra-ui/react";
import RankTable from "./table/RankTable";
import React from "react";

function TodayRank() {

    const getFormattedDate = () => {
        const today = new Date();

        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}/${month}/${day}`;
    }

    return (
        <>
            <Box w="100%">
                <Heading fontSize="30px">
                    🏆 오늘의 랭킹 ({getFormattedDate()})
                </Heading>
                <Text ml={10} mt={1}>오늘 하루 플레이한 게임의 총 정답률로 순위가 결정돼요.</Text>
            </Box>

            <Box w="100%" bg="gray.50" borderRadius="lg" p={5}>
                <Box>
                    <RankTable difficulty="어려움"/>
                </Box>
                <Box borderY="1px" borderColor="blueGray.50" marginY={5} py={8}>
                    <RankTable difficulty="보통"/>
                </Box>
                <Box>
                    <RankTable difficulty="쉬움"/>
                </Box>
            </Box>
        </>
    );
}

export default TodayRank;