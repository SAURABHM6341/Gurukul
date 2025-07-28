import './App.css'
import Header from './components/header/header.jsx'
import Login from './components/loginPage/login.jsx'
import Signup from './components/signupPage/signup.jsx'
import EnterNewPassword from './components/enternewPassword/enterNewPass.jsx'
import ResendMail from './components/resendMail/ResendMail.jsx'
import ResetPassword from './components/resetPass/resetPass.jsx'
import ResetComplete from './components/confirmationreset/resetConfirmation.jsx'
import VerifyEmail from './components/otpverification/otpVerification.jsx'
import HeroSection from './components/HomePage/Homwpage.jsx'
import BecomeInstructor from './components/becomeInstructor/becomeInstructor.jsx'
import LanguageProgress from './components/swiss/swiss.jsx'
import JobSkills from './components/jobSkills/JobSkills.jsx'
import ReviewHome from './components/reviewshome/review.jsx'
function App() {
  return (
    <>
      <Header/>
      {/* <Login/>
      <Signup/>
      <ResetPassword/>
      <ResendMail/>
      <EnterNewPassword/>
      <ResetComplete/>
      <VerifyEmail/> */}
      <HeroSection/>
      <LanguageProgress/>
      <JobSkills/>
      <BecomeInstructor/>
      <ReviewHome/>

    </>
  )
}

export default App
