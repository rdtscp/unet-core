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
            model: 'user'
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
    
      }
    };
    
    