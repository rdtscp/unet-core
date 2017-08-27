/**
 * User.js
 *
 * @description :: Represents a User account.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

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

  },

  beforeCreate: function (values, cb) {
    // Hash password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  },

  afterDestroy: function(destroyedRecords, cb) {
      // Destroy all dependent 
      Device.destroy({owner: _.pluck(destroyedRecords, 'id')}).exec(cb);
  },
  afterUpdate: function(updatedRecord, cb) {
      // Remove all authenticated devices. 
      Device.destroy({owner: _.pluck(updatedRecord, 'id')}).exec(cb);
  }
};

