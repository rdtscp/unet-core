/**
 * Device.js
 *
 * @description :: Represents a User's Device.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    
      connection: 'unet',
      identity: 'Device',
      attributes: {
    
        owner: {
            model: 'User'
        },
        ip: {
            type: 'string',
            required: true
        },
        user_agent: {
            type: 'string'
        },
        token: {
            type: 'longtext',
            required: true
        }
    
      },

      afterCreate: function (newDevice, cb) {
          // Update the User with this new device.
          User.find().populate('devices').exec((err, popdUsers) => {
              if (err) cb(err);
              else cb();
          });
      }

    };
    
    