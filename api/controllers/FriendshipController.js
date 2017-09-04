/**
 * FriendshipController
 *
 * @description :: Server-side logic for managing Friends relationships.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 // Auth messages.
 var device_unauth_msg     = 'This device is not authorised to perform that action.';

 // Create messages.
 var user_exist_msg        = 'Requested user does not exist';
 var sent_request_msg      = 'Friend request sent';
 var friendship_exists     = 'You have already sent this user a request, or they are already your friend.';

 // Destroy messages.
 var friend_removed_msg    = 'Succesfully removed Friend';

module.exports = {

    /* 'post /unet/friendship/get/all'
     * Returns a list of friendships related to the requester.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to retrieve Friendships' ],
     *     friendships: [ Array of Friendship.js models ]
     * }
     */
    getall: function (req, res) {
        var user = req.options.user;
        Friendship.find({
            or: [
                {receiver: user.id},
                {sender: user.id, confirmed: true}
            ]
        }).exec((err, friendships) => {
            if (err) return res.json(Utils.return_error(err));
            Friendship.getFriend(user, friendships, (out_friendships) => {
                return res.json({
                    err: false,
                    warning: false,
                    message: null,
                    friendships: out_friendships
                });
            });
        });
    },

    /* 'post /unet/friendship/get'
     * Returns a friendship.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to retrieve Friendship' ],
     *     friendship: Friendship.js model
     * }
     */
    get: function (req, res) {
        var friendshipID  = req.param('id');
        Friendship.findOne({
            id: friendshipID
        }).exec((err, friendship) => {
            if (err) return res.json(Utils.return_error(err));
            Friendship.getFriend(user, friendship, (out_friendship) => {
                return res.json({
                    err: false,
                    warning: false,
                    message: null,
                    friendships: out_friendship
                });
            });
        });
    },
    
    /* 'post /unet/friendship/create'
     * Creates a Friendship model between two Users.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Requested user does not exist' | 'Friend request sent' ],
     *     friendship: Newly created Friendship model.
     * }
     */
    create: function (req, res) {
        // Parse POST for User params.
        var requestedUser = req.param('username');
        var user          = req.options.user;
        if (requestedUser == user.username) return res.json({err: false, warning: true, msg: 'You cannot add yourself as a friend!'})
        // Check Users required for this Friendship exist.
        User.findOne({
            username: requestedUser
        }).exec((err, receiver) => {
            if (err) return res.json(Utils.return_error(err));
            if (receiver) {
                // Check if a request already exists.
                Friendship.findOne({
                    sender: user.id,
                    receiver: receiver.id
                }).exec((err, existingFriendship) => {
                    if (err) return res.json(Utils.return_error(err));
                    if (existingFriendship) {
                        return res.json({
                            err: false,
                            warning: true,
                            msg: friendship_exists,
                            friendship: existingFriendship
                        });
                    } else {
                        // Create new Friendship.
                        Friendship.create({
                            sender: user.id,
                            receiver: receiver.id
                        }).exec((err, newFriendship) => {
                            if (err) return res.json(Utils.return_error(err));
                            return res.json({
                                err: false,
                                warning: false,
                                msg: sent_request_msg,
                                friendship: newFriendship
                            });
                        });
                    }
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: user_exist_msg,
                    friendship: null
                });
            }
        })
    },

    /* 'post /unet/friendship/destroy'
     * Destroys a Friendship model between two Users.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to remove friend' | 'Succesfully removed friend' ],
     *     friendship: Friendship destroyed.
     * }
     */
    destroy: function (req, res) {
        // Parse POST for User params.
        var friendshipID  = req.param('id');
        var user          = req.options.user;
        // Destroy Friendship.
        Friendship.destroy({
            or: [
                {id: friendshipID, sender: user.id},
                {id: friendshipID, receiver: user.id}
            ]
        }).exec((err, destroyedFriendship) => {
            if (err) return res.json(Utils.return_error(err));
            return res.json({
                err: false,
                warning: false,
                msg: friend_removed_msg,
                friendship: destroyedFriendship
            });
        });
    },
    
    /* 'post /unet/friendship/update'
     * Updates a Friendship model between two Users.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Friend request Accepted' ],
     *     friendship: Friendship updated.
     * }
     */
    update: function (req, res) {
        // Parse POST for params.
        var requestID   = req.param('id');
        var user        = req.options.user;
        Friendship.update(
            {id: requestID, receiver: user.id, confirmed: false },
            {confirmed: true}
        ).exec((err, friendship) => {
            if (err) return res.json(Utils.return_error(err));
            if (friendship) {
                return res.json({
                    err: false,
                    warning: false,
                    msg: 'Friend request accepted.',
                    friendship: friendship
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: 'Friend request does not exist.'
                });
            }
        });
    }
	
};