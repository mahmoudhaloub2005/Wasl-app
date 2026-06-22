import "./DashboardNavbar.css";

function DashboardNavbar() {
    return (
        <header className="dashboard-navbar">

            <div className="logo">
                وصل
            </div>

            <nav className="nav-links">
                <a href="#">الرئيسية</a>
                <a href="#">المولدات</a>
                <a href="#">الاشتراكات</a>
                <a href="#">الفواتير والمدفوعات</a>
                <a href="#">التقييمات والشكاوى</a>
            </nav>

            <div className="nav-icons">

                <button className="icon-btn">
                    🔔
                </button>

                <button className="icon-btn">
                    ⚙️
                </button>

            </div>

        </header>
    );
}

export default DashboardNavbar;