import { Button } from "@chakra-ui/react";

function SkipButton() {
    let count = 1; // 나중에 props로 바꿀 예정
    return (
        <Button
            colorScheme='gray'
            size='sm'
            isDisabled={count === 0}
        >
            이 문제 건너뛰기({count}/3)
        </Button>
    )
}

export default SkipButton;