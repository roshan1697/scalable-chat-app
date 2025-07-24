import { WebSocketServer, WebSocket as WebSocketWsType } from "ws";

const wss = new WebSocketServer({port:8080})

const RELAYER_URL = 'ws://localhost:8090'
const relayerSocket = new WebSocket(RELAYER_URL)

interface room {
    sockets: WebSocketWsType[]
}
const rooms:Record<string, room> = {}

relayerSocket.onmessage = ({data}) =>{
    const parseData = JSON.parse(data)
    rooms[parseData.room]?.sockets.map(socket => socket.send(data))
}

wss.on('connection',(ws)=>{
    ws.on('error',console.error)

    ws.on('message',(data:string)=>{
        console.log(data)
        const parseData = JSON.parse(data)
        if(parseData.type == 'join-room'){
            const room = parseData.room
            if(!rooms[room]){
                rooms[room] = {
                    sockets: []
                }
            }
            rooms[room].sockets.push(ws)
        }

        if(parseData.type == 'chat'){
            relayerSocket.send(data)
        }
    })
})