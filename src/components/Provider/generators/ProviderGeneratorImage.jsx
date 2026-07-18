import { FiZap } from "react-icons/fi";

function ProviderGeneratorImage({ imageUrl, name }) {
  if (imageUrl) {
    return (
      <img
        className="provider-generator-image"
        src={imageUrl}
        alt={name}
        loading="lazy"
      />
    );
  }

  return (
    <div className="provider-generator-image provider-generator-image--empty">
      <FiZap aria-hidden="true" />
    </div>
  );
}

export default ProviderGeneratorImage;
