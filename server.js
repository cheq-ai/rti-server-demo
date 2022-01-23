const express = require('express');
const app = express();
const port = 8080;
const crypto = require('crypto');
const config = require('./config');

const decrypt = (message, key) => {
	const encryptedMessage = message.slice(16);
	const iv = message.slice(0, 16);
	const decipher = crypto.createDecipheriv('aes-192-ctr', key, iv);
	return (decipher.update(encryptedMessage, 'base64', 'utf8') + decipher.final('utf8'));
};

const isRequestLegit = message => {
	const [, code] = message.split(':');
	return code === '0';
};

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
	res.render('index', {
		tagHash: config.tagHash,
	});
});

app.get('/signup-submit', function(req, res) {
	const {token: encryptedMessage} = req.query;

	if (encryptedMessage) {
		const decryptedMessage = decrypt(encryptedMessage, config.decryptionKey);
		const isLegit = isRequestLegit(decryptedMessage);

		app.locals.encryptedMessage = encryptedMessage;
		app.locals.decryptedMessage = decryptedMessage;

		return res.render(isLegit ? 'pass' : 'block');
	}

	res.end('missing a token');
});

app.listen(port);
console.log(`Server is listening on port ${port}`);
