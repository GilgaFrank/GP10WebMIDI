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