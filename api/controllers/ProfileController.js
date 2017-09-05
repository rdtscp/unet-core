/**
 * ProfileController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /* 'post /unet/profile/get'
     * Gets a Profile model under the requested ID.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Account Deleted.' ],
     *     exists: [ true | false ],
     *     profile: Profile.js model
     * }
     *
     */
    get: function (req, res) {
        var authToken   = req.param('token');
        var id          = req.param('id');
        Profile.findOne({
            id: id
        }).exec((err, profile) => {
            if (err) return res.json(Utils.return_error(err));
            if (profile) {
                return res.json({
                    err: false,
                    warning: false,
                    message: null,
                    profile: profile
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    message: 'Profile does not exist for current user.'
                });
            }
        });
    }
	
};

