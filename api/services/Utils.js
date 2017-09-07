/**
 * Utils
 *
 * @description :: Service that exposes utility methods. E.G. Current date in DD/MM/YYYY format
 */

module.exports = {

    currDate: function () {
        var now = new Date();
        var dd = now.getDate();
        var mm = now.getMonth()+1; //January is 0!
        var yyyy = now.getFullYear();
        
        if(dd<10) {
            dd = '0'+dd
        } 
        
        if(mm<10) {
            mm = '0'+mm
        } 
        
        return (dd + '/' + mm + '/' + yyyy);
    },

    return_error: function (err) {
        return {
            err: true,
            warning: false,
            msg: err
        }
    }

}