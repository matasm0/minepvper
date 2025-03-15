const serverIP = (window.location.protocol === 'https:') ?
  "wss://"+window.location.host+"/" :
  "ws://"+window.location.host+"/"

class Connection {
  constructor(onReceive = () => {}, onReady = () => {}, onError = () => {}) {
    this.onReceive = onReceive
    this.onReady = onReady
    this.onError = onError

    this.connected = false
  }

  async connect() {
    try {
      this.socket = new WebSocket(serverIP)

      this.socket.addEventListener("open", () => {
        this.isConnected = true
        this.onReady()
      })
      this.socket.addEventListener("message", e => {
        this.onReceive(e.data)
      })
      this.socket.addEventListener("error", () => {
        this.onError()
      })
      return true
    }
    catch (error) {
      // Catch errors if serverIP is invalid
      // Does not catch errors if websocket server is unreachable
      // TODO See what exceptions we can catch here
      console.log(`ERROR: Failed to connected to websocket server at ${serverIP}`)
      console.log(error.message)
      return false
    }
  }
  
  isConnected() {
    return this.connected
  }

  async send(message) {
    try {
      this.socket.send(message)
      return true
    }
    catch(e) {
      // TODO See what excepts we catch here
      console.log(`ERROR: Failed to send message`)
      console.log(e.message)
      return false
    }
  }

  setReceive(onReceive) {
    // Should we uhhhhhhh... remove the last event listener? How would
    // we even do that?
    this.socket.addEventListener("message", e => {
      onReceive(e.data)
    })
  }
}

export default Connection