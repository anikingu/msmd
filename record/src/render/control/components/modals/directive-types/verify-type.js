import * as React from 'react';
import '../directive-modal.css';

const DirectiveOption = ({optionName, selectedOption, setSelectedOption}) => {

    const handleClickOption = () => {
        setSelectedOption(optionName);
    }

    return (
        <div className={`directive-option ${selectedOption == optionName ? 'directive-option-selected' : ''}`} onClick={handleClickOption}>
            {optionName}
        </div>
    );
}

function VerifyType() {
    const subtypes = ["NAVIGATION", "REQUEST", "RESPONSE", "API", "DATABASE", "DOM", "DOWNLOAD"];
    const [subtype, setSubtype] = React.useState("NAVIGATION");
    const [SubtypeDetails, setSubtypeDetails] = React.useState(VerifyDetailResolver[subtype]);
    
    React.useEffect(() => {
        setSubtypeDetails(VerifyDetailResolver[subtype]);
    }, [subtype])

    return (
        <div id='directive-subtype-div'>
            <div id='directive-subtype-section'>
                {subtypes.map((subtypeName, i) => (
                    <DirectiveOption 
                        key={i}
                        optionName={subtypeName}  
                        selectedOption={subtype}
                        setSelectedOption={setSubtype}
                    />
                ))}
            </div>
            <div id='directive-details'>
                {SubtypeDetails ?? ""}
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