import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://loaclhost:3000`);

//http 서버는 request를 주고 reponse 를 받아 주고받는 방식이고
//ws 서버는 request를 주지 않아도 response를 받을 수 있는 방식
const server = http.createServer(app);              //http 서버
const wss = new WebSocket.Server({server});         //ws서버(http 서버 위에 ws서버를 생성함)

function onSocketClose() {
    console.log("Disconnected from the Browser! χ")
}

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "익명";
    console.log("Connected to Server!");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        const message = JSON.parse(msg.toString());
        switch(message.type) {
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`
                ));
            case "nickname":
                socket["nickname"] = message.payload;
        }
        //sockets.forEach((aSocket) => aSocket.send(message.toString()));
    });
});

server.listen(3000, handleListen);                  //http 프로토콜과 ws프로토콜이 3000번 포트로 공유

