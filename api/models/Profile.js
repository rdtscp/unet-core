/**
 * Profile.js
 *
 * @description :: Represents a User's Profile.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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

  }
  
};

