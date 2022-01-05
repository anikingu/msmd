import * as React from 'react';

function DirectiveOption({ optionName, selectedOption, setSelectedOption }) {

    const handleClickOption = () => {
        setSelectedOption(optionName);
    };

    return (
        <div className={`directive-option ${selectedOption == optionName ? 'directive-option-selected' : ''}`} onClick={handleClickOption}>
            {optionName}
        </div>
    );
};

export default DirectiveOption