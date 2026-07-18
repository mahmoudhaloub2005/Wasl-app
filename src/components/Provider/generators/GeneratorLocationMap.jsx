import { useEffect, useMemo, useRef, useState } from "react";
import { FiCrosshair, FiMap, FiMapPin } from "react-icons/fi";

const DEFAULT_CENTER = {
  lat: 31.9522,
  lng: 35.2332,
};

const MAP_SPAN = {
  lat: 0.12,
  lng: 0.16,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function coordinatesToPosition(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const x =
    ((longitude - (DEFAULT_CENTER.lng - MAP_SPAN.lng / 2)) / MAP_SPAN.lng) *
    100;
  const y =
    ((DEFAULT_CENTER.lat + MAP_SPAN.lat / 2 - latitude) / MAP_SPAN.lat) * 100;

  return {
    x: clamp(x, 6, 94),
    y: clamp(y, 8, 92),
  };
}

function positionToCoordinates(x, y) {
  const longitude = DEFAULT_CENTER.lng - MAP_SPAN.lng / 2 + (x / 100) * MAP_SPAN.lng;
  const latitude = DEFAULT_CENTER.lat + MAP_SPAN.lat / 2 - (y / 100) * MAP_SPAN.lat;

  return {
    latitude: Number(latitude.toFixed(6)),
    longitude: Number(longitude.toFixed(6)),
  };
}

function GeneratorLocationMap({
  latitude,
  locationName,
  longitude,
  onLocationChange,
}) {
  const mapRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapError, setMapError] = useState("");
  const [geolocationError, setGeolocationError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsMapLoading(false);
    }, 360);

    return () => window.clearTimeout(timer);
  }, []);

  const markerPosition = useMemo(
    () => coordinatesToPosition(Number(latitude), Number(longitude)),
    [latitude, longitude]
  );

  function updateLocationFromPointer(event) {
    const bounds = mapRef.current?.getBoundingClientRect();

    if (!bounds) {
      setMapError("تعذر تحميل الخريطة، يمكنك إدخال الموقع يدوياً.");
      return;
    }

    const x = clamp(((event.clientX - bounds.left) / bounds.width) * 100, 4, 96);
    const y = clamp(((event.clientY - bounds.top) / bounds.height) * 100, 6, 94);
    const nextCoordinates = positionToCoordinates(x, y);

    onLocationChange({
      ...nextCoordinates,
      locationName: locationName || "موقع محدد على الخريطة",
    });
    setMapError("");
  }

  function handleMapClick(event) {
    if (isMapLoading || event.target.closest("button")) return;

    updateLocationFromPointer(event);
  }

  function handleMarkerPointerDown(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    updateLocationFromPointer(event);
  }

  function handlePointerEnd() {
    setIsDragging(false);
  }

  function handleUseCurrentLocation(event) {
    event.stopPropagation();
    setGeolocationError("");

    if (!navigator.geolocation) {
      setGeolocationError(
        "تعذر الوصول إلى موقعك الحالي. يرجى السماح بالوصول إلى الموقع أو تحديده يدوياً."
      );
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          locationName: locationName || "موقعي الحالي",
        });
        setIsLocating(false);
      },
      () => {
        setGeolocationError(
          "تعذر الوصول إلى موقعك الحالي. يرجى السماح بالوصول إلى الموقع أو تحديده يدوياً."
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 8000,
      }
    );
  }

  return (
    <section className="add-generator-map-card">
      <header>
        <div>
          <FiMap aria-hidden="true" />
          <h3>الخريطة</h3>
        </div>
        <p>حدد موقع المولد بدقة على الخريطة</p>
      </header>

      <div
        className={`add-generator-map ${isDragging ? "is-dragging" : ""}`}
        ref={mapRef}
        role="application"
        aria-label="خريطة تحديد موقع المولد"
        onClick={handleMapClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      >
        {isMapLoading ? (
          <div className="add-generator-map__loading">
            جارٍ تحميل الخريطة...
          </div>
        ) : (
          <>
            <span className="add-generator-map__road add-generator-map__road--one" />
            <span className="add-generator-map__road add-generator-map__road--two" />
            <span className="add-generator-map__road add-generator-map__road--three" />
            <span className="add-generator-map__district add-generator-map__district--one">
              الحي الشمالي
            </span>
            <span className="add-generator-map__district add-generator-map__district--two">
              السوق
            </span>
            <span className="add-generator-map__district add-generator-map__district--three">
              المركز
            </span>

            {markerPosition && (
              <button
                type="button"
                className="add-generator-map__marker"
                style={{
                  left: `${markerPosition.x}%`,
                  top: `${markerPosition.y}%`,
                }}
                onPointerDown={handleMarkerPointerDown}
                aria-label="موقع المولد المحدد"
              >
                <FiMapPin aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              className="add-generator-map__locate"
              onClick={handleUseCurrentLocation}
              aria-label="استخدام موقعي الحالي"
              disabled={isLocating}
            >
              <FiCrosshair aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {markerPosition && (
        <output className="add-generator-map__selection">
          الإحداثيات المحددة:{" "}
          <bdi>
            {Number(latitude).toFixed(5)}, {Number(longitude).toFixed(5)}
          </bdi>
        </output>
      )}

      {mapError && <p className="add-generator-map__error">{mapError}</p>}
      {geolocationError && (
        <p className="add-generator-map__error">{geolocationError}</p>
      )}
    </section>
  );
}

export default GeneratorLocationMap;
