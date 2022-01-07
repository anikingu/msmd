import * as React from 'react';
import DirectiveOption from './directive-option';

function WaitType({currentSubtype, setCurrentSubtype, setSubtypeDetails}) {

    const subtypes = ["WAIT UNTIL", "WAIT INTERVAL"];
    React.useEffect(() => {
        setCurrentSubtype("WAIT UNTIL");
    }, [])

    const WaitDetailResolver = {
        "WAIT UNTIL": <NotYetImplemented />,
        "WAIT INTERVAL": <NotYetImplemented />
    }

    const [SubtypeDetail, setSubtypeDetail] = React.useState(WaitDetailResolver[currentSubtype]);

    React.useEffect(() => {
        setSubtypeDetail(WaitDetailResolver[currentSubtype]);
    }, [currentSubtype])

    return (
        <div id='directive-subtype-section'>
            <div id='directive-subtypes'>
                {subtypes.map((subtypeName, i) => (
                    <DirectiveOption
                        key={i}
                        optionName={subtypeName}
                        selectedOption={currentSubtype}
                        setSelectedOption={setCurrentSubtype}
                    />
                ))}
            </div>
            <div id='directive-details'>
                {SubtypeDetail ?? ""}
            </div>
        </div>
    );
};

const NotYetImplemented = () => {
    return (
        <div>
            {"Not yet implemented"}
        </div>
    )
}

export default WaitType;