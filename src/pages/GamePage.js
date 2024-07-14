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
    const count = 5;

    useEffect(() => {
        // 처음 게임 시작할 때 난이도, 문제 수를 전달해 문제 출제 받아옴
        dispatch(callGetWordsAPI(difficulty, count));
    }, [difficulty]);

    // const {words} = useSelector(state => state.GameReducer);

    const words = [
        {
            wordDes: 1,
            wordNo:2,
            wordName: "무지개"
        },
        {
            wordDes: 2,
            wordNo:2,
            wordName: "키"
        },
        {
            wordDes: 5,
            wordNo:4,
            wordName: "소방서"
        },
        {
            wordDes: 4,
            wordNo:3,
            wordName: "빵집"
        },
        {
            wordDes: 3,
            wordNo:1,
            wordName: "너"
        },
    ]

    const questionArr = words.map(word => word.wordDes);
    const posesPerQuestion = words.map(word => word.wordNo); // 각 질문당 포즈의 갯수
    const questions = words.map(word => word.wordName);

    return (
        <>
            <HandDetection
                totalQuestions={count}
                questionArr={questionArr}
                posesPerQuestion={posesPerQuestion}
                questions={questions}
                //difficulty //테스트를 위해 난이도 전달
            />
        </>
    )
}

export default GamePage;