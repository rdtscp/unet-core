/**
 * Device.js
 *
 * @description :: Represents a User's Device.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 const crypto = require('crypto');

module.exports = {
    
    connection: 'unet',
    identity: 'Device',
    attributes: {

        // User model that this Device is authenticated for.
        owner: {
            model: 'User'
        },

        token: {
            type: 'longtext',
            required: true
        },

        ip: {
            type: 'string',
            required: true
        },

        user_agent: {
            type: 'string'
        }

    },

    // Called before a Device model is created.
    beforeCreate: (values, cb) => {
        // Generate random token.
        crypto.randomBytes(256, (err, buf) => {
            if (err) cb(err);
            values.token = buf.toString('hex');
            cb();
        });
    },

};    