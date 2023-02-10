import { createCipheriv, createDecipheriv, randomFill, scrypt } from 'node:crypto';
import { Buffer } from 'node:buffer';

export { randomUUID } from 'node:crypto';

const ALGORITHM = 'aes-192-cbc';

export function encrypt(message: string, encryption_key: string) {
	if (typeof message !== 'string' || typeof encryption_key !== 'string') {
		throw 'Parameters must be strings.';
	}
	return new Promise<string>((resolve, reject) => {
		scrypt(encryption_key, 'salt', 24, (err, key) => {
			if (err) return reject(err);
			randomFill(new Uint8Array(16), (err, iv) => {
				try {
					if (err) return reject(err);
					const cipher = createCipheriv(ALGORITHM, key, iv);
					let encrypted = '';
					cipher.setEncoding('hex');
					cipher.on('error', (err) => reject(err));
					cipher.on('data', (chunk) => (encrypted += chunk));
					cipher.on('end', () => resolve(`${Buffer.from(iv).toString('hex')}:${encrypted}`));
					cipher.write(message);
					cipher.end();
				} catch (err) {
					reject(err);
				}
			});
		});
	});
}

export function decrypt(ivcipher: string, encryption_key: string) {
	if (typeof ivcipher !== 'string' || typeof encryption_key !== 'string') {
		throw 'Parameters must be strings.';
	}
	const [iv_hex, cipher_text] = ivcipher.split(':');
	return new Promise<string>((resolve, reject) => {
		scrypt(encryption_key, 'salt', 24, (err, key) => {
			try {
				if (err) return reject(err);
				const iv = Buffer.from(
					(iv_hex.match(/.{1,2}/g) ?? []).map((str) => Number.parseInt(str, 16))
				);
				const decipher = createDecipheriv(ALGORITHM, key, iv);
				let decrypted = '';
				decipher.on('error', (err) => reject(err));
				decipher.on('readable', () => {
					let chunk;
					while (null !== (chunk = decipher.read())) {
						decrypted += chunk.toString('utf8');
					}
				});
				decipher.on('end', () => resolve(decrypted));
				decipher.write(cipher_text, 'hex');
				decipher.end();
			} catch (err) {
				reject(err);
			}
		});
	});
}
