const express = require("express")
const path = require("path")
const WebSocket = require("ws")

class Server {
  constructor(port) {
    this.port = port

    this.app = undefined
    this.server = undefined
    this.wss = undefined

    this.currID = 0
    this.clients = {}
  }

  newID() {
    return this.currID++
  }

  start() {
    let tries = 0
    while (tries < 5) {
      try {
        this.app = express()
        
        this.app.use(express.static(path.join(__dirname, "frontend")))
        this.app.get("/", (req, res) => {
          res.sendFile(path.join(__dirname, "index.html"))
        })
        
        this.server = this.app.listen(this.port, () => {
          console.log(`Server started on port ${this.port}`)
        })

        const wss = new WebSocket.Server({server : this.server})

        wss.on("connection", ws => {
          console.log("Client connected")
          ws.on("message", data => {
            console.log(`Received message ${data}`)
          })
          ws.on("close", () => {
            console.log("Client disconnected")
          })
        })

        break
      }
      catch (e) {
        console.log("Server failed to start")
        console.log(e)
        if (tries < 5) {
          console.log("Retrying")
        }
      }
      tries += 1
    }

    if (tries == 5) {
      console.log("Failed to start server")
      return false
    }

    return true
  }
}

const port = process.env.PORT || 8080
const server = new Server(port)
server.start()