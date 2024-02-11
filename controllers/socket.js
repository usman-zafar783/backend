

const { Server } = require('socket.io');

const socketModule = (httpServer) => {

  let onlineUsers = [];

  const io = new Server(httpServer, {cors:'http://localhost:5173'});

  io.on('connection', (socket) => {
    console.log('There is a new connection: ' + socket.id);

    // Defined Socket.io event handlers and logic here
    socket.on('addNewUser', (userID) => {
      // Handle the event
      !onlineUsers.some(user => user.userID === userID) &&
        onlineUsers.push({
            userID: userID,
            socketID: socket.id
        });
        io.emit('getOnlineUsers', onlineUsers);
    });   

    // Add Message
    socket.on('sendMessage', (message) =>{
      const user = onlineUsers.find(user => user.userID === message.recipentID);
      if(user){
        io.to(user.socketID).emit('getMessage', message)
      }
    })



    socket.on('disconnect', () =>{
        onlineUsers = onlineUsers.filter(user =>  user.socketID !== socket.id );
        io.emit('getOnlineUsers', onlineUsers);
    });

    
  });
};

module.exports = socketModule;
