import * as fs from 'fs';
import { Transform } from 'stream';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import inquirer from "inquirer";

const currentDirectory = process.cwd();

function ReadAndWriteLogs(filePath, stringPatterns) {
    inquirer
        .prompt([
            {
                name: "maskName",
                type: "input",
                message: "Type IPs you want to get from file, separated by space character:",
            }
        ])
        .then((answer) => {
            const ipArr = answer.maskName.split(' '),/*['34.48.240.111', '89.123.1.41'],*/
                readStream = fs.createReadStream(filePath, {
                    encoding: 'utf-8',
                    start: 0
                }),
                writeStreamObjArr = [];

            const transformFunction = (chunk) => {
                for (let ip of ipArr) {
                    writeStreamObjArr.push({
                        writeStream: fs.createWriteStream(path.join(currentDirectory, '/logs/') + ip + '_requests.log', { flags: 'a', encoding: 'utf-8' }),
                        ip: ip
                    });
                }
                const tChunck = chunk;
                let outChunk = '';
                for (let wrStrObj of writeStreamObjArr) {
                    try {
                        let regIp = new RegExp(wrStrObj.ip + '.+', 'g'),
                            tChunckStr;
                        tChunckStr = '\r\n' + tChunck.match(regIp).join('\r\n');
                        outChunk = outChunk + '\r\n' + tChunckStr;
                        wrStrObj.writeStream.write(tChunckStr);
                    }
                    catch (er) { console.log('Error on IP: ' + wrStrObj.ip + ' ' + er) }
                }
            };

            readStream.on('data', (chunk) => transformFunction(chunk))/*.pipe(process.stdout)*/;
            console.info('Output has been written into ./logs folder');
        })
        .catch(er => console.log(er));
    return true;
}

function chooseFile(currentDirectory, processFile) {
    const isFile = fileName => {
        return fs.lstatSync(fileName).isFile();
    }
    const isDirectory = dirName => {
        return fs.lstatSync(dirName).isDirectory();
    }
    const listDir = [`↑ go up`, ...fs.readdirSync(currentDirectory)/*.filter(isDirectory)*/];
    inquirer
        .prompt([
            {
                name: "objectName",
                type: "list",
                message: "Choose directory or file:",
                choices: listDir,
                loop: false,
            }
        ])
        .then((answer) => {
            let objectPath = path.join(currentDirectory, answer.objectName);
            if (answer.objectName === `↑ go up`) {
                chooseFile(currentDirectory.replace(/\\\w+$/, ''));
                return true;
            }
            else if (isFile(objectPath)) {
                ReadAndWriteLogs(objectPath)
            }
            else if (isDirectory(objectPath)) {
                chooseFile(objectPath);
                return true;
            }
            else {
                console.log('You should choose file or directory')
                chooseFile(currentDirectory);
            }

        })
        .catch(er => console.log(er));
}

chooseFile(currentDirectory, ReadAndWriteLogs);



// function ReadAndWriteLogs(filePath, stringPatterns) {
//     const path = '.\\logs\\',
//         filename = 'access_short.log',
//         ipArr = ['34.48.240.111', '89.123.1.41'],
//         readStream = fs.createReadStream(path + filename, {
//             encoding: 'utf-8',
//             start: 0
//         }),
//         writeStreamObjArr = [];

//     const transformFunction = (chunk) => {
//         for (let ip of ipArr) {
//             writeStreamObjArr.push({
//                 writeStream: fs.createWriteStream(path + ip + '_requests.log', { flags: 'a', encoding: 'utf-8' }),
//                 ip: ip
//             });
//         }
//         const tChunck = chunk;
//         let outChunk = '';
//         for (let wrStrObj of writeStreamObjArr) {
//             try {
//                 let regIp = new RegExp(wrStrObj.ip + '.+', 'g'),
//                     tChunckStr;
//                 tChunckStr = '\r\n' + tChunck.match(regIp).join('\r\n');
//                 outChunk = outChunk + '\r\n' + tChunckStr;
//                 wrStrObj.writeStream.write(tChunckStr);
//             }
//             catch (er) { console.log('Error on IP: ' + wrStrObj.ip + ' ' + er) }
//         }
//     };

//     readStream.on('data', (chunk) => transformFunction(chunk)).pipe(process.stdout);

//     return true;
// }




//
////
/////////   YARGS
////
//

// import yargs from 'yargs';
// import { hideBin } from 'yargs/helpers'

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const options = yargs(hideBin(process.argv))
//     .usage("Usage: -p <path>")
//     .option("p", {
//         alias: "path",
//         describe: "Path to file",
//         type: "string",
//         demandOption: true
//     })
//     .argv;

// const filePath = path.join(__dirname, options.path);

// console.log(filePath);

//
////
//////////// INQUIRER
////
//

//import inquirer from "inquirer";
// const currentDirectory = process.cwd();

// const isFile = fileName => {
//     return fs.lstatSync(fileName).isFile();
// }

// const list = fs.readdirSync(currentDirectory).filter(isFile);

// inquirer
//     .prompt([
//         {
//             name: "fileName",
//             type: "list",
//             message: "Choose file:",
//             choices: list,
//         },
//     ])
//     .then((answer) => {
//         const filePath = path.join(currentDirectory, answer.fileName);

//         fs.readFile(filePath, 'utf8', (err, data) => {
//             console.log(data);
//         });
//     });