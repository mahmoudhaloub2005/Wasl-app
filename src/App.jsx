import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseAccount from "./pages/ChooseAccount";
import Logininf from "./pages/Logininfo";
// import ProviderSignup from "./pages/ProviderSignup";
import ForgotPassword from "./pages/ForgotPassword"
import OtpPage from "./pages/OtpPage"
<<<<<<< HEAD
import PrivacyModal from "./pages/PrivacyModal";
import ServiceModal from "./pages/ServiceModal";
import ProviderPage from "./pages/ProviderPage";
import SupportPage from "./pages/Support";


=======
// import ProviderInfo from "./pages/ProviderInfo"
import NewPassword from "./pages/NewPassword"
import ResetSuccess from "./pages/ResetSuccess"
import ProviderRegister from "./pages/ProviderRegister"
import ProviderGeneratorInfo from "./pages/ProviderGeneratorInfo"
import ProviderDocuments from "./pages/ProviderDocuments"
import ProviderPending from "./pages/ProviderPending"
import ProviderSuccess from "./pages/ProviderSuccess"
import ContactUs from "./pages/ContactUs"
>>>>>>> 995b2049bd2b74d9e69454308e798354953430a7
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
<<<<<<< HEAD
      <PrivacyModal/>
      <ServiceModal/>
      <ProviderPage/>
      <SupportPage/>

     
=======
      <NewPassword/>
      <ResetSuccess/>
      <ProviderRegister/>
      <ProviderGeneratorInfo/>
      <ProviderDocuments/>
      <ProviderPending/>
      <ProviderSuccess/>
      <ContactUs/>
>>>>>>> 995b2049bd2b74d9e69454308e798354953430a7
 </>

  );
}

export default App;