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

 // Destroy messages.
 var friend_removed_msg    = 'Succesfully removed Friend';

module.exports = {

    /* 'post /unet/friendship/get'
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
    get: function (req, res) {
        var authToken     = req.param('token');
        Device.findOne({
            token: authToken
        }).exec((err, device) => {
            Friendship.find({
                or: [
                    {receiver: device.owner},
                    {sender: device.owner, confirmed: true}
                ]
            }).exec((err, friendships) => {
                return res.json({
                    err: false,
                    warning: false,
                    message: null,
                    friendships: friendships
                })
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
        var authToken     = req.param('token');
        var requestedUser = req.param('username');
        // Check if current request is authenticated.
        Device.findOne({
            token: authToken
        }).exec((err, device) => {
            if (err) return res.json(return_error(err));
            if (device) {
                // Check Users required for this Friendship exist.
                Friendship.getUsers({id: device.owner}, {username: requestedUser}, (err, sender, receiver) => {
                    if (err) return res.json(return_error(err));
                    if (sender && receiver) {
                        // Create new Friendship.
                        Friendship.create({
                            sender: sender.id,
                            receiver: receiver.id
                        }).exec((err, newFriendship) => {
                            if (err) return res.json(return_error(err));
                            return res.json({
                                err: false,
                                warning: false,
                                msg: sent_request_msg,
                                friendship: newFriendship
                            });
                        });
                    } else {
                        return res.json({
                            err: false,
                            warning: true,
                            msg: device_unauth_msg,
                            friendship: null
                        });
                    }
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: device_unauth_msg,
                    friendship: null
                });
            }
        });
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
     * 
     */
    destroy: function (req, res) {
        // Parse POST for User params.
        var authToken     = req.param('token');
        var requestedUser = req.param('username');
        // Check if current request is authenticated.
        Device.findOne({
            token: authToken
        }).exec((err, device) => {
            if (err) return res.json(return_error(err));
            if (device) {
                // Check Users required for this Friendship exist.
                Friendship.getUsers({id: device.owner}, {username: requestedUser}, (err, sender, receiver) => {
                    if (err) return res.json(return_error(err));
                    if (sender && receiver) {
                        // Destroy Friendship.
                        Friendship.destroy({
                            or: [
                                {sender: sender.id, receiver: receiver.id},
                                {sender: receiver.id, receiver: sender.id}
                            ]
                        }).exec((err, destroyedFriendship) => {
                            if (err) return res.json(return_error(err));
                            return res.json({
                                err: false,
                                warning: false,
                                msg: friend_removed_msg,
                                friendship: destroyedFriendship
                            });
                        });
                    } else {
                        return res.json({
                            err: false,
                            warning: true,
                            msg: device_unauth_msg,
                            friendship: null
                        });
                    }
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: device_unauth_msg,
                    friendship: null
                });
            }
        });
    },
    
    update: function (req, res) {
        // Not implemented.
    }
	
};

// Returns json error format.
function return_error(err) {
    return {
        err: true,
        warning: false,
        msg: err,
        friendship: null
    }
}