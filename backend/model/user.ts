'use strict';

import crypto = require('crypto');
import mongoose = require('mongoose');
import passwordGenerator = require('password-generator');
import Moment = moment.Moment;

const cs = require('../controllers/auth/constants');

const userSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, unique: true},
  emailConfirmed: {type:Boolean, default: false},
  password: String,
  salt: String,
  emailVerifyToken: {
    value: String,
    exp: Date
  },
  passwordResetToken: {
    value: String,
    exp: Date
  },
  forgotPasswordToken: {
    value: String,
    exp: Date
  },

  google: Object,
  facebook: Object,

  profile: {
    firstname: {type: String, default: ''},
    lastname: {type: String, default: ''},
    gender: {type: String, default: ''},
    language: {type: String, default: ''},
    picture: {
      url: {type: String, default: ''},
      source: {type: String, default: ''}
    }
  }
}, {timestamps: true});

/**
 * Generate hash based on <code>crypto.pbkdf2('sha512')</code> algorithm
 * @private
 * @param {string} password
 * @param {string} salt
 * @returns {Promise.<Object>|null|error} On success the promise will be resolved with object<br>
 *   <code>{ salt: buffer, hash: buffer }</code>
 *   On error the promise will be rejected with an null if password argument not exist
 *   and with a error if <code>crypto.pbkdf2()</code> function throw error
 */
function getHash(password, salt) {
  return new Promise((resolve, reject) => {
    if (!password || !salt) {
      reject(null);
    }
    let saltStr = salt;
    let length = 512;
    crypto.pbkdf2(password, saltStr, 100000, length, 'sha512', (err, hashStr) => {
      if (err) {
        reject(err);
      }
      resolve(hashStr.toString('hex'));
    });
  });
}

/**
 * Compare passwords based on their hashes
 * @private
 * @param {string} password
 * @param {string} hash
 * @param {string} salt
 * @returns {Promise.<boolean>|null} On success the promise will be resolved with boolean value
 *   On error the promise will be rejected with an null if password, salt or hash arguments not exist
 */
function compareHash(password, hash, salt) {
  if (!password || !hash || !salt) {
    return null;
  }
  return getHash(password, salt).then((generatedHash) => {
    return hash === generatedHash;
  });
}

userSchema.methods.cryptPassword = function () {
  this.salt = crypto.randomBytes(128).toString('hex');
  return getHash(this.password, this.salt).then((hash) => {
    this.password = hash;
  });
};

userSchema.methods.checkPassword = function (password) {
  return compareHash(password, this.password, this.salt).then((result) => {
    return result;
  });
};

userSchema.methods.createPassword = function () {
  this.password = passwordGenerator(cs.passwordMinLength, false, /[\w\d\W\!\@\#\$\%\^\&\*\(\)\=\_\+\,\.\/\<\>\?\;\'\:\"\|\{\}]/);
  return this.password;
};

module.exports = mongoose.model('User', userSchema);