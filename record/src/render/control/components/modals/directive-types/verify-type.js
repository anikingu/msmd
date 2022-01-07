import * as React from 'react';
import '../directive-modal.css';

import DirectiveOption from './directive-option';

const VerifyType = ({currentSubtype, setCurrentSubtype, setSubtypeDetails, setDetailsCallback}) => {
    const subtypes = ["NAVIGATION", "REQUEST", "RESPONSE", "API", "DATABASE", "DOM", "DOWNLOAD"];
    React.useEffect(() => {
        setCurrentSubtype("NAVIGATION");
    }, [])

    const detailProps = {
        setSubtypeDetails: setSubtypeDetails,
        setDetailsCallback: setDetailsCallback
    }
    const VerifyDetailResolver = {
        "NAVIGATION": <NavigationDetail {...detailProps} />,
        "REQUEST": <NotYetImplemented />,
        "RESPONSE": <NotYetImplemented />,
        "API": <NotYetImplemented />,
        "DATABASE": <NotYetImplemented />,
        "DOM": <NotYetImplemented />,
        "DOWNLOAD": <NotYetImplemented />
    }
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

const NavigationDetail = ({setSubtypeDetails, setDetailsCallback}, ) => {

    let navigationUrl;
    React.useEffect(() => {
        navigationUrl = document.getElementById('navigation-url');
        setDetailsCallback({clearFields: clearFields});
    }, []);

    const updateNavigationDetails = () => {
        const navigationDetails = {
            navigationUrl:  navigationUrl.value
        }
        setSubtypeDetails(navigationDetails);
    }

    const clearFields = () => {
        navigationUrl.value = "";
    }

    return (
        <div>
            <div className='subtype-description'>
                Verify that the page navigated to a specified url.
            </div>
            <div className='modal-field'>
                <label htmlFor='navigation-url'>Verify Url</label>
                <input type='text' id='navigation-url' placeholder='https://www.example.com' onChange={updateNavigationDetails}/>
            </div>
        </div>
    )
}

const RequestDetail = ({setSubtypeDetails}) => {
    let navigationUrl;
    React.useEffect(() => {
        navigationUrl = document.getElementById('navigation-url');
    }, [])

    const updateNavigationDetails = () => {
        const navigationDetails = {
            navigationUrl:  navigationUrl.value
        }
        setSubtypeDetails(navigationDetails);
    }

    return (
        <div>
            <div className='subtype-description'>
                Verify that the page navigated to a specified url.
            </div>
            <div className='modal-field'>
                <label htmlFor='navigation-url'>Verify Url</label>
                <input type='text' id='navigation-url' placeholder='https://www.example.com' onChange={updateNavigationDetails}/>
            </div>
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

export default VerifyType;