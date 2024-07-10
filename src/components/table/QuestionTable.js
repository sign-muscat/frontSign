import {Box, Table, TableContainer, Tbody} from "@chakra-ui/react";
import QuestionTableItem from "../item/QuestionTableItem";
function QuestionTable() {

    const sampleData = [
        {
            'sign': '바나나',
            'isCorrect': true
        },
        {
            'sign': '사과',
            'isCorrect': true
        },
        {
            'sign': '산',
            'isCorrect': true
        },
        {
            'sign': '바다',
            'isCorrect': false
        },
    ]
    return (
        <Box bg='gray.100' mx='15px' borderRadius='md'>
            <TableContainer>
                <Table variant='simple'>
                    <Tbody>
                        {
                            sampleData.map((data, index) =>
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