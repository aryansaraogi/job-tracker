const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  company: { type: String },
  url: { type: String },
  status: { type: String, default: 'wishlist' }, // e.g., wishlist, applied, interview
  notes: { type: String },
  portal: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
