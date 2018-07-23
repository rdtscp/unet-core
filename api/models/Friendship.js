/**
 * Friendship.js
 *
 * @description :: Model to represent a friendship between two users.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    datastore: 'unet',
    identity: 'Friendship',
    attributes: {

        createdAt: { type: 'number', autoCreatedAt: true, },
        updatedAt: { type: 'number', autoUpdatedAt: true, },
        id: { type: 'string', columnName: '_id', autoIncrement: true},

        // Profile model of User who created this Friendship.
        sender: {
            model: 'User',
            required: true
        },

        // Profile model of User who is a member of this Friendship.
        receiver: {
            model: 'User',
            required: true
        },

        confirmed: {
            type: 'boolean',
            defaultsTo: false,
            // required: true
        },

    },

    // Takes a request, and sets its confirmed status to true.
    acceptRequest(request, cb) {
        Friendship.update(
            request,
            {confirmed: true}
        )
        .fetch()
        .exec((err, newFriendship) => {
            if (err) cb(err, null);
            else cb(null, newFriendship);
        });
    },


    
    /*****************************************\
                   LEGACY CODE
    \*****************************************/

    // Method takes a user, and a list of Profiles, and returns a subset of Profile ID's that the user is friends with.
    areFriends(user, friendsProfiles, cb) {
        var tasks = [];
        var output = [];
        for (var i=0; i < friendsProfiles.length; i++) {
            var currProfile = friendsProfiles[i];
            tasks.push(
                Friendship.friendshipExists(user.profile, currProfile, (err, friendship) => {
                    if (friendship) {
                        output.push(currProfile.id);
                        console.log('add')
                        console.log(output)
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

    // Method takes two users profiles, and returns if a Friendship exists between them.
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

