import HandDetection from "../HandDetection";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {callGetWordsAPI} from "../apis/GameAPICalls";
import {useDispatch, useSelector} from "react-redux";

function GamePage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const difficulty = location.state;

    // Total number of Questions
    const count = 2;

    useEffect(() => {
        // 처음 게임 시작할 때 난이도, 문제 수를 전달해 문제 출제 받아옴
        dispatch(callGetWordsAPI(difficulty, count));
    }, [difficulty]);

    // const {words} = useSelector(state => state.GameReducer);

    const words = [
        {
            wordDes: 1,
            wordNo:2,
            wordName: "바나나"
        },
        {
            wordDes: 2,
            wordNo:3,
            wordName: "사과"
        }
    ]

    const questionArr = words.map(word => word.wordDes);    // 단어의 식별 번호 리스트
    const posesPerQuestion = words.map(word => word.wordNo); // 단어의 포즈의 갯수 리스트
    const questions = words.map(word => word.wordName);     // 단어의 이름 리스트

    return (
        <>
            <HandDetection
                difficulty={difficulty}
                totalQuestions={count}
                questionArr={questionArr}
                posesPerQuestion={posesPerQuestion}
                questions={questions}
            />
        </>
    )
}

export default GamePage;