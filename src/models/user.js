const mongoose = require('mongoose');

const validator = require('validator');

const linkRegex = /^https?:\/\/(www.)?[a-z0-9.-]{2,}\.[a-z]{2,}\/?[-._~:/?#[\]@!$&'()*+,;=\w]*#?$/;
function linkValidator(link) {
  const regex = new RegExp(linkRegex);
  return regex.test(link);
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: linkValidator,
      message: (props) => `${props.value} is not a valid link`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
