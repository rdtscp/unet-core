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
  
      user_one: {
        type: 'string',
        required: true
      },

      user_two: {
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
  
      num_msgs: {
        type: 'integer',
        defaultsTo: '0'
      },

      // List of all messages in the chat.
      messages: {
          collection: 'Message',
          via: 'chat'
      },
  
      // Function that returns the user requesting this data's friend username.
      friend: function (currUserID) {
        switch (currUserID) {
          // If the requesting user is user_one, return user_two's User model.
          case this.user_one:
            User.findOne({id: this.user_two}).exec((err, user) => {
              if (err) return Utils.errorJson(err);
              if (user) return user;
              else return Utils.return_error('User does not exist.');
            });
          // Else the user is user_two, return user_one's User model.
          default:
            User.findOne({id: this.user_one}).exec((err, user) => {
              if (err) return Utils.errorJson(err);
              if (user) return user;
              else return Utils.return_error('User does not exist.');
            });
        }
      }
  
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
  
  