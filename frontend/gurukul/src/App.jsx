import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/SignUpPage.jsx';
import Aboutus from './pages/AboutUs.jsx'
import ContaCtUs from './pages/ContactUS.jsx'
function App(){
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/aboutus' element={<Aboutus/>} />
        <Route path='/contactus' element={<ContaCtUs/>} />
      </Routes>
    </div>
  );
}
export default App;