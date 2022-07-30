/*
MODULE IMPORTS
*/
import * as MIDIStatus from "./MIDIStatuses.js";
import {getJSONResponse} from "./JSON.js";
import * as UIBuilder from "./UIBuilder.js";
import * as EventideCCs from "./Eventide_MIDI_CCs.js";
import * as RC500CCs from "./RC500_MIDI_CCs.js"


//navigator MIDIAccess
var globalMIDIAccess;

//constants for MIDI device identification
const GP10Name = "GP-10 MIDI 1";
const RC500Name = "BOSS_RC-500 MIDI 1";
const TimeFactorName = "TimeFactor Pedal MIDI 1";
const PitchFactorName = "PitchFactor Pedal MIDI 1";
const SpaceName = "Space Pedal MIDI 1";

//MIDI ports
var InputFromGP10 = null;
var InputFromRC500 = null;

var OutputToRC500 = null;
var OutputToTimeFactor = null;
var OutputToPitchFactor = null;
var OutputToSpace = null;


//UI elements
var preGP10Debug;
var preRC500Debug;
var msgDebug;
var UIRootDiv;

//count of debug messages
var RC500MessageCount = 0;
var GP10MessageCount = 0;


function numberToHex(num) {
    return num.toString(16);
}

function decipherMessage(message, sourceName) {
    //identifies prog change, not on/off etc
    var msgTypeMatched = MIDIStatus.findMessageType(message);
    
    var midiChannel = msgTypeMatched.channel;
    msgDebug.innerHTML = msgTypeMatched.msgType + " on channel " + midiChannel;
    var midiStatus = message[0];
    console.log("::decipherMessage from " + sourceName + " ::");
    console.log("decipherMessage: " + msgTypeMatched.statusByte + " LEN: " + msgTypeMatched.byteLength);

    var midiCommand = numberToHex(midiStatus & 0xF0); // mask off all but top 4 bits

    if (message.length > 1) {        
        //midiChannel = midiStatus & 0x0F;        
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
    
    
    if (msgTypeMatched.statusByte == MIDIStatus.PROGRAM_CHANGE && sourceName == "GP10") {        
        //TODO: this needs to be async/promise code
        console.log("GET JSON " + midiCommmandHEX);
        var JSONPCList = getJSONResponse(10);
        
        //alert("JSONPCList: " + JSONPCList);
/*  
        OutputToPitchFactor.send(message);
        OutputToTimeFactor.send(message);
        OutputToSpace.send(message);
*/
        //OutputToRC500.send(message);
    }


}


function showGP10Message(debugMessage) {
    //debug helper to show MIDI events in UI
    console.log("showGP10Message: " + debugMessage);
    preGP10Debug.innerHTML += GP10MessageCount + " GP: " + debugMessage + "<br />";
    GP10MessageCount++;
    if (GP10MessageCount > 20) {
        preGP10Debug.innerHTML = "";
        GP10MessageCount = 0;
    }
}

function showRC500Message(debugMessage) {
    //debug helper to show MIDI events in UI
    preRC500Debug.innerHTML += RC500MessageCount + " RC: " + debugMessage + "<br />";
    RC500MessageCount++;
    if (RC500MessageCount > 20) {
        preRC500Debug.innerHTML = "";
        RC500MessageCount = 0;
    }

}



function RC500MIDIMessage(message) {
    //callback for reciving/forwarding MIDI clock from clock master RC500
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
    //callback for reciving/forwarding MIDI from GP10
    console.log("GP10MIDIMessage: length " + message.data.length);
    showGP10Message(message.data);
    decipherMessage(message.data, "GP10");
/*
        OutputToTimeFactor.send(message.data);
        OutputToPitchFactor.send(message.data);
        OutputToSpace.send(message.data);
*/
}


function onMIDISuccess(midiAccess) {
    //gets MIDIAccess global, assigns input and output ports and callbacks
    globalMIDIAccess = midiAccess;
    console.log(globalMIDIAccess.inputs);


    //identify input ports
    globalMIDIAccess.inputs.forEach((input) => {
        console.log("FOUND INPUT: " + input.name); /* inherited property from MIDIPort */
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


    //identify output ports
    globalMIDIAccess.outputs.forEach((output) => {
        console.log("FOUND OUTPUT: " + output.name); /* inherited property from MIDIPort */
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

/*
TO-DO: Move all UI initialisation into a module
*/

//debug only, UI elements to fire MIDI functions
function btnRC500Start_ClickHandler(event) {
    console.log("START");
}

function btnRC500Stop_ClickHandler(event) {
    console.log("STOP");
}

function btnRC500Rec1_ClickHandler(event) {
    console.log("REC1");
}

function btnRC500Rec2_ClickHandler(event) {
    console.log("REC2");
}

function btnEventideBypass_ClickHandler(event) {
    console.log(event.target.id);
}


//UI debug element create and setup
function initRC500Buttons() {
    document.getElementById("btnRC500Start").addEventListener("click", btnRC500Start_ClickHandler);
    document.getElementById("btnRC500Stop").addEventListener("click", btnRC500Stop_ClickHandler);
    document.getElementById("btnRC500Rec1").addEventListener("click", btnRC500Rec1_ClickHandler);
    document.getElementById("btnRC500Rec2").addEventListener("click", btnRC500Rec2_ClickHandler);
}

//UI debug element create and setup
function initEventideButtons() {
    document.getElementById("btnTimeFactor_Bypass").addEventListener("click", btnEventideBypass_ClickHandler);
    document.getElementById("btnPitchFactor_Bypass").addEventListener("click", btnEventideBypass_ClickHandler);
    document.getElementById("btnSpace_Bypass").addEventListener("click", btnEventideBypass_ClickHandler);
}

//UI debug element handler
function spinClickHandler(event) {
    console.log(event.target.id);
}

//create debug buttons and add handlers
function initUI() {
    initRC500Buttons();
    initEventideButtons();


    UIBuilder.addSpinner(UIRootDiv, 
        spinClickHandler, 
        spinClickHandler,
        "Tempo",
        "spinTempo", 0, 200, 120);

    UIBuilder.addSpinner(UIRootDiv, 
        spinClickHandler, 
        spinClickHandler,
        "MIDI Channel",
        "spinMIDIChannel", 1, 16, 1);
  
    var btnResetAll = document.createElement("button");
    btnResetAll.innerHTML = "RESET EVENTIDES";
    btnResetAll.addEventListener("click", sendProgramChangeZeroToAll);
    document.getElementById("btnRC500Start").parentElement.appendChild(btnResetAll);
    btnResetAll.style.backgroundColor="red";
    btnResetAll.style.color="white";
    btnResetAll.style.fontWeight="bold";
}

//event handler to send prog change 0 to all Eventide output ports
function sendProgramChangeZeroToAll() {
    OutputToPitchFactor.send([MIDIStatus.PROGRAM_CHANGE, 0]);
    OutputToTimeFactor.send([MIDIStatus.PROGRAM_CHANGE, 0]);
    OutputToSpace.send([MIDIStatus.PROGRAM_CHANGE, 0]);
}

/*
WebMIDI only works from localhost or 127.0.0.1
*/

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
    UIRootDiv = document.getElementById("ui");
    initUI();
});