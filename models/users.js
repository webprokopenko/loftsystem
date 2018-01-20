let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bCrypt = require('bcryptjs');

let usersSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Укажите Имя'],
    unique: true
  },
  firstName: {
    type: String,
    unique: false,
    required: false,
  },
  middleName: {
    type: String,
    unique: false,
    required: false,
  },
  surName: {
    type: String,
    unique: false,
    require: false
  },
  access_token: {
    type: String,
    unique: false,
    required: false,
  },
  image: {
    type: String,
    unique: false,
    required: false,
    default: ""
  },
  permission: {
    chat: {
      С: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    },
    news: {
      С: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    },
    setting: {
      С: { type: Boolean },
      R: { type: Boolean },
      U: { type: Boolean },
      D: { type: Boolean }
    }
  },
  permissionId: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Укажите Пароль'],
    unique: false
  }
});

usersSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

usersSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

mongoose.model('users', usersSchema);
