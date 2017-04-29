const path = require("path")
const express = require("express")
const io = require("socket.io")
const chalk = require("chalk")
const hbs = require("express-handlebars")

/* eslint-disable no-console */

process.env.TZ = 'Europe/Helsinki'

const app = express()

app.engine("hbs", hbs({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layouts/"
}))
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

const port   = process.env.PORT || 3000
let messages = []

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => res.render("chat"))

const server = app.listen(port, () => {
  console.log(chalk.green(`Application listening on port: ${port}`))
})

// Socket.io
const socketio = io.listen(server)

socketio.on("connection", socket => {
  console.log(chalk.green(`Client connected`))

  socket.emit("all-messages", { messages })

  socket.on("send-message", ({ message, username }) => {
    console.log(`client sent a message "${message}"`)

    const time = timeParser(new Date())
    const newMessage = { message, username, time }

    messages.unshift(newMessage)

    socketio.emit("message-received", { message: newMessage })
  })

  socket.on("disconnect", () => {
    console.log(`Client disconnected`)
  })
})

const timeParser = now => {
  let hours = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()

  if(hours < 10) {
    hours = `0${hours}`
  }
  if(minutes < 10) {
    minutes = `0${minutes}`
  }
  if(seconds < 10) {
    seconds = `0${seconds}`
  }

  const time = `${hours}:${minutes}:${seconds}`

  return time
}
