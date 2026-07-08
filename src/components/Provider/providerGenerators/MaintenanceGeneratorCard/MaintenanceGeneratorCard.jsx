import "./MaintenanceGeneratorCard.css";

function MaintenanceGeneratorCard(){

return(

<div className="maintenance-card">

<div className="maintenance-image">

<img

src="/images/generator2.jpg"

alt="generator"

/>

<span className="repair">

قيد الإصلاح

</span>

</div>

<div className="maintenance-content">

<h2>

مولد المنطقة الصناعية (S-40)

</h2>

<p>

القدرة : 400 KVA

</p>

<p>

آخر صيانة منذ 12 يوم

</p>

<h4>

سبب العطل

</h4>

<p>

عطل في المضخة الرئيسية والقطع المطلوبة قيد الشحن.

</p>

</div>

</div>

);

}

export default MaintenanceGeneratorCard;
