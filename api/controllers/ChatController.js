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
        var user          = req.options.user;
        Profile.findOne({
            id: user.profile.id
        }).populate('chats').exec((err, profile) => {
            return res.json(profile.chats)
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
            else {
                Chat.retrieveMessages(chat.id, chat.num_msgs, (err, messages) => {
                    if (err) return res.json(Utils.return_error(err));
                    return res.json({
                        err: false,
                        warning: false,
                        message: null,
                        chat: chat,
                        messages: messages
                    });
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
                if (!exist) {
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
    }
	
};

