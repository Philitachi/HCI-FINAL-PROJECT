/**
 * Simple SHA-256 hashing function using Web Crypto API.
 * This "encrypts" the password so it's not stored in plaintext in Firestore.
 * 
 * @param {string} password - The plaintext password
 * @param {string} [salt] - Optional salt to append to the password
 */
export const hashPassword = async (password, salt = '') => {
  const encoder = new TextEncoder();
  // Combining salt and password
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Generates a random salt string.
 * @param {number} length - Length of the salt string
 */
export const generateSalt = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
};

