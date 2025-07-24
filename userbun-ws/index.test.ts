import {describe , expect, test} from 'bun:test'

const BACKEND_WS_URL1 = 'ws://localhost:8080'
const BACKEND_WS_URL2 = 'ws://localhost:8081'

describe('chat application',()=>{
    test('message from the room1 websocket goes to all member of room1',async()=>{
        const ws1 = new WebSocket(BACKEND_WS_URL1)
        const ws2 = new WebSocket(BACKEND_WS_URL2)
        
        await new Promise<void>(
            (resolve)=>{
                let count = 0
                ws1.onopen = () =>{
                    count = count + 1
                    if(count == 2){
                        resolve()
                    }
                }
                ws2.onopen = () => {
                    count = count +  1
                    if(count == 2){
                        resolve()
                    }
                }
            }
        )

        ws1.send(JSON.stringify({
            type:'join-room',
            room:'Room 1'
        }))

        ws2.send(JSON.stringify({
            type:'join room',
            room:'Room 1'
        }))

        ws1.send(JSON.stringify({
            type:'chat',
            room:'Room 1',
            message: 'Hi there'
        }))

        ws2.onmessage = ({data}) =>{
        
            const parseData = JSON.parse(data)
            expect(parseData.type).toBe('chat')
            expect(parseData.message).toBe('Hi there')
        }
    })
})