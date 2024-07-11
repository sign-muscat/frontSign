import {Badge, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import RankTableItem from "../item/RankTableItem";
import React from "react";

function RankTable ({difficulty}) {

    //test 데이터
    const rankData = [
        {
            rankNo : 1,
            nickname: "nickname_1",
            playtime: '17:28:30',
            score: "10/10"
        },
        {
            rankNo : 2,
            nickname: "nickname_2",
            playtime: '17:28:30',
            score: "9/10"
        },
        {
            rankNo : 3,
            nickname: "nickname_3",
            playtime: '17:28:30',
            score: "8/10"
        },
        {
            rankNo : 4,
            nickname: "nickname_4",
            playtime: '17:28:30',
            score: "7/10"
        },
        {
            rankNo : 5,
            nickname: "nickname_5",
            playtime: '17:28:30',
            score: "6/10"
        }
    ]
    return (
        <>
            <Table textAlign="center">
                <Thead>
                    <Tr>
                        <Th textAlign="center" border={0} fontStyle=''>
                            <Badge colorScheme="orange" py={1} px={2} fontSize={18} borderRadius="4px">{difficulty}</Badge>
                        </Th>
                        <Th textAlign="center" border={0}>닉네임</Th>
                        <Th textAlign="center" border={0}>플레이 시간</Th>
                        <Th textAlign="center" border={0}>점수</Th>
                    </Tr>
                </Thead>
                <Tbody>
                {
                    rankData ? rankData.map((data) =>
                    <RankTableItem key={data.rankNo} rankNo={data.rankNo} nickname={data.nickname} playtime={data.playtime} score={data.score}/>
                    ) : <Tr><Td colSpan={4}> 게임 플레이 데이터가 없습니다.</Td></Tr>
                }
                </Tbody>
            </Table>
        </>
    );
}
export default RankTable;