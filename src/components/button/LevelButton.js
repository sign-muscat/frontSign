import {Button} from "@chakra-ui/react";

//TODO: 질문1) 컴포넌트화 시킬것인가? / 질문2) 값을 프롭스로 받을 것인가? 아님 걍 지금처럼 사용할 것인가?
function LevelButton({text}) {
    return (
        <>
            <Button width="50px" height="20px">{text ? text : ''}</Button>
        </>
    );

}

export default LevelButton;