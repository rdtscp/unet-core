/**
 * User.js
 *
 * @description :: Represents a User account.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'unet',
  identity: 'User',
  attributes: {

    username: {
      type: 'string',
      required: true,
      unique: true,
    },
    
    password: {
      type: 'string',
      required: true,
    },

    devices: {
      collection: 'Device',
      via: 'owner'
    }

  }
};

