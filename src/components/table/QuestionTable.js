import {Box, Table, TableContainer, Tbody} from "@chakra-ui/react";
import QuestionTableItem from "../item/QuestionTableItem";
function QuestionTable({wordList}) {
    return (
        <Box bg='gray.100' mx='15px' borderRadius='md'>
            <TableContainer>
                <Table variant='simple'>
                    <Tbody>
                        {
                            wordList.map((data, index) =>
                                <QuestionTableItem key={index} data={data} id={index + 1}/>
                            )
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default QuestionTable;