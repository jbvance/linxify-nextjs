'use strict';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' }
});

UserSchema.methods.serialize = function () {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    id: this._id || ''
  };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

export default mongoose.models.User || User;
