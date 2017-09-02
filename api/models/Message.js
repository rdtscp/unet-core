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
      required: true
    },

    message: {
      type: 'longtext'
    },

    message_num: {
      type: 'integer',
      required: true
    },

  }
};

