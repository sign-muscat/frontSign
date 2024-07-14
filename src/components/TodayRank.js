import {Box, Heading, Text} from "@chakra-ui/react";
import RankTable from "./table/RankTable";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {callRanksAPI} from "../apis/RankAPICalls";
import {getFormattedDate} from "../utils/DateUtils";

function TodayRank() {

    const dispatch = useDispatch();
    const {ranks} = useSelector(state => state.RankReducer);

    useEffect(() => {
        dispatch(callRanksAPI());
    }, [dispatch]);

    const getRanksByDiff = (rankings, levels) => {
        return rankings.filter(item => item.levels == levels);
    }

    return (
        ranks &&
        <>
            <Box w="100%">
                <Text fontSize="24px" fontWeight="bold">
                    🏆 오늘의 랭킹 ({getFormattedDate(new Date())})
                </Text>
                <Text ml={10} mt={1}>오늘 하루 플레이한 게임의 총 정답률로 순위가 결정돼요.</Text>
            </Box>

            <Box w="100%" bg="gray.50" borderRadius="lg" p={5}>
                <Box>
                    <RankTable difficulty="어려움" ranks={getRanksByDiff(ranks, "difficult")}/>
                </Box>
                <Box borderY="1px" borderColor="blueGray.50" marginY={5} py={8}>
                    <RankTable difficulty="보통" ranks={getRanksByDiff(ranks, "medium")}/>
                </Box>
                <Box>
                    <RankTable difficulty="쉬움" ranks={getRanksByDiff(ranks, "easy")}/>
                </Box>
            </Box>
        </>
    );
}

export default TodayRank;