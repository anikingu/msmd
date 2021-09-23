Script := {
    // The name of the script. Can be named by the user or auto-generated. Editable
    title: (string),
    // Description of what this script shows. Can be empty or filled out by user. Editable 
    description: (string),
    // The entry point of the test script. Non-editable
    starting-url: (string),
    // The configuration used when creating the script. Non-editable
    config: {TBD...},
    // The steps that make up the script. Used to replay the script. Non-editable
    steps: [(Step), (Step), ...],
    // Unique identifier for the script. Can be used to identify the script when an error occurs during the test. May also be used to list and trigger specific tests.
    uuid: (string),
    // Used to verify the authenticity of the script. Full list of use cases and format of the signature are TBD
    signature: (string TBD)
}