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
const { ipcMain, BrowserWindow } = require('electron');
const { InteractionAction } = require('util/step-type.js');


const ScriptBuilder = (starting_url, window) => {
    if(starting_url === null) {
        throw new Error("Starting url required to instantiate script builder");
    }

    if(window === null) {
        throw new Error("Window is required to instantiate script builder");
    }
    
    console.log("Initializing new script builder")
    const uuid = 'testScript';
    let steps = [];

    const resolveDescription = (interaction, directive) => {
        console.log(`Resolving description for interaction ${JSON.stringify(interaction)}, directive ${JSON.stringify(directive)}`);
        let interactionDescription;
        if(interaction) {
            switch (interaction.action){
                case InteractionAction.CLICK:
                    interactionDescription = `${interaction.action}ed ${interaction.target.relative_xpath}`;
                    break;
                case InteractionAction.CHANGE:
                    interactionDescription = `${interaction.action}d ${interaction.target.relative_xpath} to '${interaction.target.value}'`
                    break;
            }
        }
        return interactionDescription ?? `Generic step`;
    }
    
    const addStep = (interaction, directive) => {
        const newStep = {
            interaction: interaction,
            directive: directive,
            description: resolveDescription(interaction, directive)
        };
        steps = [...steps, newStep];
        console.log("Sending steps: ")
        console.log(steps);
        window.webContents.send('steps-updated', steps);
    }

    const generateSignature = () => {
        signature = 'signature';
    }

    const save = ({title, description, config}) => {
        const script = {
            title: (title && title !== '') ? title : uuid,
            description: description || '',
            starting_url: starting_url,
            config: config || {},
            steps: steps,
            uuid: uuid,
            signature: generateSignature()
        }
        const scriptJSON = JSON.stringify(script);
        const scriptPath = path.join(__dirname, `../../../data/${script.title}.json`);
        console.log(`Attempting to write file: ${scriptPath}`);
        fs.writeFile(scriptPath, scriptJSON, (err) => {
            if (err) throw err;
            console.log(`${scriptPath} written successfully!`);
        });
    }

    return {
        addStep: addStep,
        save: save
    }
}

module.exports = {
    ScriptBuilder
};