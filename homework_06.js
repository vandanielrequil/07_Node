/* npm start and open http://localhost:5502/ */

import { createServer } from "http";
import { Server } from "socket.io";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const server = createServer((req, res) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = path.join(__dirname, './index.html');
    const readStream = fs.createReadStream(file);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET',
        'Access-Control-Max-Age': 2592000
    };
    res.writeHead(200, headers);
    readStream.pipe(res);
});

const io = new Server(server),
    usersArr = [];

io.on("connection", (socket) => {

    socket.on("client-msg", ({ uname, msg }) => {
        let userIndex = usersArr.findIndex(e => e.uname === uname);

        if (userIndex === -1) {
            usersArr.push({ id: socket.id, uname: uname });
            socket.broadcast.emit("server-msg", `User ${uname} has joined chat`);
            socket.emit("server-msg", `User ${uname} has joined chat`);
        }
        else {
            usersArr[userIndex].id = socket.id;
        }

        socket.broadcast.emit("server-msg", 'This is an answer');
        socket.emit("server-msg", 'This is an answer');

    });

    socket.on("disconnect", () => {
        const disconUser = usersArr.find(e => e.id = socket.id),
            disconUserIndex = usersArr.findIndex(e => e.id === socket.id);
        console.log(usersArr);
        if (disconUser !== undefined) {
            if (disconUser.uname) {
                socket.broadcast.emit("server-msg", `Whoa whoa whoa ${disconUser.uname} has left`);
                socket.emit("server-msg", `Whoa whoa whoa ${disconUser.uname} has left`);
                usersArr.splice(usersArr, 1);
                console.log(usersArr);
            }
        }
    });


});

server.listen(5502, 'localhost');