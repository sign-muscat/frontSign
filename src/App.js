import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.js';
import MainPage from './pages/MainPage.js';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout/>}>
        <Route index element={<MainPage/>}/>
      </Route>
    </Routes>
  );
}

export default App;
