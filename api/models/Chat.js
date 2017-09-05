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
            type: 'string',
            required: true
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

    // Returns input list with new attribute 'friend' which contains the model for the friend.
    getFriend(currUser, chats, cb) {
        var tasks = [];
        var output = [];
        for (var i=0; i < chats.length; i++) {
            var chat = chats[i];
            switch (currUser.id) {
                // If the requesting user is user_one, return user_two's User model.
                case chat.user_one:
                    tasks.push(
                        User.findOne({id: chat.user_two}).then((user) => {
                            var out_chat = chat;
                            out_chat.friend = { username: user.username, id: user.id };
                            output.push(out_chat);
                            return;
                        })
                    );
                // Else the user is user_two, return user_one's User model.
                default:
                    tasks.push(
                        User.findOne({id: chat.user_one}).then((user) => {
                            var out_chat = chat;
                            out_chat.friend = { username: user.username, id: user.id };
                            output.push(out_chat);
                            return;
                        })
                    );
            }
        }
        return Promise
        .all(tasks)
        .then(result => {
            cb(output);
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
  
  