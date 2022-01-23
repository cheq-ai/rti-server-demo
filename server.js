const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
app.use(cookieParser());
const port = 8080;
const config = require('./config');
const request = require("request");


// This function will invoke CHEQ's fraud engine to ensure the legitimate of the request
function validateRequestOnRTIServer(eventType, req) {
	return new Promise((resolve, reject) => {
		// This is the body of the request which having some fields that used to tag each request as valid or not:
		const form = {
			'ApiKey': config.apiKey,
			'TagId': config.tagid,
			'ClientIP': req.ip,
			'RequestURL': `${req.protocol}://${req.get('host')}${req.originalUrl}`,
			'ResourceType': req.headers['content-type'] || req.headers['Content-Type'],
			'Method': req.method,
			'Host': req.headers['host'] || req.headers['Host'],
			'UserAgent': req.headers['user-agent'] || req.headers['User-Agent'],
			'Accept': req.headers['accept'] || req.headers['Accept'],
			'AcceptLanguage': req.headers['accept-language'] || req.headers['Accept-Language'],
			'AcceptEncoding': req.headers['accept-encoding'] || req.headers['Accept-Encoding'],
			'HeaderNames': 'Host,User-Agent,Accept,Accept-Langauge,Accept-Encoding,Cookie',
			'CheqCookie': req.cookies["_cheq_rti"],
			'EventType': eventType
		}
		console.log(JSON.stringify(form));
		request.post({url: config.cheqsEngineUri, headers: {'Content-Type': 'application/x-www-form-urlencoded'}, form},
			(error, response) => {
				if (error) {
					return reject(error);
				}
				resolve(JSON.parse(response.body));
			});
	});
}

app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
	const validResult = await validateRequestOnRTIServer("page_load", req);
	if (validResult.isInvalid) {
		res.status(403).send("Visitor is invalid, session blocked!");
	} else {
		// Cookie saved on client side for binding between client detection and server one
		res.setHeader('Set-Cookie', validResult.setCookie);
		res.render('index', {
			tagId: config.tagid,
			rtiServerResponse: JSON.stringify(validResult)
		});
	}
});

app.get('/signup-submit', async (req, res) => {
	const validResult = await validateRequestOnRTIServer("registration", req);
	app.locals.fullName = `${req.query["first"]} ${req.query["last"]}`;
	app.locals.rtiServerResponse = JSON.stringify(validResult);
	res.render(validResult.isInvalid ? 'block' : 'pass');
});

app.listen(port);
console.log(`Server is listening on port ${port}`);
