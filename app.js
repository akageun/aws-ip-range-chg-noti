var async = require('async'), 
	commonFunc = require('./commonFunc.js'),
	config = require('./config.js');

var aws_ip_range_api = "https://ip-ranges.amazonaws.com/ip-ranges.json";
	
async.waterfall([
	/**
	 * API Call
	 * 
	 * @param callback
	 */
	function callData(callback) {
		var apiBody = commonFunc.callAwsIpRangeApi(aws_ip_range_api,'GET');
		
		if (apiBody === "" || apiBody.statusCode !== 200) { //not http statusCode 200
			console.error("Not Http Status Code 200");
			return;
		}
	    callback(null, JSON.parse(apiBody.getBody()));
	},
	/**
	 * File Json Read
	 * 
	 * @param apiJson
	 * @param callback
	 */
	function getFileJsonData(apiJson, callback) {
		var fileJson = commonFunc.getAwsIpRangeDataFile(config.fileFullNm);
		
		if (fileJson === "") {
			console.log("Create Aws Ip Range Json File.");
			commonFunc.createJsonFile(apiJson, config.fileFullNm);
			return;
		}
		
        callback(null, apiJson, fileJson);
	},
	/**
	 * Json Data Diff
	 * 
	 * @param apiJson
	 * @param fileJson
	 * @param callback
	 */
	function jsonDiff(apiJson, fileJson, callback) {
		var isDiff = commonFunc.isDiffJsonData(fileJson, apiJson);
		if (isDiff === false) {
			console.log("Same data");
			return;
		}
		
		var chgIpJson = commonFunc.diffJsonData(fileJson, apiJson);
		
		commonFunc.createJsonFile(apiJson, config.fileFullNm);
		
		callback(null, chgIpJson);
	},
	/**
	 * Email Send
	 * 
	 * @param chgIpJson
	 * @param callback
	 */
	function notiEmail(chgIpJson, callback) {
		commonFunc.sendEmailData(JSON.stringify(chgIpJson), config.emailOption);
	}
], function(err, result) {
    if (err) {
        return console.log(err);
    }
    console.log(result);
});