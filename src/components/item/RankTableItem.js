import {Td, Tr} from "@chakra-ui/react";

function RankTableItem ({rankNo, nickname, playtime, score}) {
    return(
        <>
            <Tr>
                <Td border={0}>{rankNo}</Td>
                <Td border={0}>{nickname}</Td>
                <Td border={0}>{playtime}</Td>
                <Td border={0}>{score}</Td>
            </Tr>
        </>
    );
}

export default RankTableItem;


