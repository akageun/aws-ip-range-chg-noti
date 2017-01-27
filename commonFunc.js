var request = require('sync-request'),
	jsonfile = require('jsonfile'),
	nodemailer = require('nodemailer');

module.exports = {
		/**
		 * request AwsIpRange Api
		 */
		callAwsIpRangeApi: function(callIp, method) {
			var result = request(method, callIp);
			if (result.statusCode === 200) {
				return result;
			}

			return "";

		},
		/**
		 * JsonFile Read
		 */
		getAwsIpRangeDataFile: function(fileFullNm){
			try {
                return jsonfile.readFileSync(fileFullNm);
	        } catch (e) {
                return "";
	        }
		},
		/**
		 * Json Data Diff Yn
		 */
		isDiffJsonData: function(fileJson, apiJson) {
			if (fileJson === ""){
				return false;
			}

			if (apiJson.syncToken > fileJson.syncToken){
				return true;
			}

			return false;

		},
		/**
		 * JSON Data Diff
		 */
		diffJsonData: function(fileJson, apiJson) {
			var rtnJson = new Array();

			apiJson.prefixes.forEach(function(data) {
				var isJsonPush = true;

				for (var i = 0 ; i < fileJson.prefixes.length ; i++) {
					var fileData = fileJson.prefixes[i];
					if (fileData.ip_prefix === data.ip_prefix && fileData.region === data.region && fileData.service === data.service) {
						isJsonPush = false;
						break;
					}
				}

				if (isJsonPush === true) {
					rtnJson.push(data);
				}
			});

			return rtnJson;
		},
		/**
		 * Create Json File
		 */
		createJsonFile: function(jsonData, fileFullNm) {
			jsonfile.writeFileSync(fileFullNm, jsonData,{ flag : 'w' });
		},
		/**
		 * Email Send
		 **/
		sendEmailData: function(emailText, emailOption) {

			var smtpTransport = nodemailer.createTransport("SMTP", {
			    service: emailOption.service,
			    auth: {
			        user: emailOption.auth.user,
			        pass: emailOption.auth.passwd
			    }
			});

			var mailOptions = {
			    from: emailOption.mailOption.from,
			    to: emailOption.mailOption.to,
			    subject: emailOption.mailOption.subject,
			    text: emailText
			};

			smtpTransport.sendMail(mailOptions, function(error, response){
			    if (error) console.log(error);

			    smtpTransport.close();
			});

		}
};
