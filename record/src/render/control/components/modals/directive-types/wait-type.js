import * as React from 'react';

function WaitType() {
    const subtypes = ["WAIT UNTIL", "WAIT INTERVAL"];

    return (
        <div id='directive-subtype-div'>
            <div id='directive-subtype-section'>
                <ol>
                    {subtypes.map((subtype, i) => (
                        <li key={i}>{subtype}</li>
                    ))}
                </ol>
            </div>
            <div id='directive-details'>

            </div>
        </div>
    );
};

export default WaitType;