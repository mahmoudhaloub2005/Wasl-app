import "./GeneratorSettingsCard.css";

function GeneratorSettingsCard() {

  return (

    <div className="generator-settings">

      <label>

        سعر الأمبير لهذا المولد

      </label>

      <input

        type="number"

        defaultValue="60"

      />

      <button>

        حفظ التعديلات

      </button>

    </div>

  );

}

export default GeneratorSettingsCard;

