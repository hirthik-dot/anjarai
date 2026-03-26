const mongoose = require('mongoose');

const NewsletterSubscriberSchema = new mongoose.Schema({
  email:         { type: String, unique: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
