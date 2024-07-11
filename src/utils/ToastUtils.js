import { createStandaloneToast } from '@chakra-ui/react';

export const statusToastAlert = (title, desc, status) => {
    const {toast} = createStandaloneToast();

    return (
        toast({
            title: title,
            description: desc,
            status: status,
            position: 'top',
            isClosable: true,
            duration: 3000
        })
    );
}