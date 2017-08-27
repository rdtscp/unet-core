/**
 * UserController
 *
 * @description :: Server-side logic for managing User creation, retrieval(Authentication), deletion, and updating.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 const bcrypt = require('bcrypt');
 const crypto = require('crypto');

 //get messages.
 var get_success_msg       = 'Logged In';
 var get_failure_msg       = 'Invalid username or password.';

 // create messages.
 var uname_regexp          = /^[a-zA-Z0-9_-]{3,26}$/
 var pword_regexp          = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,50})$/
 var uname_invalid_msg     = 'Username must be between 3 and 26 characters long, and can only contain alphanumerical, \'-\' and \'_\'';
 var pword_invalid_msg     = 'Password must contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.';
 var user_exists_msg       = 'User already exists with that username.';
 var user_created_msg      = 'Succesfully Created Account';
 

module.exports = {

    /* 
     * 'post /unet/user/get'
     * Retrieves a User Model if authenticated.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error or Warning message; E.G. [ 'Incorrect username or password' ]
     *     exists: [ true | false ],
     *     user: {
     *         username: 'string',
     *         id: 'integer'
     *     }
     * }
     *
     */
    get: function (req, res) {
        // Parse POST for User params.
        var uname  = req.param('username');
        var pword  = req.param('password');

        // Look up User.
        User.findOne({
            username: uname
        }).exec((err, user) => {
            if (err) return res.json(return_error(err));
            if (user) {
                // Check Password matches database password.
                bcrypt.compare(pword, user.password, (err, match) => {
                    if (err) return res.json(return_error(err));
                    if (match) {
                        // Generate an auth token.
                        var authToken = 'foobar';
                        // Create a new Device for this account to be authenticate to.
                        Device.create({
                            owner: user.id,
                            ip: req.ip,
                            user_agent: req.headers['user-agent'],
                            token: authToken
                        }).exec(function(err, newDevice) {
                            // Update the User with this new device.
                            User.find().populate('devices').exec((err, popdUsers) => {});
                        });
                        return res.json({
                            err: false,
                            warning: false,
                            msg: get_success_msg,
                            exists: true,
                            user: user
                        });
                    } else {
                        return res.json({
                            err: false,
                            warning: true,
                            msg: get_failure_msg,
                            exists: null,
                            user: null
                        });
                    }
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: get_failure_msg,
                    exists: null,
                    user: null
                });
            }
        });
    },

    /* 
     * 'post /unet/user/create'
     * Check if a user exists under post param "username". If not, creates a new one.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error or Warning message; E.G. [ 'User already exists' | 'Password must contain 1 uppercase' ]
     *     exists: [ true | false ],
     *     user: {
     *         username: 'string',
     *         id: 'integer'
     *     }
     * }
     *
     */
    create: function (req, res) {        
        // Parse POST for User params.
        var uname  = req.param('username');
        var pword  = req.param('password');

        // Check username is valid.
        if (uname.search(uname_regexp) == -1) {
            return res.json({
                err: false,
                warning: true,
                msg: uname_invalid_msg,
                exists: null,
                user: null
            });
        }

        // Check password is valid.
        if (pword.search(pword_regexp) == -1) {
            return res.json({
                err: false,
                warning: true,
                msg: pword_invalid_msg,
                exists: null,
                user: null
            })
        }

        // Check if a User exists under this username already.
        User.findOne({
            username: uname
        }).exec((err, user) => {
            // Error; return error to client app.
            if (err) return res.json(return_error(err));
            // If the user exists.
            if (user) {
                return res.json({
                    err: false,
                    warning: true,
                    msg: user_exists_message,
                    exists: true,
                    user: null
                });
            } else {
                bcrypt.hash(pword, 10, (err, hash) => {
                    User.create({
                        username: uname,
                        password: hash
                    }).exec((err, user) => {
                        // Error; return error to client app.
                        if (err) return res.json(return_error(err));
                        /* @TODO Initialise Account models, for example Profile/Upload Directory etc */
                        return res.json({
                            err: false,
                            warning: false,
                            msg: user_created_msg,
                            exists: false,
                            username: user.username,
                            id: user.id
                        });
                    });
                });
            }
        });
    },

    /* 
     * 'post /unet/user/destroy'
     * Destroys a User model if requested is authenticated.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error or Warning message; E.G. [ 'User already exists' | 'Password must contain 1 uppercase' ]
     *     exists: [ true | false ],
     *     user: {
     *         username: 'string',
     *         id: 'integer'
     *     }
     * }
     *
     */
    destroy: function (req, res) {

    },

    update: function (req, res) {

    }
	
};

function return_error(err) {
    return {
        err: true,
        warning: false,
        msg: err,
        exists: null,
        user: null
    }
}