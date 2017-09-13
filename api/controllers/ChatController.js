/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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
        var user    = req.options.user;
        Chat.isMemberOf(user, chatID, (err, member) => {
            if (err) return res.json(turn_error(err));
            else if (!member) {
                return res.json({
                    err: false,
                    warning: true,
                    message: 'You are not permitted to get this chat.'
                });
            } else {
                Chat.findOne({
                    id: chatID
                }).populateAll().exec((err, chat) => {
                    if (err) return res.json(Utils.return_error(err));
                    if (chat) {
                        if (chat.name == undefined) {
                            if (chat.users[0].id == user.id) {
                                chat.name = chat.users[1].username;
                                return res.json({
                                    err: false,
                                    warning: false,
                                    message: null,
                                    chat: chat
                                });
                            } else {
                                chat.name = chat.users[0].username;
                                return res.json({
                                    err: false,
                                    warning: false,
                                    message: null,
                                    chat: chat
                                });
                            }
                        } else {
                            return res.json({
                                err: false,
                                warning: false,
                                message: null,
                                chat: chat
                            });
                        }
                    } else {
                        return res.json({
                            err: false,
                            warning: true,
                            message: 'Chat requested does not exist.'
                        });
                    }
                });
            }
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
        var chatName      = req.param('chatName');
        var members       = req.param('members');
        var user          = req.options.user;

        

        // Push current user into chat members.
        members.push(user.id);

        // Validate input.
        if (members.length < 2) {
            return res.json({
                err: false,
                warning: true,
                msg: 'Cannot create a chat with less than 2 people.'
            })
        }
        // Check if a chat already exists between these two users.
        else if (members.length == 2) {
            // See if a chat exists between these two users already.
            var userOne = members[0];
            var userTwo = members[1];
            Chat.chatExists(userOne, userTwo, (exists) => {
                if (!exists) {
                    // @TODO Check that requesting user is indeed friends with all members.
                    Chat.create({
                        name: undefined
                    }).exec((err, newChat) => {
                        if (err) return res.json(Utils.return_error(err));
                        // Add members to chat.
                        newChat.users.add(members);
                        newChat.save((err) => {if (err) console.log(err)});
                        return res.json({
                            err: false,
                            warning: false,
                            msg: 'Created new chat',
                            chat: newChat
                        });
                    });
                } else {
                    return res.json({
                        err: false,
                        warning: true,
                        msg: 'You already have a private chat with this user.'
                    });
                }
            })
            
        }
        // Else its a group chat, so make one.
        else {
            // @TODO Check that requesting user is indeed friends with all members.
            Chat.create({
                name: chatName
            }).exec((err, newChat) => {
                if (err) return res.json(Utils.return_error(err));
                // Add members to chat.
                newChat.users.add(members);
                newChat.save((err) => {if (err) console.log(err)});
                return res.json({
                    err: false,
                    warning: false,
                    msg: 'Created new chat',
                    chat: newChat
                });
            });
        }        
    },

    destroy: function (req, res) {
        // Not implemented.
    },

    update: function (req, res) {
        // @TODO Implement
    },

    /* Socket: 'post /unet/chat/subscribe'
     * Returns a chat requested by ID.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to subscribe to chat.' ]
     * }
     */
    subscribe: function (req, res) {
        // Only allow socket connections here.
        if (req.isSocket) {
            var chatID  = req.body[1];
            var user    = req.options.user;
            Chat.isMemberOf(user, chatID, (err, member) => {
                if (err) return res.json(Utils.return_error(err));
                // Subscribe socket to this chat.
                sails.sockets.join(req, chatID, (err) => { if (err) console.log(err); });
            });
        }
    }
	
};

