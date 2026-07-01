import "./BillsInfo.css";

function BillsInfo() {
    return (
        <section className="bills-card">

            <h3>الفواتير المستحقة</h3>

            <div className="bill-item">
                <p>فاتورة يونيو 2024</p>
                <span>125 شيكل</span>
            </div>

            <div className="bill-item">
                <p>فاتورة مايو 2024</p>
                <span>150 شيكل</span>
            </div>

            <button>دفع الفاتورة المستحقة</button>

        </section>
    );
}

export default BillsInfo;