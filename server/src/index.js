import express from "express"
import io from "socket.io"
import chalk from "chalk"

/* eslint-disable no-console */

const app    = express()
const port   = process.env.PORT || 3000
let messages = []

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.sendFile("/index.html");
})

const server = app.listen(port, () => {
  console.log(chalk.green(`Application listening on port: ${port}`))
})

// Socket.io
const socketio = io.listen(server)

socketio.on("connection", socket => {
  console.log(chalk.green(`Client connected`))

  socket.emit("all-messages", { messages });

  socket.on("send-message", ({ message, username }) => {
    console.log(`client sent a message "${message}"`)

    const now = new Date()
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

    const newMessage = { message, username, time }

    messages.unshift(newMessage)

    socketio.emit("message-received", { message: newMessage });
  })

  socket.on("disconnect", () => {
    console.log(`Client disconnected`)
  })
})
