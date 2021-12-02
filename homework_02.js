/**
 *  '15-11-2021 22:10:00'
 *  multiple timers can be set
 *  node .\homework_02.js 18-11-2021-23:49:30 16-11-2021-21:30:30
 */

import Events, { EventEmitter } from 'events';
import date from 'date-and-time';
import humanizeDuration from 'humanize-duration';

class MyEmmiter extends EventEmitter { };
const emitterTimer = new MyEmmiter();
const parAr = process.argv.splice(2);

class TimeLeft {
    constructor(pr) {
        this.id = pr.id;
        this.endDt = date.parse(pr.endDt, 'DD-MM-YYYY-hh:mm:ss');
    }
    msLeft() {
        const curDt = new Date();
        const msLeft = date.subtract(this.endDt, curDt).toMilliseconds();
        return msLeft;
    }
    timeLeft() {
        const curDt = new Date();
        return `Time left is ${humanizeDuration(this.msLeft())}`;
    }
    timeEnd() {
        return `Time's up`;
    }
    isEnd() {
        if (this.msLeft() > 0) {
            return false
        }
        else return true
    }
    state() {
        if (this.msLeft() > 0) {
            return this.timeLeft()
        }
        else return this.timeEnd()
    }
}

function createTimers(parAr) {
    let arrTimers = [];
    for (let i in parAr) {
        const newTimer = new TimeLeft({ id: i, endDt: parAr[i] });
        arrTimers.push(newTimer);
    }
    return arrTimers;
}

function runTimers(arrTimers, emmiter) {
    function tick(arrTimers, timersIntervalId, emmiter) {
        for (let i in arrTimers) {
            console.log(`Timer №${parseInt(i) + 1} ${arrTimers[i].state()}`);
        }
        const isTimesUp = !arrTimers.reduce((a, e) => a + !e.isEnd(), 0);
        if (timersIntervalId && isTimesUp) {
            clearInterval(timersIntervalId);
            emmiter.emit('end');
            return false
        }
        else {
            return true
        }
    }
    if (tick(arrTimers, true, emmiter)) {
        const timersIntervalId = setInterval(() => { tick(arrTimers, timersIntervalId, emmiter) }, 1000);
    }
    return true;
}

const timersArray = createTimers(parAr);

emitterTimer.on('start', runTimers);
emitterTimer.on('end', e => console.log("All timers clear"));
emitterTimer.emit('start', timersArray, emitterTimer);

//More shorter solution with one timer and bad code

// import Events, { EventEmitter } from 'events';
// import date from 'date-and-time';
// import humanizeDuration from 'humanize-duration';

// class MyEmmiter extends EventEmitter { };
// const emitterTimer = new MyEmmiter();


// /**
//  *  '15-11-2021 22:10:00'
//  */

// const parAr = process.argv.splice(2);

// function printLeft(parAr) {
//     //for (const i in parAr) {
//     const curDt = new Date();
//     const trgDt = date.parse(parAr[0], 'DD-MM-YYYY-hh:mm:ss');
//     const msLeft = date.subtract(trgDt, curDt).toMilliseconds();
//     if (msLeft <= 0) {
//         emitterTimer.emit('end');
//         return true;
//     }
//     else {
//         console.log(`Time left is ${humanizeDuration(msLeft)}`);
//         setTimeout(e => printLeft(parAr), 1000);
//     }
//     //}
// }

// emitterTimer.on('start', printLeft);
// emitterTimer.on('end', e => console.log("Time's up"));
// emitterTimer.emit('start', parAr);