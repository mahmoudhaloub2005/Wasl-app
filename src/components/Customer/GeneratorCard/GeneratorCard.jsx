import "./GeneratorCard.css";

function GeneratorCard({
    image,
    name,
    location,
    price,
    capacity,
    status,
}) {
    return (
        <div className="generator-card">

            <div className="generator-image">

                <img
                    src={image}
                    alt={name}
                />

                <span
                    className={
                        status === "يعمل الآن"
                            ? "status working"
                            : "status maintenance"
                    }
                >
                    {status}
                </span>

            </div>

            <div className="generator-content">

                <h2>{name}</h2>

                <p>{location}</p>

                <div className="generator-info">

                    <div>
                        <span>السعر لكل أمبير</span>
                        <h4>{price}</h4>
                    </div>

                    <div>
                        <span>الحمل المتاح</span>
                        <h4>{capacity}</h4>
                    </div>

                </div>

                <div className="generator-footer">

                    <div className="stars">
                        ⭐⭐⭐⭐⭐
                    </div>

                    <button>
                        عرض التفاصيل
                    </button>

                </div>

            </div>

        </div>
    );
}

export default GeneratorCard;

