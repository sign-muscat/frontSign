import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <Link to="/hand-detection">Hand Detection으로 이동</Link>
    </div>
  );
}

export default MainPage;
