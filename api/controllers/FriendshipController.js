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
 var friendship_exists     = 'You are already friends with this user.';
 var request_already_sent  = 'You have already sent this user a request.'

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
     *     friendships: [ Array of Friendship.js models including the users populated profiles. ],
     * }
     */
    getall: function (req, res) {
        var user = req.options.user;
        Friendship.find({
            or: [
                {receiver: user.id},
                {sender: user.id, confirmed: true}
            ]
        }).populate('sender').populate('receiver').exec((err, friendships) => {
            if (err) return res.json(Utils.return_error(err));
            // Include data about which User the 'friend' is in this relationship.
            friendships.forEach((friendship) => {
                if (friendship.sender.id == user.id) {
                    friendship.friend = friendship.receiver;
                } else {
                    friendship.friend = friendship.sender;
                }
            });
            return res.json({
                err: false,
                warning: false,
                message: null,
                friendships: friendships
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
        // @TODO Implement
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
                // Check if a friendship already exists.
                Friendship.findOne({
                    or: [
                        {sender: user.id, receiver: receiver.id},
                        {sender: receiver.id, receiver: user.id}
                    ]
                }).exec((err, existingFriendship) => {
                    if (err) return res.json(Utils.return_error(err));
                    if (existingFriendship) {
                        // Check if an existing friendship exists.
                        if (existingFriendship.confirmed) {
                            return res.json({
                                err: false,
                                warning: true,
                                msg: friendship_exists
                            });
                        }
                        // Check if an acceptable request exists.
                        else if (existingFriendship.receiver == user.id && existingFriendship.confirmed == false) {
                            Friendship.acceptRequest(existingFriendship, (err, newFriendship) => {
                                if (err) return res.json(Utils.return_error(err));
                                if (friendship) {
                                    return res.json({
                                        err: false,
                                        warning: false,
                                        msg: 'Friend request accepted.',
                                        friendship: newFriendship
                                    });
                                } else {
                                    return res.json({
                                        err: false,
                                        warning: true,
                                        msg: 'Friend request does not exist.'
                                    });
                                }
                            });
                        // No existing friendship + no acceptable request means user already sent request.
                        } else {
                            return res.json({
                                err: false,
                                warning: true,
                                msg: request_already_sent
                            });
                        }
                    } else {
                        // Create new Friendship.
                        Friendship.create({
                            sender: user.id,
                            receiver: receiver.id
                        })
                        .fetch()
                        .exec((err, newFriendship) => {
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
        })
        .fetch()
        .exec((err, destroyedFriendship) => {
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
        Friendship.acceptRequest({id: requestID, receiver: user.id}, (err, newFriendship) => {
            if (err) return res.json(Utils.return_error(err));
            if (newFriendship) {
                return res.json({
                    err: false,
                    warning: false,
                    msg: 'Friend request accepted.',
                    friendship: newFriendship
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