const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Firstname is required.'],
      unique: true,
    },
    lastname: {
      type: String,
      required: [true, 'Lastname is required.'],
      unique: true,
    },
    phonenumber: {
      type: String,
      trim: true,
      unique: true,
      default: 'Add a phone number'
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      lowercase: true,
      trim: true,
      match: [EMAIL_PATTERN, 'Email inválido'],
      unique: true,
    },

    password: {
      type: String,
      match: [PASSWORD_PATTERN, 'Tu contraseña debe conteneral menos 1 número, 1 mayúscula, 1 minúscula y 8 caracteres'],
      required: [true, 'Password is required.'],
    },
    image: {
      type: String,
      default: 'http://ssl.gstatic.com/accounts/ui/avatar_2x.png'
    }
    ,
    role: {
        type: String,
        enum: ['admin','user','owner'],
        default: 'user'
    },

    active: {
      type: Boolean,
      default: false
    },

    activationToken: {
      type: String,
      default: () => uuidv4()
    }
  }
);

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password)
}

userSchema.pre('save', function(next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then(hash => {
        this.password = hash
        next()
      })
  } else {
    next()
  }
})

/* userSchema.pre('updateOne', function(next) {
    bcrypt.hash(this.user.password, SALT_ROUNDS)
      .then(hash => {
        this.password = hash
        next()
      })
}) */

module.exports = model('User', userSchema);