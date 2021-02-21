const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const getAuthToken = require('registry-auth-token')
const getRegistryUrl = require('registry-auth-token/registry-url')
const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: 'Email is a required',
            unique: true,
            lowercase: true,
            match: [EMAIL_PATTERN, 'Invalid email. It should content @ and .'],
            trim: true
        },

        username: {
            type: String,
            required: 'Username is required',
            unique: true
        },

        password: {
            type: String,
            required: 'Password is required',
            match: [
                PASSWORD_PATTERN, 'Your password must have at least one upperCase, one lowerCase,one number and 8 characters'
            ]
        },

        role: {
            type: String,
            enum: ['admin','user','owner'],
            default: 'user'
        }


    }
)

const User = mongoose.model("User", userSchema);
module.exports = User;