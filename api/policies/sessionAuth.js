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

  // Parse POST for User params.
  var authToken   = req.param('token');
  // Check the request is authenticted.
  Device.findOne({
      token: authToken
  }).exec((err, device) => {
    if (err) return res.serverError(err);
    // If the device exists and is authenticated, append the Users id to the req.options.userid var.
    if (device) {
      req.options.userid = device.owner;
      return next();
    } else {
      return res.forbidden('You are not permitted to perform this action.');
    }
  });

};
