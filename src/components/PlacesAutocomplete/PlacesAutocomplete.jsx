import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import style from './PlacesAutocomplete.module.css';

const PlacesAutocomplete = ({ setSelected, setAddress, fetchDirection }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    const handleInput = e => {
        setValue(e.target.value);
    };

    const handleSelect =
        ({ description }) =>
        () => {
            setAddress(description);
            setValue(description, false);
            clearSuggestions();

            getGeocode({ address: description }).then(results => {
                const { lat, lng } = getLatLng(results[0]);
                setSelected({ lat, lng });
                fetchDirection({ lat, lng });
            });
        };

    const renderSuggestions = () =>
        data.map(suggestion => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li className={style.orderAdressItem} key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> - <small>{secondary_text}</small>
                </li>
            );
        });

    return (
        <div className={style.orderAdressContainer}>
            <input
                className={style.orderInputAdress}
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder="Your address"
            />
            {status === 'OK' && <ul className={style.orderAdressList}>{renderSuggestions()}</ul>}
        </div>
    );
};

export default PlacesAutocomplete;
