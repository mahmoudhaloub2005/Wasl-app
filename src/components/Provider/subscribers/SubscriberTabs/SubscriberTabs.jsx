import "./SubscriberTabs.css";

function SubscriberTabs({ activeTab, setActiveTab }) {

  return (

    <div className="subscriber-tabs">

      <div>

        <h2>إدارة المشتركين</h2>

      </div>

      <div className="tabs">

        <button

          className={activeTab === "pending" ? "active" : ""}

          onClick={() => setActiveTab("pending")}

        >

          طلب جديد

        </button>

        <button

          className={activeTab === "current" ? "active" : ""}

          onClick={() => setActiveTab("current")}

        >

          المشتركون الحاليون

        </button>

      </div>

    </div>

  );

}

export default SubscriberTabs;
