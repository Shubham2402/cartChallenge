var constants=require('./constants.js');

exports.sendError = (error, res) => {
	res.status(400).json({ error})
};

exports.authenticationErrorResponse =  (res) => {
	var response = {
		"message": constants.responseMessages.INVALID_ACCESS_TOKEN,
		"response" : {}
	};
	res.status(constants.responseFlags.INVALID_ACCESS_TOKEN).json(response);
};
exports.parameterMissingResponse = (res) => {
	let response = {
		"message": constants.responseMessages.PARAMETER_MISSING,
		"response" : {}
	};
	res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
};