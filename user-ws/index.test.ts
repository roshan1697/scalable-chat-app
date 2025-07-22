import {describe, test,expect } from '@jest/globals'
const BACKEND_WS_URL = 'ws://localhost:8080'
describe('chat application',()=>{
    test('Message from room1 reaches another participant in room1',async()=>{
        const ws1 = new WebSocket(BACKEND_WS_URL)
        const ws2 = new WebSocket(BACKEND_WS_URL)

        // await new Promise<void>((resolve,reject)=>{
        //     let count = 0
        //     ws1.onopen = () =>{
        //         console.log('ws1')
            
        //         count = count + 1
        //         if(count == 2){
        //             resolve()
        //         }
        //     }
        //     ws2.onopen = ()=>{
            
        //         console.log('ws2')
            
        //         count = count + 1
        //         if(count == 2) {
        //             resolve()
        //         }
        //     }
        // })
        await new Promise<void>((resolve)=>
        { ws1.onopen = () => {

            ws1.send(JSON.stringify({
                type:'join-room',
                room:'Room 1'
            })) 
            resolve()
        }
            console.log('ws1')
    })
    await new Promise<void>((resolve)=>{
        ws2.onopen = () => {

            
            ws2.send(JSON.stringify({
                type:'join-room',
                room:'Room 1'
            }))
            resolve()
        }
            
            console.log('ws2')
        
    })
    
        
    
        await new Promise<void>((resolve)=>{
            
            ws2.onmessage = ({data})=>{
                
            // const blob = event.data as Blob;
            // const text = await blob.text();


                const parseData = JSON.parse(data)
                
                expect(parseData.type).toBe('chat')
                expect(parseData.message).toBe('Hi there')
                resolve()
            }
            ws1.send(JSON.stringify({
                type:'chat',
                room:'Room 1',
                message:'Hi there'
            }))
        })

    })  
})