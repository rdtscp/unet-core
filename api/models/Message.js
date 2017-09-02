/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'unet',
  identity: 'Message',
  attributes: {

    chat: {
      model: 'Chat'
    },

    timestamp: {
      type: 'string',
    },

    message: {
      type: 'longtext'
    },

    message_num: {
      type: 'integer',
    },

    sender: {
      type: 'string',
      required: true
    }

  },

  // Called before a Message model is created, will 
  beforeCreate: function (values, cb) {
    Chat.findOne({
      id: values.chat
    }).exec((err, chat) => {
      if (err) cb(err);
      if (chat) {
        values.message_num = chat.num_msgs + 1;
        cb();
      } else {
        cb('Attempted to send a message to a chat that does not exist.');
      }
    });
  },

  afterCreate: function (newlyInsertedRecord, cb) {
    var msg = newlyInsertedRecord.message.substring(0,26);
    Chat.update(
      {id: newlyInsertedRecord.chat},
      {num_msgs: newlyInsertedRecord.message_num, last_msg: msg, lastSender: newlyInsertedRecord.sender }
    ).exec((err, chat) => {
      if (err) cb(err);
      if (chat) {
        // Update the Chat with this new message.
        Chat.find().populate('messages').exec((err, popdUsers) => {
          if (err) cb(err);
          else cb();
        });
      } else {
        cb('Attempted to send a message to a chat that does not exist.');
      }
    })
  }



};

