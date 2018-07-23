/**
 * User.js
 *
 * @description :: Represents a User account.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

    datastore: 'unet',
    identity: 'User',
    attributes: {

        createdAt: { type: 'number', autoCreatedAt: true, },
        updatedAt: { type: 'number', autoUpdatedAt: true, },
        id: { type: 'string', columnName: '_id', autoIncrement: true},

        // A list of Devices this User is authenticated on.
        devices: {
            collection: 'Device',
            via: 'owner'
        },

        // Contains a list of Chat models this Profile is a member of.
        chats: {
            collection: 'Chat',
            via: 'users'
        },

        // The single Profile that this User owns.
        profile: {
            model: 'Profile',
            // unique: true
        },

        username: {
            type: 'string',
            required: true,
            unique: true,
        },
        
        password: {
            type: 'string',
            required: true,
        }

    },

    customToJSON: function() {
        // Return a shallow copy of this record with the password and ssn removed.
        return _.omit(this, ['password'])
    },

    // Called before a User model is created, will hash the password; returns error if hashing fails.
    beforeCreate: (values, cb) => {
        // Hash password
        bcrypt.hash(values.password, 10, function(err, hash) {
            if(err) return cb(err);
            values.password = hash;
            cb();
        });
    },

    // After a User has been created, create them a Profile.
    afterCreate: (newlyInsertedRecord, cb) => {
        Profile.create({ username: newlyInsertedRecord.username, owner: newlyInsertedRecord.id }).exec(cb);
    },
    
    // After a User's credentials have been updated, de-auth all their devices.
    afterUpdate: (updatedRecord, cb) => {
        Device.destroy({owner: updatedRecord.id}).exec(cb);
    },

    // Events to trigger when a User is destroyed.
    afterDestroy: (destroyedRecords, cb) => {
        var userID = _.pluck(destroyedRecords, 'id');
        // Destroy all this Users data. 
        Device.destroy({owner: userID}).exec(cb);
        Profile.destroy({owner: userID}).exec(cb);
    },

    /* Method takes two users, and returns them (if they exist).
     *  
     * sender:   JSON representation of the User that sent a specific request.
     * receiver: JSON representation of the User that has/is to receive the request
     */
    getUsers: function(sender, receiver, cb) {
        var tasks = [];
        var out_sender;
        var out_receiver;
        tasks.push(
            User.findOne(sender).then((user) => {
                if (user) out_sender = user;
                return;
            })
        );
        tasks.push(
            User.findOne(receiver).then((user) => {
                if (user) out_receiver = user;
                return;
            })
        );
        return Promise
        .all(tasks)
        .then(result => {
            if (out_sender && out_receiver) cb(null, out_sender, out_receiver);
            else if (!out_receiver) cb('Requested user does not exist.', null, null);
            else cb('Error: User that sent request could not be retrieved.', null, null);
        });
    },
  
};

