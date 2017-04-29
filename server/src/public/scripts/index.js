const socket = io(); // eslint-disable-line

const chat = document.getElementById("chat-body");

socket.on("all-messages", ({ messages }) => renderMessages(messages))
socket.on("message-received", ({ message }) => addMessage(message))

const form = document.getElementById("chat-form");
form.addEventListener("submit", e => {
  e.preventDefault();

  const usernameEl = document.getElementById("username")
  const messageEl  = document.getElementById("message")

  const username = usernameEl.value
  const message  = messageEl.value

  socket.emit("send-message", { message, username });

  messageEl.value = ""
})

const addMessage = message => {
  const row = createTableRow(message)

  return chat.appendChild(row)
}

const renderMessages = messages => {
  return messages.map(message => {
    const row = createTableRow(message)

    return chat.insertBefore(row, chat.childNodes[0])
  })
}

const createTableRow = ({ time, username, message }) => {
  const row = document.createElement("tr")
  row.classList.add("chat-message")

  const timeCell = document.createElement("td")
  timeCell.classList.add("time")
  timeCell.textContent = time
  row.appendChild(timeCell)

  const userCell = document.createElement("td")
  userCell.classList.add("username")
  userCell.textContent = username
  row.appendChild(userCell)

  const messageCell = document.createElement("td")
  messageCell.classList.add("message-text")
  messageCell.textContent = message
  row.appendChild(messageCell)

  return row
}
