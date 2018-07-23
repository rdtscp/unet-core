/**
 * Chat.js
 *
 * @description :: Model to represent a chat between two users.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  
    datastore: 'unet',
    identity: 'Chat',
    attributes: {

        createdAt: { type: 'number', autoCreatedAt: true, },
        updatedAt: { type: 'number', autoUpdatedAt: true, },
        id: { type: 'string', columnName: '_id', autoIncrement: true},

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
            model: 'User',
        },
    
        last_active: {
            type: 'string',
            defaultsTo: Utils.currDate()
        },     
  
    },

    /* Takes a user and a chatID and returns if that User is a member of that chat. */
    isMemberOf(user, chatID, cb) {
        var userChats = user.chats;
        Chat.findOne({
            id: chatID
        }).exec((err, chat) => {
            function filterByID(chat) {
                if (chat.id == chatID) return true;
                else return false;
            }
            if (err) cb(err);
            else {
                var validChats = userChats.filter(filterByID);
                if (validChats.length > 0) cb(null, true);
                else cb(null, false);
            }
        });
    },

    /* Checks if a chat exists between two users. */
    chatExists(userOne, userTwo, cb) {
        // Get all Chats, and their EserU, where the Chat's name == null.
        sails.log("chatExists()");
        Chat.find({
            and: [
                { users: { 'contains' : userOne } },
                { users: { 'contains' : userTwo } }
              ]
            
        })
        .exec((err, chats) => {
            sails.log("Finished Chat.find():");
            sails.log(err);
            sails.log(chats);
            // sails.log("FINISHED FINDING CHATS, Found: %d Chats", chats.length);
            // if (chats.length > 0)
                cb(true);
            // else
                // cb(false);

            // var output = [];
            // chats.forEach((chat) => {
            //     var user_one = chat.users[0].id;
            //     var user_two = chat.users[1].id;
            //     if ((user_one == userOne) && (user_two == userTwo)) {
            //         // Push true to indicate this chat is the same as the one between userOne and userTwo.
            //         output.push(true);
            //     }
            //     else if ((user_two == userOne) && (user_one == userTwo)) {
            //         // Push true to indicate this chat is the same as the one between userOne and userTwo.
            //         output.push(true);
            //     }
            //     else {
            //         // Push true to indicate this chat is NOT the same as the one between userOne and userTwo.
            //         output.push(false);
            //     }
            // });
            // while (true) {
            //     // If all Chats have been checked.
            //     if (output.length >= chats.length) {
            //         var exists = output.indexOf(true);
            //         if (exists > -1) {
            //             cb(true);
            //             break;
            //         }
            //         else {
            //             cb(false);
            //             break;
            //         }
            //     }
            // }
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
                    if (currChat.name == undefined) {
                        if (currChat.users[0].id == user.id) {
                            currChat.name = currChat.users[1].username;
                        } else {
                            currChat.name = currChat.users[0].username;
                        }
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
  
  