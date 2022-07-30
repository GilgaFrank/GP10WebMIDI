// STATUS BYTES
//Three-byte messages
const PROGRAM_CHANGE = 0xc0;
const CONTROL_CHANGE = 0xb0;
const NOTE_OFF = 0x80;
const NOTE_ON = 0x90;
const POLY_AFTERTOUCH = 0xa0;

//Two-byte messages
const CHANNEL_AFTERTOUCH = 0xd0;
const PITCH_BEND = 0xe0;

//One-byte messages
const CLOCK_PULSE = 0xf8;
const CLOCK_START = 0xfa;
const CLOCK_CONTINUE = 0xfb;
const CLOCK_STOP = 0xfc;
const SYSEX_START = 0xf0;

/*
//No longer used!

const TWO_BYTE_MESSAGES = new Array(CHANNEL_AFTERTOUCH, PITCH_BEND);
const THREE_BYTE_MESSAGES = new Array(PROGRAM_CHANGE, CONTROL_CHANGE, NOTE_OFF, NOTE_ON, POLY_AFTERTOUCH);

const TWO_BYTE_MESSAGE_TYPES = {"Channel aftertouch" : CHANNEL_AFTERTOUCH, 
                "Pitch bend" : PITCH_BEND};


const THREE_BYTE_MESSAGE_TYPES = {"Program change" : PROGRAM_CHANGE, 
            "Control change" : CONTROL_CHANGE,
            "Note on" : NOTE_ON,
            "Note off" : NOTE_OFF,
            "Poly aftertouch" : POLY_AFTERTOUCH};

*/

var messageTypes = [
    {msgType: "Program change", statusByte : PROGRAM_CHANGE, byteLength: 3},
    {msgType: "Control change", statusByte : CONTROL_CHANGE, byteLength: 3},
    {msgType: "Note off", statusByte : NOTE_OFF, byteLength: 3},
    {msgType: "Note on", statusByte : NOTE_ON, byteLength: 3},
    {msgType: "Poly aftertouch", statusByte : POLY_AFTERTOUCH, byteLength: 3},
    {msgType: "Channel aftertouch", statusByte : CHANNEL_AFTERTOUCH, byteLength: 2},
    {msgType: "Pitch bend", statusByte : PITCH_BEND, byteLength: 2}
];

function filterMessages(typeQuery) {
    return messageTypes.filter(function(el) {
        return el.statusByte == typeQuery;
      });
}

export function findMessageType(message) {
    
    var midiStatus = message[0] & 0xf0;
    var midiChannel = message[0] & 0x0f;
    
    //find match for message!
    var matchingMessages =  filterMessages(midiStatus);
    console.log("MATCHES " + matchingMessages.length);
    /*
    TODO: Extract channel and data here and add properties to matchingMessages
    */
    matchingMessages[0].channel = midiChannel;

    var byte1 = null;
    var byte2 = null;

    try {
        byte1 = message[1];
        console.log("MATCH message: " + message);
        console.log("MATCH length: " + matchingMessages.length + " MATCH byte1: " + byte1);
        
        try {
            byte2 = message[2];
            console.log("MATCH byte2: " + byte2);
        }
        catch (err) {

        }
    }
    catch (err) {

    }

    return matchingMessages[0];
}


export {
    PROGRAM_CHANGE,
    CONTROL_CHANGE,
    NOTE_OFF,
    NOTE_ON,
    POLY_AFTERTOUCH,
    CHANNEL_AFTERTOUCH,
    PITCH_BEND,
    CLOCK_PULSE,
    CLOCK_START,
    CLOCK_CONTINUE,
    CLOCK_STOP
}