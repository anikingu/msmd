Step := {
    // What type of step is being described. 
    //      INTERACT -  A user's interaction with the webpage
    //      VERIFY - Verify the state of the webpage 
    //      CUSTOM - Custom javascript command(s) to run when the 
    type: (Enum(INTERACT, VERIFY, CUSTOM)),
    // The target of an INTERACT step. Includes several datapoints of the actual event target so that the element can be dynamically recognized as part of future functionalities
    target: (Interactable),
    //  The type of event associated with an INTERACT step
    action: (Enum(CLICK, INPUT, NAVIGATE)),
    // The input to be used in an INPUT or NAVIGATE type INTERACT step. May also be used to store commands for the VERIFY or CUSTOM steps. Optional
    input?: (string)
}