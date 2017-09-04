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

  // Returns input list with new attribute 'friend' which contains the model for the friend.
  getFriend(currUser, friendships, cb) {
      var tasks = [];
      var output = [];
      for (var i=0; i < friendships.length; i++) {
          var friendship = friendships[i];
          switch (currUser.id) {
              // If the requesting user is the sender, set 'friend' to the receiver.
              case friendship.sender:
                  var editedFriendship = friendship;
                  editedFriendship.friend = editedFriendship.receiver;
                  tasks.push(
                      output.push(editedFriendship)
                  );
              // Else the requesting user is the receiver, set 'friend' to the sender.
              default:
                  var editedFriendship = friendship;
                  editedFriendship.friend = editedFriendship.sender;
                  tasks.push(
                      output.push(editedFriendship)
                  );
          }
      }
      return Promise
      .all(tasks)
      .then(result => {
          cb(output);
      });
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

