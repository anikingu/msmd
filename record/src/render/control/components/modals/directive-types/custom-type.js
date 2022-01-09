import * as React from 'react';

function CustomType({setCurrentSubtype, setSubtypeDetails}) {
    React.useEffect(() => {
        setCurrentSubtype(undefined);
    }, []);

    return (
        <div id='directive-subtype-section'>
            <div id='directive-details-section'>
                Not yet implemented
            </div>
        </div>
    );
};

export default CustomType;