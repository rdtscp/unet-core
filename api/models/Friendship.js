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
    }

  },

  /*
   * Takes some JSON representation of a User that sent and User to receive a Friendship request, and tries to fetch them.
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

