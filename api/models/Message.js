/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    datastore: 'unet',
    identity: 'Message',
    attributes: {

        createdAt: { type: 'number', autoCreatedAt: true, },
        updatedAt: { type: 'number', autoUpdatedAt: true, },
        id: { type: 'string', columnName: '_id', autoIncrement: true},

        // The Chat model this Message belongs to.
        chat: {
            model: 'Chat'
        },

        // The Profile model this Message want created using.
        sender: {
            model: 'Profile'
        },

        // Populted using lifecycle callbacks.
        message_num: {
            type: 'number'
        },

        timestamp: {
            type: 'string',
            defaultsTo: Utils.currDate()
        },

        username: {
            type: 'string',
            required: true
        },

        message: {
            type: 'string'
        }

    },

    // Called before a Message model is created, gets its parent chats number of messages.
    beforeCreate: function (values, cb) {
        Chat.findOne({
            id: values.chat
        }).populate('messages').exec((err, chat) => {
            if (err) cb(err);
            if (chat) {
                values.message_num = chat.messages.length + 1;
                cb();
            } else {
                cb('Attempted to send a message to a chat that does not exist.');
            }
        });
    },

};

