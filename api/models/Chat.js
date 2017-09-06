/**
 * Chat.js
 *
 * @description :: Model to represent a chat between two users.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  
    connection: 'unet',
    identity: 'Chat',
    attributes: {

        // List of Profiles in this chat.
        users: {
            collection: 'User',
            via: 'chats'
        },

        // List of all messages in the chat.
        messages: {
            collection: 'Message',
            via: 'chat'
        },

        name: {
            type: 'string'
        },

        last_msg: {
            type: 'string',
            defaultsTo: 'You are now connected!'
        },
    
        last_sender: {
            type: 'integer'
        },
    
        last_active: {
            type: 'string',
            defaultsTo: Utils.currDate()
        },     
  
    },

    chatExists(userOne, userTwo, cb) {
        // Get all Chats, and their EserU, where the Chat's name == null.
        Chat.find().populate('users', {name: null}).exec((err, chats) => {
            var output = [];
            chats.forEach((chat) => {
                var user_one = chat.users[0].id;
                var user_two = chat.users[1].id;
                if ((user_one == userOne) && (user_two == userTwo)) {
                    // Push true to indicate this chat is the same as the one between userOne and userTwo.
                    output.push(true);
                }
                else if ((user_two == userOne) && (user_one == userTwo)) {
                    // Push true to indicate this chat is the same as the one between userOne and userTwo.
                    output.push(true);
                }
                else {
                    // Push true to indicate this chat is NOT the same as the one between userOne and userTwo.
                    output.push(false);
                }
            });
            var exists = output.indexOf(true);
            if (exists > -1) cb(true);
            else cb(false);
        });
    },

    // Takes a user, and returns its chats with relative chat names.
    populateChatNames(user, cb) {
        var output   = [];
        var requests = [];
        for (var i=0; i < user.chats.length; i++) {
            requests.push(
                Chat.findOne({
                    id: user.chats[i].id
                }).populate('users').then((currChat) => {
                    if (currChat.users[0].id == user.id) {
                        currChat.name = currChat.users[1].username;
                    } else {
                        currChat.name = currChat.users[0].username;
                    }
                    output.push(currChat);
                    return currChat;
                })
            );
        }
        return Promise
                .all(requests)
                .then(result => {
                    cb(null, output); 
                })
                .catch((err) => {
                    console.log(err);
                });
    },

    // Retrieves the next 10 messages starting from message# startingNum in chat chatID.
    retrieveMessages(chatID, startingNum, cb) {
      Message.find({
        chat: chatID,
        message_num: { '<=': startingNum, '>': (startingNum - 10)}
      }).exec((err, messages) =>  {
        if (err) cb(err, null);
        cb(null, messages);
     });
    }
  
  };
  
  