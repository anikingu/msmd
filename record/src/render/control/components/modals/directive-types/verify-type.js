import * as React from 'react';
import '../directive-modal.css';

import DirectiveOption from './directive-option';

function VerifyType() {
    const subtypes = ["NAVIGATION", "REQUEST", "RESPONSE", "API", "DATABASE", "DOM", "DOWNLOAD"];
    const [currentSubtype, setCurrentSubtype] = React.useState("NAVIGATION");
    const [SubtypeDetail, setSubtypeDetail] = React.useState(VerifyDetailResolver[currentSubtype]);
    
    React.useEffect(() => {
        setSubtypeDetail(VerifyDetailResolver[currentSubtype]);
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

const NavigationDetail = () => {
    return (
        <div>
            {"Not yet implemented"}
        </div>
    )
}

const NotYetImplemented = () => {
    return (
        <div>
            {"Not yet implemented"}
        </div>
    )
}

const VerifyDetailResolver = {
    "NAVIGATION": <NavigationDetail />,
    "REQUEST": <NotYetImplemented />,
    "RESPONSE": <NotYetImplemented />,
    "API": <NotYetImplemented />,
    "DATABASE": <NotYetImplemented />,
    "DOM": <NotYetImplemented />,
    "DOWNLOAD": <NotYetImplemented />
}

export default VerifyType;