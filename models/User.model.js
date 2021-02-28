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
      
    },
    lastname: {
      type: String,
      required: [true, 'Lastname is required.'],
      
    },
    phonenumber: {
      type: String,
      trim: true,
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
      match: [PASSWORD_PATTERN, 'Your password must contain at least 1 number, 1 uppercase, 1 lowercase and 8 characters'],
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

module.exports = model('User', userSchema);