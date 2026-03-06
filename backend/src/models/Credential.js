const mongoose = require('mongoose');
const crypto = require('crypto');

const ENCRYPTION_KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key-change-in-production', 'salt', 32);
const ALGORITHM = 'aes-256-cbc';

const credentialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  portal: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  iv: { type: String, required: true }, // Initialization vector
}, { timestamps: true });

// Encrypt password before saving
credentialSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(this.password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  this.password = encrypted;
  this.iv = iv.toString('hex');
  next();
});

// Method to decrypt password
credentialSchema.methods.getDecryptedPassword = function() {
  const iv = Buffer.from(this.iv, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(this.password, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = mongoose.model('Credential', credentialSchema);
