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

module.exports = {

    /* 'post /unet/friendship/get'
     * Returns a list of friendships relavent to the requester.
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
                // Get Users if they exist.
                Friendship.getUsers({id: device.owner}, {username: requestedUser}, (err, sender, receiver) => {
                    if (err) return res.json(return_error(err));
                    if (sender && receiver) {
                        // Create new Friendship.
                        Friendship.create({
                            sender: sender.id,
                            receiver: receiver.id
                        }).exec((err, newFriendship) => {
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

    destroy: function (req, res) {

    },
    
    update: function (req, res) {

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