/*
    Script should do the following: 
    - Keep track of meta data (see Script spec)
        * starting-url should be a requirement for instantiation
        * autogenerate temp-title, and uuid
        * config can be optional, but for the time being won't have an implementation
    - Should have handles for getting and setting title and description 
    - Should have a handle for easily adding steps of different types
    - Should have a handle for saving the script to disk in a format detailed by the spec

    There should also be an enum for Step types contained in the module
*/
const path = require('path');
const fs = require('fs');


const ScriptBuilder = (starting_url, config = {}) => {
    if(starting_url === null) {
        throw new Error("Starting url required to instantiate script builder");
    }
    
    console.log("Initializing new script builder")
    const uuid = 'testScript';
    let title = uuid;
    let description = '';
    let steps = [];

    const setTitle = (newTitle) => {
        title = newTitle;
    }
    
    const getTitle = () => {
        return title;
    }

    const setDescription = (newDescription) => {
        description = newDescription;
    }

    const getDescription = () => {
        return description;
    }
    
    const addStep = (type, target, action, input) => {
        // Verify that the type is a valid enum
        if(!Object.values(StepType).includes(type)) {
            throw Error(`Step type ${type} is invalid. Step not added.`);
        }
        const newStep = {
            type: type,
            target: target,
            action: action, 
            input: input
        };
        steps = [...steps, newStep];
    }

    const generateSignature = () => {
        signature = 'signature';
    }

    const save = () => {
        const script = JSON.stringify({
            title: title,
            description: description,
            starting_url: starting_url,
            config: config,
            steps: steps,
            uuid: uuid,
            signature: generateSignature()
        });
        const scriptPath = path.join(__dirname, `../../data/${title}.json`);
        console.log(`Attempting to write file: ${scriptPath}`);
        fs.writeFile(scriptPath, script, (err) => {
            if (err) throw err;
            console.log(`${scriptPath} written successfully!`);
        });
    }

    return {
        setTitle: setTitle,
        getTitle: getTitle,
        setDescription: setDescription,
        getDescription: getDescription,
        addStep: addStep,
        save: save
    }
}

const StepType = {
    INTERACT: 'interact',
    VERIFY: 'verify',
    CUSTOM: 'custom'
}

module.exports = {
    ScriptBuilder,
    StepType
};