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
            if (err) return res.json(Utils.return_error(err));
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
                        if (chat.name == "") {
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

        sails.log("Trying to Create Chat: " + chatName);

        // Validate chat name.
        var uname_regexp = /^.{3,26}$/
        if (chatName.search(uname_regexp) == -1) {
            return res.json({
                err: false,
                warning: true,
                msg: 'Chat name must be between 3 and 26 characters.'
            });
        }

        sails.log("Chat Name is Valid: " + chatName);

        // Push current user into chat members.
        members.push(user.id);

        sails.log("Chat Has " + members.length + " Members");

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
            sails.log("Checking if Chat Exists");
            Chat.chatExists(userOne, userTwo)
            .then(exists => {
                if (exists) {
                    return res.json({
                        err: false,
                        warning: true,
                        msg: 'You already have a private chat with this user.'
                    });
                }
                else {
                    // @TODO Check that requesting user is indeed friends with all members.
                    Chat.create({
                        name: "",
                        users: members
                    })
                    .fetch()
                    .exec((err, newChat) => {
                        if (err) return res.json(Utils.return_error(err));
                        // Add members to chat.
                        // newChat.users.addToCollection(members);
                        // newChat.replaceCollection((err) => {if (err) sails.log(err)});
                        return res.json({
                            err: false,
                            warning: false,
                            msg: 'Created new chat',
                            chat: newChat
                        });
                    });
                }
            })
            .catch(error => {
                sails.log(error);
                return res.json({
                    err: false,
                    warning: true,
                    msg: 'You already have a private chat with this user.'
                });
            });
            
        }
        // Else its a group chat, so make one.
        else {
            // @TODO Check that requesting user is indeed friends with all members.
            Chat.create({
                name: chatName
            })
            .fetch()
            .exec((err, newChat) => {
                if (err) return res.json(Utils.return_error(err));
                // Add members to chat.
                newChat.users.addToCollection(members);
                newChat.replaceCollection((err) => {if (err) console.log(err)});
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
        sails.log("Request to Subscribe to Chat...");
        // Only allow socket connections here.
        if (req.isSocket) {
            var chatID  = req.body[1];
            var user    = req.options.user
            sails.log("\t\tID:\t%d", chatID);

            Chat.isMemberOf(user, chatID, (err, member) => {
                if (err) return res.json(Utils.return_error(err));
                // Subscribe socket to this chat.
                if (member) sails.sockets.join(req, chatID, (err) => { if (err) console.log(err); });
            });
        }
    }
	
};

