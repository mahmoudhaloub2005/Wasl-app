import ProviderNavbar from "../ProviderNavbar/ProviderNavbar";
import Footer from "../../layout/Footer/Footer";

function ProviderFinanceLayout({ children }) {
  return (
    <div className="provider-finance-page" dir="rtl">
      <ProviderNavbar />
      <main className="provider-finance">{children}</main>
      <Footer />
    </div>
  );
}

export default ProviderFinanceLayout;
