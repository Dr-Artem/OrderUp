const Distance = ({ leg }) => {
    const distance = leg.distance.text;
    const duration = leg.duration.text;
    return (
        <div>
            <p>Distance: {distance}</p>
            <p>Delivery time: {duration}</p>
        </div>
    );
};

export default Distance;
