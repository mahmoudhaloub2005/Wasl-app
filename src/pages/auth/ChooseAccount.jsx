import Navbar from "../../components/layout/Navbar/Navbar";
import ChooseAccount from "../../components/auth/ChooseAccount/ChooseAccount";
import Footer from "../../components/layout/Footer/Footer";

function Login() {
  return (
    <>
      <Navbar />
      <ChooseAccount />
      <Footer />
    </>
  );
}

export default Login;