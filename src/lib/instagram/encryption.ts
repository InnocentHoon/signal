import crypto from 'crypto';

function getEncryptionKey(): Buffer {
  const secret = process.env.NEXTAUTH_SECRET || '';
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set');
  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(12);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

export function decryptToken(encryptedString: string): string {
  const parts = encryptedString.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted token format');
  
  const [ivBase64, authTagBase64, encrypted] = parts;
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  const key = getEncryptionKey();
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
