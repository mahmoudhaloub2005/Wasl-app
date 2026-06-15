import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseAccount from "./pages/ChooseAccount";
import Logininf from "./pages/Logininfo";
// import ProviderSignup from "./pages/ProviderSignup";
import ForgotPassword from "./pages/ForgotPassword"
import OtpPage from "./pages/OtpPage"
// import ProviderInfo from "./pages/ProviderInfo"
import NewPassword from "./pages/NewPassword"
import ResetSuccess from "./pages/ResetSuccess"
import ProviderRegister from "./pages/ProviderRegister"
import ProviderGeneratorInfo from "./pages/ProviderGeneratorInfo"
import ProviderDocuments from "./pages/ProviderDocuments"
import ProviderPending from "./pages/ProviderPending"
import ProviderSuccess from "./pages/ProviderSuccess"
import ContactUs from "./pages/ContactUs"
function App() {
  return (
    <>
      <Home />
       <Login />
       <ChooseAccount />
      <Logininf />  
      {/* <ProviderSignup/> */}
      {/* <ProviderInfo/> */}
      <ForgotPassword/>
      <OtpPage/>
      <NewPassword/>
      <ResetSuccess/>
      <ProviderRegister/>
      <ProviderGeneratorInfo/>
      <ProviderDocuments/>
      <ProviderPending/>
      <ProviderSuccess/>
      <ContactUs/>
 </>

  );
}

export default App;