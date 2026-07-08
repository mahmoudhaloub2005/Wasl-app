import { useState } from "react";

import DashboardNavbar from "../components/layout/Navbar/providerNavbar";
import Footer from "../components/layout/Footer/Footer";

import SubscriberTabs from "../components/Provider/subscribers/SubscriberTabs";
import PendingSubscribers from "../components/Provider/subscribers/PendingSubscribers";
import CurrentSubscribers from "../components/Provider/subscribers/CurrentSubscribers";

import "../components/Provider/subscribers/SubscribersLayout.css";

function SubscribersPage() {

  const [activeTab, setActiveTab] = useState("pending");

  return (
    <>

      <providerNavbar />

      <div className="subscribers-page">

        <SubscriberTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {
          activeTab === "pending"
            ? <PendingSubscribers />
            : <CurrentSubscribers />
        }

      </div>

      <Footer />

    </>
  );
}

export default SubscribersPage;


