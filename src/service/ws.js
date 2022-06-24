import { useStore } from "vuex"
const wsUrl = 'ws://localhost:8080'
let socket = null

export const connectSocket = () => {  
  socket = new WebSocket(wsUrl)
  const store = useStore()

  socket.onopen = () => { //連線(onopen)
    console.log("websocket connected!!")
  }

  socket.onmessage = (msg) => { //監聽訊息(onmessage)
    console.log('onmessage:', msg)
    store.commit('ws/setWsRes', JSON.parse(msg ?? {}))
  }

  socket.onerror = (err) => { //監聽錯誤(onerror)
    console.log("error", err)
  }
}

export const sendSocketMessage = msg => {
  if (1 === socket.readyState) socket.send(JSON.stringify(msg))
}