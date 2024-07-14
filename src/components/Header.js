import React from 'react';
import { Heading, Center } from "@chakra-ui/react";

function Header() {
    return (
        <Center h={130}>
            <Heading mt={8} fontWeight={900}>
                소리손글 퀴즈
            </Heading>
        </Center>
    )
}

export default Header;