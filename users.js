// Данные пользователей (можно закинуть в БД)
let users = [];

const trimStr = (str) => {
  return str.trim().toLowerCase()
}

// Проверить есть ли пользователь в группе
const findUser = (user) => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  return users.find(
    (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom);
}

// Добавить пользователя в чат
const addUser = (user) => {
  const isExist = findUser(user);

  !isExist && users.push(user);
  const currentUser = isExist || user;

  return {
    user: currentUser,
  }
}

// Отобразить кол-во участников в группе
const getRoomUsers = (room) => users.filter(u => u.room === room);

// Удалить пользователя из чата
const removeUser = (user) => {
  const foundUser = findUser(user);

  if (foundUser) {
    const user = users.filter(({ room, name }) => room === foundUser.room && name == foundUser.name)[0];
    users = users.filter(({ room, name }) => room === foundUser.room && name !== foundUser.name);

    return user;
  }
}

module.exports = { addUser, findUser, getRoomUsers, removeUser };

