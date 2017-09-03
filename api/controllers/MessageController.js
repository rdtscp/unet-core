/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
    /* 'post /unet/message/get'
     * Returns a message requested by its number in a Chat.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to retrieve message.' ],
     *     message: Message.js model
     * }
     */
    get: function (req, res) {
        
    },

    /* 'post /unet/message/create'
     * Creates a message from the current user to a chat id.
     * 
     * Returns json:
     * {
     *     err: [ true | false ],
     *     warning: [ true | false ],
     *     msg: Error, Warning or Success message; E.G. [ 'Failed to create a message.' ],
     *     message: Message.js model
     * }
     */
    create: function (req, res) {
        // Parse POST for params.
        var chatID  = req.param('id');
        var msg     = req.param('message');
        msg         = msg.replace(/(<br>|&nbsp;| )*$/, '').replace(/^(<br>|&nbsp;| )*/, '');
        var user    = req.options.user;
        Message.create({
            chat: chatID,
            message: msg,
            sender: user.id
        }).exec((err, message) => {
            if (err) return res.json(Utils.return_error(err));
            if (message) {
                return res.json({
                    err: false,
                    warning: false,
                    msg: 'Message sent',
                    message: message
                });
            } else {
                return res.json({
                    err: false,
                    warning: true,
                    msg: 'Message was not created succesfully.'
                });
            }
        });
    }

};

