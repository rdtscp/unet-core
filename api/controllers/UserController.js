/**
 * UserController
 *
 * @description :: Server-side logic for managing User creation, retrieval(Authentication), deletion, and updating.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 const crypto = require('crypto');
 const bcrypt = require('bcrypt');

 // create messages.
 var uname_regexp          = /^[a-zA-Z0-9_-]{3,26}$/
 var pword_regexp          = /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,50})$/
 var uname_invalid_msg     = 'Username must be between 3 and 26 characters long, and can only contain alphanumerical, \'-\' and \'_\'';
 var pword_invalid_msg     = 'Password must contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.';
 var user_exists_msg       = 'User already exists with that username.';
 var user_created_msg      = 'Succesfully Created Account';

 // Destroy/Update messages.
 var account_updated_msg   = 'Account succesfully updated. If you changed your password, you will need to re-login on your devices.';


module.exports = {

    /* 'post /unet/user/get'
     * Retrieves a User Model if authenticated.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message,
     *     user: The User model of this requester
     * }
     *
     */
    get: function (req, res) {
        var authToken   = req.param('token');
        var user        = req.options.user;
        return res.json({
            err: false,
            warning: false,
            message: null,
            user: user
        });
    },

    /* 'post /unet/user/create'
     * Check if a user exists under post param "username". If not, creates a new one.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'User already exists' | 'Password must contain 1 uppercase' ],
     * }
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
                msg: uname_invalid_msg
            });
        }

        // Check password is valid.
        if (pword.search(pword_regexp) == -1) {
            return res.json({
                err: false,
                warning: true,
                msg: pword_invalid_msg
            })
        }

        // Check if a User exists under this username already.
        User.findOne({
            username: uname
        }).exec((err, user) => {
            // Error: return error to client app.
            if (err) return res.json(Utils.return_error(err));
            // If the user exists.
            if (user) {
                // Return a warning that the user exists.
                return res.json({
                    err: false,
                    warning: true,
                    msg: user_exists_msg
                });
            } else {
                User.create({
                    username: uname,
                    password: pword
                }).exec((err, user) => {
                    // Error: return error.
                    if (err) return res.json(Utils.return_error(err));
                    return res.json({
                        err: false,
                        warning: false,
                        msg: user_created_msg
                    });
                });
            }
        });
    },

    /* 'post /unet/user/destroy'
     * Destroys a User model if requested is authenticated.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Account Deleted.' ],
     *     exists: [ true | false ],
     *     user: User.js model
     * }
     *
     */
    destroy: function (req, res) {
        // Parse POST for User params.
        var authToken = req.param('token');
        var user      = req.options.user;
        // Remove the User model from the table. User model will delete its dependent children.
        User.destroy({
            id: user.id
        }).exec((err) => {
            if (err) return res.json(Utils.return_error(err));
            else return res.json({
                err: false,
                warning: false,
                msg: 'Account Deleted.'
            });
        });
    },

    /* 'post /unet/user/update'
     * Updates info on a User model if request is authenticated.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Account Updated', 'Invalid new Password' ],
     *     exists: [ true | false ],
     *     user: User.js model
     * }
     */
    update: function (req, res) {
        // Parse POST for User params.
        var valuesToUpdate      = {};
        valuesToUpdate.password = req.param('password');
        var user                = req.options.user;
        // Check new password is valid.
        if (valuesToUpdate.password.search(pword_regexp) == -1) {
            return res.json({
                err: false,
                warning: true,
                msg: pword_invalid_msg
            });
        } else {
            // Hash the password.
            bcrypt.hash(valuesToUpdate.password, 10, function(err, hash) {
                if(err) return res.json(Utils.return_error(err));
                // Update desired User model with new data.
                User.update(
                    {id: user.id},
                    {password: hash}
                ).exec((err) => {
                    if (err) return res.json(Utils.return_error(err));
                    else return res.json({
                        err: false,
                        warning: false,
                        msg: account_updated_msg
                    }); 
                });
            });
        }
    }
	
};