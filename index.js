const express = require('express');
const cors = require('cors');
const http = require('http');
const router = require('./route');

const { addUser, findUser, getRoomUsers, removeUser } = require('./users');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(router);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }) => {
    socket.join(room);

    console.log(socket);
    // Проверка на регистрацию 
    const { user } = addUser({ name, room });

    // Сообщение о подключение к чату
    socket.emit('message', {
      data: {
        user: { name: 'Admin' },
        message: `Привет ${user.name}, вы подключены к чату`
      }
    });

    // Рассылка в чат
    socket.broadcast.to(user.room).emit('message', {
      data: {
        user: { name: 'Admin' },
        message: `${user.name} присоединился`
      }
    });

    io.to(user.room).emit('room', {
      data: {
        users: getRoomUsers(user.room),
      }
    })
  })

  // Отправить сообщение для всех кто в данном чате 
  socket.on('sendMessage', ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit('message', {
        data: { user, message }
      });
    }
  })

  // Выйти из комнаты -/- чата
  socket.on('leftRoom', ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, name } = user;

      io.to(room).emit('message', {
        data: {
          user: { name: 'Admin' },
          message: `${name} вышел из беседы`
        }
      });

      io.to(room).emit('room', {
        data: {
          users: getRoomUsers(room),
        }
      })
    }
  })
})

server.listen(5000, () => {
  console.log(`Server is running ${5000}`);
})