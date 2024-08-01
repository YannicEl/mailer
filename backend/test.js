import * as pkijs from 'pkijs';

async function main() {
	// Set crypto engine for PKIjs module
	// const crypto = new Crypto();
	// pkijs.setEngine('NodeJS', new pkijs.CryptoEngine({ crypto }));

	// BASE64 representation of the Certificate
	const pemCert = `-----BEGIN CERTIFICATE-----
MIIFzzCCBLegAwIBAgIQAp8ooylKMhQDdxA0uvpYWzANBgkqhkiG9w0BAQsFADA8
MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRwwGgYDVQQDExNBbWF6b24g
UlNBIDIwNDggTTAxMB4XDTIzMTIxNDAwMDAwMFoXDTI0MTEyMDIzNTk1OVowHDEa
MBgGA1UEAxMRc25zLmFtYXpvbmF3cy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQCudTQAmRaTM3R/bnxIYBtxqkwy29XbkO0cJ9OCeA656uJH+lm+
nqShf13xyx6TdiUk/S4ehinkOxHBKTjSIuHgh+VfPwhqiV9EHxokGUvPCc1PmUl0
XLCU1N+wtf1QZPuBjW0Ja3jLknDcoXrKYGcJGqP35EB36MO8uLhHVqZqoaAoQU6B
tR2PrMB1shIiqUi7uwzAAvPGDgwc9nO9wX5OVQFk8qEcFBCW32O7wOj034CNSRso
ntQ/fxqlZoJdcvC+Z0VgOHEEPQt9yF2XZVJYdLxs0FNUrOsJKpzZCimLEqSfRmCy
EgEv+UteNhD7E4hDRY5dwXE/eyyA5ri3zzEZAgMBAAGjggLrMIIC5zAfBgNVHSME
GDAWgBSBuA5jiokSGOX6OztQlZ/m5ZAThTAdBgNVHQ4EFgQUGOkdg9DPQtVX7owz
puU0BPZ/UZQwHAYDVR0RBBUwE4IRc25zLmFtYXpvbmF3cy5jb20wEwYDVR0gBAww
CjAIBgZngQwBAgEwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMB
BggrBgEFBQcDAjA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnIybTAxLmFt
YXpvbnRydXN0LmNvbS9yMm0wMS5jcmwwdQYIKwYBBQUHAQEEaTBnMC0GCCsGAQUF
BzABhiFodHRwOi8vb2NzcC5yMm0wMS5hbWF6b250cnVzdC5jb20wNgYIKwYBBQUH
MAKGKmh0dHA6Ly9jcnQucjJtMDEuYW1hem9udHJ1c3QuY29tL3IybTAxLmNlcjAM
BgNVHRMBAf8EAjAAMIIBfwYKKwYBBAHWeQIEAgSCAW8EggFrAWkAdwDuzdBk1dsa
zsVct520zROiModGfLzs3sNRSFlGcR+1mwAAAYxmlLKpAAAEAwBIMEYCIQC7Wfn0
SmVztjM8AstsrNsHeYeW7AETzLAN43x7elB8pwIhAMIwrkbXu/PpNZihBlOPBj04
wS7vZuw42uVjy9yXn4UZAHYASLDja9qmRzQP5WoC+p0w6xxSActW3SyB2bu/qznY
hHMAAAGMZpSyygAABAMARzBFAiEAutVlW1Oax7n5RLBsWXeRmzA/iVKJqcZhjeoZ
4ZzFunECIGKbdbDvZc0Y4moXUopJIXo3p4NwakKczZ9dIWVE/1ZjAHYA2ra/az+1
tiKfm8K7XGvocJFxbLtRhIU0vaQ9MEjX+6sAAAGMZpSyowAABAMARzBFAiAA7R7c
nWrPPHGfRGYER0ketkeD5BGOSUxLZ8zyraYiSAIhAJuZ5TZZj4oNgm4Nkh6xCQkq
Gc39XPPTr8AzCAXxoK5lMA0GCSqGSIb3DQEBCwUAA4IBAQClJ4h/4mZnlkzeP9Dy
aZkSMmWFNNu9W80gwSa/T5oiqYWQz7mjdeIxFnWh/GNsH7UL2zVQqGiUe7/3lwrX
actsL5G/YQuzrqEJnO8/fQFdoQ2jG4iX0LbPFLfUJi3bq5WsMOKO3yjOfFe+jyXF
9E5zcEMB86e2Rn7kxCJQwv0EdbMFCfEzISjUARzWd5swUOTaa/jFkgAYGTLNUOd/
sutMoG10mzPvbLvJUdHFBBfBchxbKmfndtlsKlDh35yVgAVGzItLr0g2VhIU44Nt
SfSFzgCZ4hrvQJTIsaEghvu5ZXFgpRmBRxDGd+7mE56SDJDQUjUkJMMokKmH6yNP
JLla
-----END CERTIFICATE-----`;

	// Create new Certificate instance from the BASE64 encoded data
	const raw = pemCertificateToArrayBuffer(pemCert);
	const cert = pkijs.Certificate.fromBER(raw);

	// Output the certificate information
	console.log('Certificate:');
	console.log('  Serial number:', cert.serialNumber.valueBlock.toString()); // Serial number: 1
	console.log(
		'  Issuer:',
		cert.issuer.typesAndValues.map((o) => `${o.type}=${o.value.valueBlock.value}`).join(', ')
	); // Issuer: 2.5.4.3=Test certificate, 2.5.4.10=Test, 2.5.4.7=US
	console.log(
		'  Subject:',
		cert.subject.typesAndValues.map((o) => `${o.type}=${o.value.valueBlock.value}`).join(', ')
	); // Subject: 2.5.4.3=Test certificate, 2.5.4.10=Test, 2.5.4.7=US
	console.log('  Public key:', cert.subjectPublicKeyInfo.algorithm.algorithmId); // Public key: 1.2.840.113549.1.1.1
	console.log('  Not after:', cert.notAfter.value.toDateString()); // Not after: Tue Feb 13 2024
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

function pemCertificateToArrayBuffer(pemCert) {
	const base64Cert = pemCert
		.replace('-----BEGIN CERTIFICATE-----', '')
		.replace('-----END CERTIFICATE-----', '')
		.replace(/\n/g, '');

	return base64ToArrayBuffer(base64Cert);
}

export function base64ToArrayBuffer(string) {
	const binaryString = atob(string);
	return stringToArrayBuffer(binaryString);
}

export function stringToArrayBuffer(string) {
	return new TextEncoder().encode(string);
}
