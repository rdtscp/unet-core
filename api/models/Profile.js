/**
 * Profile.js
 *
 * @description :: Represents a User's Profile.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'unet',
    identity: 'Profile',
    attributes: {

        // Contains a single ID to its owner.
        owner: {
            model: 'User',
            unique: true,
        },

        // Contains a list of Chat models this Profile is a member of.
        chats: {
            collection: 'Chat',
            via: 'users'
        },

        username: {
            type: 'string',
            required: true,
            unique: true,
        },

    },

};

