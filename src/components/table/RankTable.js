import {Badge, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import RankTableItem from "../item/RankTableItem";
import React from "react";

function RankTable ({difficulty, ranks}) {

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
                    ranks && ranks.length !== 0 ? ranks.map((data, index) =>
                    <RankTableItem key={index} rankNo={index + 1} nickname={data.nickName} playtime={data.today} score={data.correct_ratio}/>
                    ) : <Tr><Td colSpan={4}> 게임 플레이 데이터가 없습니다.</Td></Tr>
                }
                </Tbody>
            </Table>
        </>
    );
}
export default RankTable;