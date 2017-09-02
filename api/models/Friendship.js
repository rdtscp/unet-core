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
      type: 'string',
      required: true
    },

    receiver: {
      type: 'string',
      required: true
    },

    // Function that returns the user requesting this data's friend username.
    friend: function (currUserID) {
      switch (currUserID) {
        case this.sender:
          return this.receiver;
        default:
          return this.sender;
      }
    }

  },

  /*
   * Method takes two users, and returns them (if they exist).
   *  
   * sender:   JSON representation of the User that sent a specific request.
   * receiver: JSON representation of the User that has/is to receive the request
   * 
   */
  getUsers: function(sender, receiver, cb) {
    var tasks = [];
    var out_sender;
    var out_receiver;
    tasks.push(
        User.findOne(sender).then((user) => {
            if (user) out_sender = user;
            return;
        })
    );
    tasks.push(
      User.findOne(receiver).then((user) => {
          if (user) out_receiver = user;
          return;
      })
    );
    return Promise
    .all(tasks)
    .then(result => {
        if (out_sender && out_receiver) cb(null, out_sender, out_receiver);
        else if (!out_receiver) cb('Requested user does not exist.', null, null);
        else cb('Error: User that sent request could not be retrieved.', null, null);
    });

  },

};

