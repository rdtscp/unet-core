/**
 * Friendship.js
 *
 * @description :: Model to represent a friendship between two users.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'unet',
  identity: 'Friendship',
  attributes: {

    confirmed: {
      type: 'boolean',
      defaultsTo: false,
      required: true
    },

    sender: {
      model: 'User',
      required: true
    },

    receiver: {
      model: 'User',
      required: true
    },

  },

  /*
   * Method takes two users, and returns if a Friendship exists between them.
   */
  friendshipExists(user_one, user_two, cb) {
      // Find a friendship
      Friendship.findOne({
          or: [
            {sender: user_one, receiver: user_two, confirmed: true},
            {sender: user_two, receiver: user_one, confirmed: true}
          ]
      }).exec((err, friendship) => {
          if (err) cb(err, null);
          else cb(null, friendship);
      });
  },

  

};

