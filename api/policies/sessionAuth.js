/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
    var authToken;
    // Parse POST for User token.
    if (req.isSocket) {
        authToken = req.body[0];
    } else {
        authToken = req.param('token');
    }
    // Check the request is authenticted.
    Device.findOne({
        token: authToken
    }).exec((err, device) => {
        if (err) return res.serverError(err);
        // If the device exists and is authenticated, find the User.
        if (device) {
            User.findOne({
                id: device.owner
            }).populateAll().exec((err, user) => {
                if (err) return res.serverError(err);
                req.options.user = user;
                return next();
            });
        } else {
            return res.forbidden('You are not permitted to perform this action.');
        }
    });

};
