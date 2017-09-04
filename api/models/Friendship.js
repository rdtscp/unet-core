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
              // If the requesting user is user_one, return user_two's User model.
              case friendship.sender:
                  tasks.push(
                      User.findOne({id: friendship.receiver}).then((user) => {
                          var out_friendship = friendship;
                          out_friendship.friend = user.id;
                          output.push(out_chat);
                          return;
                      })
                  );
              // Else the user is user_two, return user_one's User model.
              default:
                  tasks.push(
                      User.findOne({id: friendship.sender}).then((user) => {
                          var out_friendship = friendship;
                          out_friendship.friend = user.id;
                          output.push(out_friendship);
                          return;
                      })
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

