/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /* 'post /unet/chat/get/all'
     * Returns a list of chats that the requester is part of.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to retrieve chats.' ],
     *     chats: [ Array of Chat.js models ]
     * }
     */
    getall: function (req,res) {
        var authToken     = req.param('token');
        var userID        = req.options.userid;
        Chat.find({
            or: [
                {user_one: userID},
                {user_two: userID}
            ]
        }).exec((err, chats) => {
            if (err) return res.json(Utils.return_error(err));
            return res.json({
                err: false,
                warning: false,
                message: null,
                friendships: chats
            })
        });
    },

    /* 'post /unet/chat/get'
     * Returns a chat requested by ID.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to retrieve chat.' ],
     *     chats: Chat.js model
     * }
     */
    get: function (req, res) {
        var chatID  = req.param('id');
        Chat.findOne({
            id: chatID
        }).exec((err, chat) => {
            if (err) return res.json(Utils.return_error(err));
            return res.json({
                err: false,
                warning: false,
                message: null,
                chat: chat
            })
        });
    },

    /* 'post /unet/chat/create
     * Creates a chat model between two Users.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Requested to create chat with User does not exist' | 'Chat created' ],
     *     chat: Newly created Chat.js model.
     * }
     */
    create: function (req, res) {
        // Parse POST for User params.
        var requestedUser = req.param('username');
        var userID        = req.options.userid;
        // Check a friendship exists between the requested Users.
        User.findOne({
            username: requestedUser
        }).exec((err, friend) => {
            if (err) return res.json(Utils.return_error(err));
            // If the friendship exists.
            if (friend) {
                Friendship.friendshipExists(userID, friend.id, (err, friendship) => {
                    if (err) return res.json(Utils.return_error(err));
                    if (friendship) {
                        Chat.create({
                            user_one: userID,
                            user_two: friend.id
                        }).exec((err, chat) => {
                            if (err) return res.json(Utils.return_error(err));
                            return res.json({
                                err: false,
                                warning: false,
                                msg: 'Created new chat',
                                chat: chat
                            });
                        });
                    } else {
                        return res.json({
                            error: false,
                            warning: true,
                            msg: 'Cannot create chat with a User you are not friends with.'
                        })
                    }
                })
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: 'Requested to create chat with User does not exist'
                })
            }
        });
    },

    destroy: function (req, res) {
        // Not implemented.
    },

    update: function (req, res) {
        // @TODO Implement
    }
	
};

