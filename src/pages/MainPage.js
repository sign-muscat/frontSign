import { Link } from 'react-router-dom';
import SorisonQuiz from "./MainBody";

function MainPage() {
  return (
    <div>
        <SorisonQuiz></SorisonQuiz>
        <Link to="/hand-detection">Hand Detection으로 이동</Link>
        <Link to="/finish">결과 보기</Link>
    </div>
  );
}

export default MainPage;