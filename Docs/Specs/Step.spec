Step := {
    interaction: (Interaction),
    directive: (Directive)
}

// A subtype of a step that represents user's interaction with the webpage
Interaction := {
    // The target of an INTERACT step. Includes several datapoints of the actual event target so that the element can be dynamically recognized as part of future functionalities
    target: (Interactable),
    //  The type of event associated with an INTERACT step
    action: (Enum(CLICK, INPUT, NAVIGATE)),
    // The input to be used in an INPUT or NAVIGATE type INTERACT step. May also be used to store commands for the VERIFY or CUSTOM steps. Optional
    input?: (string)
}

// A subtype of a step that represents an instruction given by the user
Directive := {
    // The type of directive to perform
    type: (Enum(VERIFY, WAIT, CUSTOM))
    // The subtype of the directive. Should be valid given the type of the directive
    //      VERIFY -> NAVIGATION, REQUEST, RESPONSE, API, DATABASE, DOM, DOWNLOAD
    //      WAIT -> WAIT_UNTIL, WAIT_INTERVAL
    subtype: (Enum(NAVIGATION, REQUEST, RESPONSE, API, DATABASE, DOM, DOWNLOAD, WAIT_UNTIL, WAIT_INTERVAL))
    // The data needed for the directive to be reproduced in the script runner
    detail: (KeyValueObject<field, fieldValue)
}