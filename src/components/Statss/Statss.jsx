import "./Stats.css";

function Stats() {
    return (
        <section className="stats">

            <div className="stat-card">

                <div className="stat-icon">
                    ✔
                </div>

                <div className="stat-info">
                    <p>الفواتير المدفوعة</p>
                    <span>12</span>
                </div>

            </div>

            <div className="stat-card">

                <div className="stat-icon">
                    🔔
                </div>

                <div className="stat-info">
                    <p>إشعارات جديدة</p>
                    <span>3</span>
                </div>

            </div>

            <div className="stat-card">

                <div className="stat-icon">
                    🎧
                </div>

                <div className="stat-info">
                    <p>شكاوى مفتوحة</p>
                    <span>1</span>
                </div>

            </div>

        </section>
    );
}

export default Stats;