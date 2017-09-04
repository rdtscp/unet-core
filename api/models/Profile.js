/**
 * Profile.js
 *
 * @description :: Represents a User's Profile.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

  connection: 'unet',
  identity: 'Profile',
  attributes: {

    username: {
      type: 'string',
      required: true,
      unique: true,
    },

    owner: {
      model: 'User'
    },

  },

  afterCreate: function (newProfile, cb) {
    // Update the User with this new device.
    User.find().populate('profile').exec((err, popdUsers) => {
        if (err) cb(err);
        else cb();
    });
    
}
  
};

