var responses = require('./responses');
var { UserModel } = require('../models/userModel');

exports.userAccessToken = (req, res, next) => {
    console.log("auth");
    let { access_token } = req.headers;
    if (access_token) {
        UserModel.findOne({ access_token: req.headers.access_token })
            .then(result => {
                if (!result) {
                    responses.authenticationErrorResponse(res);
                } else {
                    console.log(result);
                    req.user = result;
                    next();
                }
            }).catch(err => {
                console.log("error is " + err);
                responses.sendError(err.message, res);
            })
    } else {
        (responses.parameterMissingResponse(res));
        return;
    }
}
