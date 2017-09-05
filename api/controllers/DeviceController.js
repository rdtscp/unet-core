/**
 * DeviceController
 *
 * @description :: Server-side logic for managing Devices/Authentication
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const bcrypt = require('bcrypt');

module.exports = {
    
    /*' post /unet/device/get'
     * Query to check and see if a device auth token is still valid.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     tokenValid: [ true | false ]
     * }
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
    },

    /* 'post /unet/device/create'
     * Submit User credentils to create a Device authenticated to the supplied credentials.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Incorrect username or password' ],
     *     exists: [ true | false ],
     *     token: Authentication token
     * }
     */
    create: function (req, res) {
        // Parse POST for User params.
        var uname  = req.param('username');
        var pword  = req.param('password');

        // Look up User.
        User.findOne({
            username: uname
        }).exec((err, user) => {
            if (err) return res.json(Utils.return_error(err));
            if (user) {
                // Check Password matches database password.
                bcrypt.compare(pword, user.password, (err, match) => {
                    if (err) return res.json(Utils.return_error(err));
                    if (match) {
                        User.authenticateDevice(user, req.ip, req.headers['user-agent'], (err, token) => {
                            if (err) return res.json(Utils.return_error(err));
                            if (token) {
                                // Return empty response.
                                return res.json({
                                    err: false,
                                    warning: false,
                                    msg: null,
                                    token: token
                                });
                            } else {
                                return res.json({
                                    err: true,
                                    warning: true,
                                    msg: '500 Server Error: Device has not been authenticated.'
                                });
                            }
                        });
                    } else {
                        return res.json({
                            err: false,
                            warning: true,
                            msg: get_failure_msg
                        });
                    }
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: get_failure_msg
                });
            }
        });
    }
        
};