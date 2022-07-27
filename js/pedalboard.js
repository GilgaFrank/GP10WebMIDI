/*
MODULE IMPORTS
*/
import * as MIDIStatus from "./MIDIStatuses.js";
import {getJSONResponse} from "./JSON.js";


var globalMIDIAccess;

var GP10Name = "GP-10 MIDI 1";
var RC500Name = "BOSS_RC-500 MIDI 1";
var TimeFactorName = "TimeFactor Pedal MIDI 1";
var PitchFactorName = "PitchFactor Pedal MIDI 1";
var SpaceName = "Space Pedal MIDI 1";

var InputFromGP10 = null;
var InputFromRC500 = null;

var OutputToRC500 = null;
var OutputToTimeFactor = null;
var OutputToPitchFactor = null;
var OutputToSpace = null;

var preGP10Debug;
var preRC500Debug;
var msgDebug;

var RC500MessageCount = 0;
var GP10MessageCount = 0;


function numberToHex(num) {
    return num.toString(16);
}

function decipherMessage(message, sourceName) {
    var midiChannel;
    msgDebug.innerHTML = message.length;
    var midiStatus = message[0];
    console.log("::decipherMessage from " + sourceName + " ::");
    console.log("decipherMessage: " + midiStatus + " LEN: " + message.length);

    var midiCommand = numberToHex(midiStatus & 0xF0); // mask off all but top 4 bits

    if (message.length > 1) {        
        midiChannel = midiStatus & 0x0F;        
        console.log("decipherMessage CH: " + numberToHex(midiChannel) + " STAT: 0x" + numberToHex(midiStatus) + " (" + midiStatus.toString() + ") CMD: " + midiCommand);
    } else {
        for (var midiByteNum=0;midiByteNum<message.length;midiByteNum++) {
            var midiByte = message[midiByteNum];
            console.log(midiByte + ": " + numberToHex(midiByte));
        }
    }
    if (message.length==2) {
        console.log("decipherMessage: byte1 " + message[1]);
    }
    if (message.length==3) {
        console.log("decipherMessage: byte1 " + message[1] + " byte2 " + message[2] );
    }
    
    var midiCommmandHEX = numberToHex(parseInt("0x" + midiCommand))
    
    if (parseInt(midiCommmandHEX, 16) == MIDIStatus.PROGRAM_CHANGE && sourceName == "GP10") {        
        getJSONResponse(10);
        //alert("GET JSON " + midiCommmandHEX);
        OutputToPitchFactor.send(message);
        OutputToTimeFactor.send(message);
        OutputToSpace.send(message);
        OutputToRC500.send(message);
    }

}


function showGP10Message(debugMessage) {
    console.log("showGP10Message: " + debugMessage);
    preGP10Debug.innerHTML += GP10MessageCount + " GP: " + debugMessage + "<br />";
    GP10MessageCount++;
    if (GP10MessageCount > 20) {
        preGP10Debug.innerHTML = "";
        GP10MessageCount = 0;
    }
}

function showRC500Message(debugMessage) {
    preRC500Debug.innerHTML += RC500MessageCount + " RC: " + debugMessage + "<br />";
    RC500MessageCount++;
    if (RC500MessageCount > 20) {
        preRC500Debug.innerHTML = "";
        RC500MessageCount = 0;
    }

}



function RC500MIDIMessage(message) {
    if (message.data==MIDIStatus.CLOCK_CONTINUE 
        || message.data==MIDIStatus.CLOCK_PULSE 
        || message.data==MIDIStatus.CLOCK_START 
        || message.data==MIDIStatus.CLOCK_STOP) {

            OutputToTimeFactor.send(message.data);
            OutputToPitchFactor.send(message.data);
            OutputToSpace.send(message.data);

    } else {
        console.log(message.data.length);
        showRC500Message(message.data);
        decipherMessage(message.data, "RC500");
    }
}


function GP10MIDIMessage(message) {
    console.log("GP10MIDIMessage: length " + message.data.length);
    showGP10Message(message.data);
    decipherMessage(message.data, "GP10");

        OutputToTimeFactor.send(message.data);
        OutputToPitchFactor.send(message.data);
        OutputToSpace.send(message.data);
}


function onMIDISuccess(midiAccess) {
    globalMIDIAccess = midiAccess;
    console.log(globalMIDIAccess.inputs);

    globalMIDIAccess.inputs.forEach((input) => {
        //console.log("FOUND INPUT: " + input.name); /* inherited property from MIDIPort */
        //console.log(message.data);
        switch (input.name) {
            case GP10Name:
                input.onmidimessage = GP10MIDIMessage;
                showGP10Message("SET GP10 FOR " + input.name);
                InputFromGP10 = input;
                break;

            case RC500Name:
                input.onmidimessage = RC500MIDIMessage;
                showRC500Message("SET RC FOR " + input.name);
                InputFromRC500 = input;
                break;

            default:
                //console.log("NO INPUT MATCH FOR: " + input.name); 
                break;
        }

    });


    globalMIDIAccess.outputs.forEach((output) => {
        //console.log("FOUND OUTPUT: " + output.name); /* inherited property from MIDIPort */
        switch (output.name) {
            case TimeFactorName:
                console.log("FOUND TIMEFACTOR AT: " + output.name); 
                OutputToTimeFactor = output;
                break;
            case PitchFactorName:
                console.log("FOUND PITCHFACTOR AT: " + output.name); 
                OutputToPitchFactor = output;
                break;
            case SpaceName:
                console.log("FOUND SPACE AT: " + output.name); 
                OutputToSpace = output;
                break;
            case RC500Name:
                console.log("FOUND RC500 AT: " + output.name); 
                OutputToRC500 = output;
                break;
            default:
                //console.log("NO OUTPUT MATCH FOR: " + output.name); 
                break;
        }
    });

}


function onMIDIFailure(msg) {
    showGP10Message("Failed to get MIDI access - " + msg);
}


window.addEventListener('load', (event) => {
    var currentURL = window.location.href;
    if (currentURL.indexOf("http://localhost") == -1) {
        window.location.href = "http://localhost/";
        return;
    }
    var options = {sysex: false};
    navigator.requestMIDIAccess(options).then(onMIDISuccess, onMIDIFailure);
    preGP10Debug = document.getElementById("preGP10Debug");
    preRC500Debug = document.getElementById("preRC500Debug");
    msgDebug = document.getElementById("msgDebug");

});