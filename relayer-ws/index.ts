import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({port:8081})
const servers: WebSocket[] = []
wss.on("connection",(ws)=>{
    ws.on('error', console.error)
    servers.push(ws)
    ws.on('message',(data:string)=>{
        servers.filter(socket=>socket != ws).map(socket => socket.send(data))

    })
})