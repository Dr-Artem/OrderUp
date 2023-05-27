import { useCallback, useMemo } from 'react';
import style from './GoogleMap.module.css';

const Map = ({ isLoaded, mapRef, Marker, GoogleMap, DirectionsRenderer, directions, selected }) => {
    // eslint-disable-next-line
    const onLoad = useCallback(map => (mapRef.current = map), []);
    const center = useMemo(() => ({ lat: 40.735582, lng: -73.992571 }), []);
    const options = useMemo(
        () => ({
            disableDefaultUI: true,
            clickableIcons: false,
            zoomControl: true,
            streetViewControl: false,
        }),
        []
    );
    return (
        <div className={style.mapContainer}>
            {!isLoaded ? (
                <div>Loading</div>
            ) : (
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={12}
                    options={options}
                    // eslint-disable-next-line no-undef
                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                    onLoad={onLoad}
                >
                    {directions && <DirectionsRenderer directions={directions} />}
                    {selected && <Marker position={selected} />}
                </GoogleMap>
            )}
        </div>
    );
};
export default Map;
