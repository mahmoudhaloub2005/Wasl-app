
import "./GeneratorListItem.css";

function GeneratorListItem({generator}){

return(

<div className="generator-item">

<div className="generator-item-left">

<div className="generator-icon">

⚡

</div>

<div>

<h3>

{generator.name}

</h3>

<span>

المعرف : {generator.code}

</span>

</div>

</div>

<div className="generator-middle">

<p>

القدرة : {generator.capacity}

</p>

</div>

<div className="generator-right">

<span className="price">

{generator.price}

</span>

<span className="status">

{generator.status}

</span>

</div>

</div>

);

}

export default GeneratorListItem;