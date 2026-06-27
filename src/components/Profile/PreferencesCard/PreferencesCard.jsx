
import "./PreferencesCard.css";
import {useState} from "react";

function PreferencesCard(){

const[sms,setSms]=useState(false);

const[app,setApp]=useState(true);

return(

<div className="preferences-card">

<h2>

التفضيلات

</h2>

<label>

لغة الواجهة

</label>

<select>

<option>

العربية

</option>

<option>

English

</option>

</select>

<div className="check">

<input

type="checkbox"

checked={sms}

onChange={()=>setSms(!sms)}

/>

رسائل SMS

</div>

<div className="check">

<input

type="checkbox"

checked={app}

onChange={()=>setApp(!app)}

/>

إشعارات التطبيق

</div>

</div>

)

}

export default PreferencesCard;
