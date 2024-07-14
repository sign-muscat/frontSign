import {Td, Tr} from "@chakra-ui/react";
import {getFormattedTime} from "../../utils/DateUtils";

function RankTableItem ({rankNo, nickname, playtime, score}) {

    const changeRank = (rank) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return rank;
    };

    return(
        <>
            <Tr>
                <Td border={0} textAlign="center" py={4}>{changeRank(rankNo)}</Td>
                <Td border={0} textAlign="center" py={4}>{nickname}</Td>
                <Td border={0} textAlign="center" py={4}>{getFormattedTime(new Date(playtime))}</Td>
                <Td border={0} textAlign="center" py={4}>{score}</Td>
            </Tr>
        </>
    );
}

export default RankTableItem;


