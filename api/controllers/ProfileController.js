/**
 * ProfileController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    get: function (req, res) {
        var authToken     = req.param('token');
        var id            = req.param('id');
        Profile.findOne({
            owner: id
        }).exec((err, profile) => {
            if (err) return res.json(Utils.return_error(err));
            return res.json({
                err: false,
                warning: false,
                message: null,
                profile: profile
            });
        });
    }
	
};

