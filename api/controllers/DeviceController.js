/**
 * DeviceController
 *
 * @description :: Server-side logic for managing Devices/Authentication
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    /*
     * Query to check and see if a device auth token is still valid.
     * 
     */
    get: function (req, res) {
        // Parse POST for User params.
        var authToken   = req.param('token');
        // Check the request is authenticted.
        Device.findOne({
            token: authToken
        }).exec((err, device) => {
            if (err) return res.json(Utils.return_error(err));
            if (device) {
                return res.json({tokenValid: true});
            } else {
                return res.json({tokenValid: false});
            }
        });
    }
        
};
    
    