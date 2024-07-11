import {
    Button, Center, Heading, Text, Box, Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay, useDisclosure
} from "@chakra-ui/react";

function SuccessModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return(
        <>
            <Button onClick={onOpen}>Open Modal</Button>

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
                            src='http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160325/271224/MOV000273095_700X466.webm'
                            objectFit='contain'
                            mt={8}
                            borderRadius='md'
                        />
                    </ModalBody>
                    <ModalFooter justifyContent='center' my={5}>
                        <Button colorScheme='yellow' onClick={onClose}>다음 문제</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    );
}
export default SuccessModal;