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
      model: 'User',
      unique: true,
    },

  },

  // After a Profile has been created, link it to its User.
  afterCreate: function(newlyInsertedRecord, cb) {
      User.update(newlyInsertedRecord.owner,{profile: newlyInsertedRecord}).exec(cb);
  },

};

