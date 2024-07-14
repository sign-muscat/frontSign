import HandDetection from "../HandDetection";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {callGetWordsAPI} from "../apis/GameAPICalls";
import {useDispatch, useSelector} from "react-redux";

function GamePage() {
    const dispatch = useDispatch();
    const location = useLocation();
    const difficulty = location.state;

    const {wordList} = useSelector(state => state.GameReducer);

    // Total number of Questions
    const count = 2;

    useEffect(() => {
        dispatch(callGetWordsAPI(difficulty, count));
    }, [difficulty, dispatch]);

    return (
        wordList && wordList.length > 0 &&
        <>
            <HandDetection
                difficulty={difficulty}
                totalQuestions={count}
                questionArr={wordList.map(word => word.wordDes)}   // 단어의 식별 번호 리스트
                posesPerQuestion={wordList.map(word => word.wordNo)} // 단어의 포즈의 갯수 리스트
                questions={wordList.map(word => word.wordName)}    // 단어의 이름 리스트
            />
        </>
    )
}

export default GamePage;