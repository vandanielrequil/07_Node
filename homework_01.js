const argArr = process.argv.slice(2, 4);
const colors = require('colors');

let x = parseInt(argArr[0]),
    y = parseInt(argArr[1]);

if (isNaN(x) || isNaN(y)) {
    return console.log('Please enter numbers only in format "9 99"');
}

(x > y) ? [x, y] = [y, x] : true;

function simpleNumber(x) {
    let max = Math.round(x / 2);
    let i = 2;
    return (function recursiveCheck(x, i) {
        if ((x % i === 0 || x === 0 || x === 1) && x !== 2) {
            return false
        }
        else if (i >= max) {

            return true;
        }
        else {
            return recursiveCheck(x, ++i);
        }
    })(x, i);
}

function printColoredNums(x, y) {
    let coloredArr = [], isThereAreSimples = 0;
    for (let i = x, j = 1; i <= y; i++) {
        let color = colors.grey;
        if (simpleNumber(i)) {
            switch (j) {
                case 1: color = colors.green; break
                case 2: color = colors.yellow; break
                case 3: color = colors.red; break
            }
            (j === 3) ? j = 0 : false
            j++;
            isThereAreSimples++;
        }
        coloredArr.push(color(i));
    }
    if (isThereAreSimples === 0) { return console.log('There are no simple numbers') }
    console.log(coloredArr.join(' '));
    return true;
}

printColoredNums(x, y);