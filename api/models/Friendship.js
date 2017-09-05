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
      model: 'Profile',
      required: true
    },

    receiver: {
      model: 'Profile',
      required: true
    },

  },

  acceptRequest(request, cb) {
      Friendship.update(
        request,
        {confirmed: true}
      ).exec((err, newFriendship) => {
          if (err) cb(err, null);
          else cb(null, newFriendship);
      });
  },

  /* 
   * Method takes a user, and a list of Profiles, and returns a subset of Profile ID's that the user is friends with.
   */
  areFriends(user, friendsProfiles, cb) {
      var tasks = [];
      var output = [];
      for (var i=0; i < friendsProfiles.length; i++) {
        var currProfile = friendsProfiles[i];
        tasks.push(
            friendshipExists(user.profile, currProfile, (err, friendship) => {
                if (friendship) {
                    output.push(currProfile.id);
                    return;
                } else {
                    output.push(null);
                    return;
                }
            })
        );
      }
      return Promise
      .all(tasks)
      .then(result => {
          cb(output);
      }).catch((err) => {
          console.log(err);
      });
  },

  /*
   * Method takes two users profiles, and returns if a Friendship exists between them.
   */
  friendshipExists(user_oneProfile, user_twoProfile, cb) {
      // Find a friendship
      Friendship.findOne({
          or: [
            {sender: user_oneProfile.id, receiver: user_twoProfile.id, confirmed: true},
            {sender: user_twoProfile.id, receiver: user_oneProfile.id, confirmed: true}
          ]
      }).exec((err, friendship) => {
          if (err) cb(err, null);
          else cb(null, friendship);
      });
  },

  

};

