/**
 * Profile.js
 *
 * @description :: Represents a User's Profile.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    datastore: 'unet',
    identity: 'Profile',
    attributes: {

        createdAt: { type: 'number', autoCreatedAt: true, },
        updatedAt: { type: 'number', autoUpdatedAt: true, },
        id: { type: 'string', columnName: '_id', autoIncrement: true},

        // Contains a single ID to its owner.
        owner: {
            model: 'User',
            // required: true,
            // unique: true,
        },

        username: {
            type: 'string',
            required: true,
            unique: true,
        },

    },

};

