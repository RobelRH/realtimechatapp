// locating where our socket server is hosting
const socket = io('http://localhost:3000')

// accessing our forms and input box by their id from the html file
const messageContainer = document.getElementById('message-container')
const formContainer = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

// lets you to enter your name, 
// and emit your name into server,
// so the server can broadcast for other clients that you are connected
const user_name = prompt('enter your username to join')
socket.emit('newuser', user_name)
appendMessage(`you joined`)

// the server is emitting a string "user_joined" to let the other clients now 
// that a user has joined
socket.on('user_joined', name => {
  appendMessage(`${name} joined`)
})

// this is used to send our messages to server so that 
// the server can broadcast the messages you sent to other connected clients
formContainer.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`you : ${message}`)
  socket.emit('send-msg', message)
  messageInput.value = ''
})

// listening to incoming message by accessing 
// emitted string called "broadcast-msg" from the server
// and appending the message to our message container || div
socket.on('broadcast-msg', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

// listening to incoming message if a user has disconnected
// if it does, it append a message to our message container 
// that a user has been disconnected
socket.on('user_disconnected', user => {
  appendMessage(`${user} disconnected`)
})

// this function is used to append any message
// to our message container
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerHTML = message
  messageContainer.append(messageElement)
}