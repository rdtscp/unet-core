/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

 'GET /csrfToken': {
   action: 'security/grant-csrf-token',
   cors: {
     allowOrigins: ['https://acwilson96.github.io', 'https://acwilson96-unet.herokuapp.com' ]
   }
 },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  // Device Controller

  'post /unet/device/get': {
    controller: 'DeviceController',
    action: 'get'
  },

  'post /unet/device/create': {
    controller: 'DeviceController',
    action: 'create'
  },

  // User Controller

  'post /unet/user/get': {
    controller: 'UserController',
    action: 'get'
  },

  'post /unet/user/create': {
    controller: 'UserController',
    action: 'create'
  },

  'post /unet/user/destroy': {
    controller: 'UserController',
    action: 'destroy'
  },

  'post /unet/user/update': {
    controller: 'UserController',
    action: 'update'
  },

  // FriendshipController

  'post /unet/friendship/get/all': {
    controller: 'FriendshipController',
    action: 'getall'
  },

  'post /unet/friendship/create': {
    controller: 'FriendshipController',
    action: 'create'
  },

  'post /unet/friendship/get': {
    controller: 'FriendshipController',
    action: 'get'
  },

  'post /unet/friendship/destroy': {
    controller: 'FriendshipController',
    action: 'destroy'
  },

  'post /unet/friendship/update': {
    controller: 'FriendshipController',
    action: 'update'
  },

  // Chat Controller

  'post /unet/chat/create': {
    controller: 'ChatController',
    action: 'create'
  },

  'post /unet/chat/get': {
    controller: 'ChatController',
    action: 'get'
  },

  'post /unet/chat/update': {
    controller: 'ChatController',
    action: 'destroy'
  },

  'post /unet/chat/subscribe': {
    controller: 'ChatController',
    action: 'subscribe'
  },

  // Message Controller

  'post /unet/message/create': {
    controller: 'MessageController',
    action: 'create'
  },

  // Profile Controller

  'post /unet/profile/get': {
    controller: 'ProfileController',
    action: 'get'
  }

};
