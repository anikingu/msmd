var Button = (function(id, value) {
    return {
        id: id,
        value: value
    }
});

const PopupButtons = {
    START_NEW_RECORDING: new Button("startNewRecording", "Start New Recording"),
    SHOW_CURRENT_RECORDING: new Button("showCurrentRecording", "Show Current Recording"),
    SHOW_ALL_RECORDINGS: new Button("showAllRecordings", "Show All Recordings")
}