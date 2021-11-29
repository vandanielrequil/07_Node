import * as fs from 'fs';
import { Stream } from 'stream';
import path from 'path';

import http from 'http';
import cluster from 'cluster';
import os from 'os';


(async function () {

    http.createServer((req, res) => {

        if (req.method === 'GET') {

            const isFile = (objPath) => fs.lstatSync(objPath).isFile(),
                currentDirectory = process.cwd();

            //console.log(req.url);
            //console.log(fs.readdirSync(currentDirectory));

            const resultArr = fs.readdirSync(currentDirectory);
            const headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET',
                'Access-Control-Max-Age': 2592000,
                'Content-type': 'application/json'
            };
            res.writeHead(200, headers);

            const objArr = resultArr.map(e => { return { name: e, link: `<li><a href="http://localhost:5501/${e}">${e}</a></li>` } });
            res.end(JSON.stringify(objArr));

            if (!1) {
                //fs.createReadStream(path.join(currentDirectory, 'README.md')).on('data', d => { res.end(d); return d });
                fs.createReadStream(path.join(currentDirectory, 'README.md')).pipe(res);
                return true
            }

        }

    }).listen(5501, 'localhost');

})();