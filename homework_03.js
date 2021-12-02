import * as fs from 'fs';
import { Transform } from 'stream';

const path = '.\\logs\\',
    filename = 'access_short.log',
    ipArr = ['89.123.1.41', '34.48.240.111'],
    readStream = fs.createReadStream(path + filename, {
        encoding: 'utf-8',
        start: 0
    }),
    writeStreamObjArr = [];

for (let ip of ipArr) {
    writeStreamObjArr.push({
        writeStream: fs.createWriteStream(path + ip + '_requests.log', { flags: 'a', encoding: 'utf-8' }),
        ip: ip
    });
}

const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        const tChunck = chunk.toString();
        console.log(chunk);
        let outChunk = '';
        for (let wrStrObj of writeStreamObjArr) {
            try {
                let regIp = new RegExp(wrStrObj.ip + '.+', 'g'),
                    tChunckStr;
                tChunckStr = tChunck.match(regIp).join('\r\n');
                outChunk = outChunk + '\r\n' + tChunckStr;
                wrStrObj.writeStream.write(tChunckStr);

            }
            catch (er) { console.log('Error on IP: ' + wrStrObj.ip + ' ' + er) }
        }
        callback(null, outChunk);
    }
});

readStream.pipe(transformStream).pipe(process.stdout);
