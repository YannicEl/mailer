import { signedFetch } from './aws';

const url = 'https://email.eu-central-1.amazonaws.com/v2/email/outbound-emails';

const init: RequestInit = {
	method: 'POST',
	headers: {
		'Content-type': 'application/json',
	},
	body: JSON.stringify({
		Content: {
			Simple: {
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: 'This is an email',
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: 'Test email',
				},
			},
		},
		FromEmailAddress: 'me@yannic.at',
		Destination: {
			ToAddresses: ['yannic.wlns@gmail.com'],
		},
	}),
};

console.time();
const res = await signedFetch(url, init);
const json = await res.json();
console.log(json);
console.timeEnd();
