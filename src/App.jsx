import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseAccount from "./pages/ChooseAccount";
import Logininf from "./pages/Logininfo";
import ProviderSignup from "./pages/ProviderSignup";
import ForgotPassword from "./pages/ForgotPassword"
import OtpPage from "./pages/OtpPage"
import PrivacyModal from "./pages/PrivacyModal";
import ServiceModal from "./pages/ServiceModal";
import ProviderPage from "./pages/ProviderPage";
import SupportPage from "./pages/Support";


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
      <PrivacyModal/>
      <ServiceModal/>
      <ProviderPage/>
      <SupportPage/>

     
 </>

  );
}

export default App;