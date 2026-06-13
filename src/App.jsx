import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseAccount from "./pages/ChooseAccount";
import Logininf from "./pages/Logininfo";
import ProviderSignup from "./pages/ProviderSignup";
import ForgotPassword from "./pages/ForgotPassword"
import OtpPage from "./pages/OtpPage"

function App() {
  return (
    <>
      <Home />
       <Login />
       <ChooseAccount />
      <Logininf />  
      <ProviderSignup/>
      <ForgotPassword/>
      <OtpPage/>

 </>

  );
}

export default App;