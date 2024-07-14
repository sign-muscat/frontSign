import {
    Button, Center, Heading, Text, Box, Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay
} from "@chakra-ui/react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {callGetWordVideoAPI} from "../apis/GameAPICalls";

function SuccessModal({nextQuestion, isOpen, onClose, wordDes}) {
    const dispatch = useDispatch();
    const {wordVideo} = useSelector(state => state.GameReducer);

    useEffect(() => {
        // if(wordDes)
            // dispatch(callGetWordVideoAPI(wordDes));
    }, [wordDes, dispatch]);

    const onClickHandler = () => {
        onClose();
        nextQuestion();
    }

    return(
        wordVideo &&
        <>
            <Modal onClose={onClose} isOpen={isOpen} isCentered size='lg'>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody mt={10} mx={5}>
                        <Center>
                            <Image boxSize='80px' objectFit='cover' src='congrats.webp'/>
                        </Center>
                        <Heading textAlign='center' my={4}>축하합니다!</Heading>
                        <Text textAlign='center' fontWeight='semibold'>
                            수어 동작을 완벽하게 수행했습니다!
                        </Text>
                        <Text textAlign='center' fontWeight='semibold'>
                            이제 완성된 수어 동작 영상을 확인해보세요.
                        </Text>
                        <Box
                            as='video'
                            controls
                            src={wordVideo.videoLink}
                            objectFit='contain'
                            mt={8}
                            borderRadius='md'
                        />
                    </ModalBody>
                    <ModalFooter justifyContent='center' my={5}>
                        <Button colorScheme='yellow' onClick={onClickHandler}>다음 문제</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    );
}
export default SuccessModal;