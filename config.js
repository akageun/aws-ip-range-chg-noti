module.exports = {
	fileFullNm : "./AWS_IP_RANGE.json",
	emailOption : {
		service : "Gmail",
		auth : {
			user : "your email Id",
			passwd : "your password"
		},
		mailOption : {
			from : "TEST <test@test.com>",
			to : [ 'test@test.com', 'test@test.com' ],
			subject : "AWS IP CHANGE LIST"
		}
	}
}
