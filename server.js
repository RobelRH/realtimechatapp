const io = require('socket.io')(3000)

const users = {}

// check if our server has made a connection
io.on('connection', socket => {
  
  // socket.on is responsible to listen incoming messages
  // from the socket.emit
  socket.on('newuser', name => {
    // storing connected user id with their names, just like the follwing
    // { KcRG_ICyFaPtiwa_AAAC: 'john' }
    users[socket.id] = name
    // socket.broadcast.emit is responsible to broadcast message to all connected clients
    // except the for sender
    socket.broadcast.emit('user_joined', name)
  })

  // here we are receiving emitted data ("send-msg") from client message input box
  socket.on('send-msg', message => {
    // here we are broadcasting it for other connected clients
    socket.broadcast.emit('broadcast-msg', {message: message, name: users[socket.id] })
  })

  // using "disconnect" reserved event string
  socket.on('disconnect', () => {
    // to broadcast for other clients that this user is disconnected
    socket.broadcast.emit('user_disconnected', users[socket.id])
    // delete this user from users object
    delete users[socket.id]
  })

})