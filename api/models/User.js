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

  // Called before a User model is created, will hash the password; returns error if hashing fails.
  beforeCreate: function (values, cb) {
    // Hash password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      cb();
    });
  },

  // Called before updating a User model, if the password is being updated, it will be hashed; returns error if hashing fails.
  beforeUpdate: function(valuesToUpdate, cb) {
      if (valuesToUpdate.password) {
        // Hash password
        bcrypt.hash(valuesToUpdate.password, 10, function(err, hash) {
          if(err) return cb(err);
          valuesToUpdate.password = hash;
          cb();
        });
      } else {
        cb();
      }
  },

  afterUpdate: function(updatedRecord, cb) {
      // Remove all authenticated devices.
      Device.destroy({owner: updatedRecord.id}).exec(cb);
  },

  afterDestroy: function(destroyedRecords, cb) {
      // Destroy all dependent 
      Device.destroy({owner: _.pluck(destroyedRecords, 'id')}).exec(cb);      
  },

  
};

