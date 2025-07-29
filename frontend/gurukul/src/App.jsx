import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/SignUpPage.jsx';
function App(){
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignUp/>} />
      </Routes>
    </div>
  );
}
export default App;