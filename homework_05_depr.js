import * as fs from 'fs';
import path from 'path';
import inquirer from "inquirer";

import http from 'http';
import cluster from 'cluster';
import os from 'os';

const cpuNum = os.cpus().length,
    currentDirectory = process.cwd();
let inquirerOutPut = '1';

function ReadFile(filePath) {
    const readStream = fs.createReadStream(filePath, {
        encoding: 'utf-8',
        start: 0
    });
    readStream/*.on('data', (chunk) => transformFunction(chunk))*/.pipe(process.stdout);
    return true;
}

function transformFunction(chunk) {
    let writeStream = fs.createWriteStream(path.join(currentDirectory, '/logs/') + 'OUTPUT.log', { flags: 'a', encoding: 'utf-8' });
    writeStream.write(chunk);
};

async function chooseFile(currentDirectory, processFile) {
    let writeStream = fs.createWriteStream(path.join(currentDirectory, '/logs/') + 'OUTPUT.log', { flags: 'a', encoding: 'utf-8' });
    //writeStream.write(chunk);


    const isFile = fileName => {
        return fs.lstatSync(fileName).isFile();
    }
    const isDirectory = dirName => {
        return fs.lstatSync(dirName).isDirectory();
    }
    const listDir = [`↑ go up`, ...fs.readdirSync(currentDirectory)/*.filter(isDirectory)*/];

    // const prompt = inquirer.createPromptModule({
    //     input: this.stdin,
    //     output: this.stdout,
    // });

    const prompt = inquirer.createPromptModule({
        output: process.stdout.on('data', function (data) {
            inquirerOutPut += data.toString();
            console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqq ' + inquirerOutPut)
        })
    });

    return await prompt([
        {
            name: "objectName",
            type: "list",
            message: "Choose directory or file:",
            choices: listDir,
            loop: false,
        }
    ]).then(r => console.log('THIS APLACE X 213132123132321231321'));

    /* inquirer
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
                 chooseFile(currentDirectory.replace(/\\\w+$/, processFile));
                 return true;
             }
             else if (isFile(objectPath)) {
                 processFile(objectPath)
             }
             else if (isDirectory(objectPath)) {
                 chooseFile(objectPath, processFile);
                 return true;
             }
             else {
                 console.log('You should choose file or directory')
                 chooseFile(currentDirectory, processFile);
             }
 
         })
         .catch(er => console.log(er));
         */

}




if (cluster.isPrimary) {
    for (let i = 0; i < cpuNum; i++) {
        cluster.fork();
    }
}
else {
    http.createServer((req, res) => {

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET',
            'Access-Control-Max-Age': 2592000,
            'Content-type': 'application/json'
        };
        res.writeHead(200, headers);

        // let json = `{
        //     "id": "1",
        //     "name": "qwerty"
        // }`;

        if (req.method === 'GET') {

            console.log('GET happend');
            let promRes = chooseFile(currentDirectory, transformFunction);
            res.end('END');
            return true;
        }
        if (req.method === 'POST') {
            console.log('POST happend');
            res.end('POST!');
            return true;
        }
    }
    ).listen(5501, 'localhost')
}


