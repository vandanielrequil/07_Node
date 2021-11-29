import * as fs from 'fs';
import { Stream } from 'stream';
import path from 'path';

import http from 'http';
import cluster from 'cluster';
import os from 'os';

/*
To interact with program "npm start" and open index.html 
*/


(async function () {

    http.createServer((req, res) => {
        if (req.method === 'GET') {
            const currentDirectory = process.cwd(),
                url = req.url,
                trgPath = path.join(currentDirectory + url),
                headers = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET',
                    'Access-Control-Max-Age': 2592000,
                    'Content-type': 'application/json'
                },
                isDirectory = (objPath) => fs.lstatSync(objPath).isDirectory();

            res.writeHead(200, headers);

            function answerString(data, type) {
                let dataChoose, nameChoose;
                if (type === 'link') {
                    dataChoose = `http://localhost:5501/${data}`;
                    nameChoose = data;
                }
                else {
                    dataChoose = data;
                    nameChoose = '';
                }
                return JSON.stringify({ data: dataChoose, name: nameChoose, type: type })
            }

            if (isDirectory(trgPath)) {
                const resultArr = fs.readdirSync(trgPath);
                // let stringList = '';
                // resultArr.map(e => { stringList += { link: `http://localhost:5501/${e}`, name: `${e}` } });
                let stringList = resultArr.map(e => { return answerString(e, 'link') }).join('~#~');
                res.end(stringList);
            }
            else {
                fs.createReadStream(trgPath).on("data", (chunk) => res.end(answerString(chunk.toString(), 'string')));
                return true
            }
        }

    }).listen(5501, 'localhost');

})();