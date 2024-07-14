import HandDetection from "../HandDetection";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {callGetWordsAPI} from "../apis/GameAPICalls";
import {useDispatch, useSelector} from "react-redux";

function GamePage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const difficulty = location.state;

    const {words} = useSelector(state => state.GameReducer);

    // Total number of Questions
    const count = 2;

    useEffect(() => {
        dispatch(callGetWordsAPI(difficulty, count));
    }, [difficulty, dispatch]);


    return (
        words &&
        <>
            <HandDetection
                difficulty={difficulty}
                totalQuestions={count}
                questionArr={words.map(word => word.wordDes)}   // 단어의 식별 번호 리스트
                posesPerQuestion={words.map(word => word.wordNo)} // 단어의 포즈의 갯수 리스트
                questions={words.map(word => word.wordName)}    // 단어의 이름 리스트
            />
        </>
    )
}

export default GamePage;