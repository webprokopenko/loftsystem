'use strict';

/*
 Задача скрипта - создать нового пользователя
 */

//подключаем модули
const mongoose = require('mongoose');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const uuidv1 = require('uuid/v1');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@ds247317.mlab.com:47317/loftsystem', { useMongoClient: true });


//логин и пароль, изначально пустые
let username = '',
  password = '';

//спрашиваем логин
rl.question('Username: ', answer => {
  //записываем введенный логин
  username = answer;

  //спрашиваем пароль
  rl.question('Password: ', answer => {
    //записываем введенный пароль
    password = answer;

    //завершаем ввод
    rl.close();
  });
});

//когда ввод будет завершен
rl.on('close', () => {
  //подключаем модель пользователя
  require('./models/users');

  //создаем экземпляр пользователя и указываем введенные данные
  const User = mongoose.model('users');
  const adminUser = new User({
    username: username,
    firstName: 'Administrator',
    middleName: 'Administrator',
    surName: 'Administrator',
    access_token: uuidv1(),
    img: '',
    id: uuidv1(),
    permission: {
      chat:{
        C:true,
        R:true,
        U:true,
        D:true
      },
      news:{
        C:true,
        R:true,
        U:true,
        D:true
      },
      setting:{
        C:true,
        R:true,
        U:true,
        D:true
      }
    }
  });
  adminUser.setPassword(password);


  //пытаемся найти пользователя с таким логином
  User
    .findOne({ username: username })
    .then(u => {
      //если такой пользователь уже есть - сообщаем об этом
      if (u) {
        throw new Error('Такой пользователь уже существует!');
      }

      //если нет - добавляем пользователя в базу
      return adminUser.save();
    })
    .then(u => console.log('ok!'), e => console.error(e.message))
    .then(() => mongoose.connection.close(function () {
      process.exit(0);
    }));
});