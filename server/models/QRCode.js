const mongoose = require('mongoose');

/**
 * QR Code Schema
 * Defines the structure for storing generated QR codes in MongoDB
 */
const qrCodeSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
  },
  qrType: {
    type: String,
    required: [true, 'QR type is required'],
    enum: {
      values: ['URL', 'Plain Text', 'Email', 'Phone Number', 'WiFi'],
      message: '{VALUE} is not a valid QR type'
    }
  },
  qrImage: {
    type: String, // Base64 data URL of the generated QR code
    required: [true, 'QR image data is required'],
  },
  size: {
    type: Number,
    default: 300,
    min: [50, 'Size must be at least 50px'],
    max: [1000, 'Size cannot exceed 1000px']
  },
  foregroundColor: {
    type: String,
    default: '#000000',
    match: [/^#([0-9A-Fa-f]{6})$/, 'Please provide a valid hex color'],
  },
  backgroundColor: {
    type: String,
    default: '#FFFFFF',
    match: [/^#([0-9A-Fa-f]{6})$/, 'Please provide a valid hex color'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Index for efficient sorting by creation date
  }
});

// Create index on content field for efficient search functionality
qrCodeSchema.index({ content: 'text' });

// Add a compound index for common query patterns
qrCodeSchema.index({ qrType: 1, createdAt: -1 });

/**
 * Pre-save middleware to validate content based on QR type
 */
qrCodeSchema.pre('save', function(next) {
  // Add any pre-save validation logic here if needed
  console.log(`Saving QR code of type: ${this.qrType}`);
  next();
});

/**
 * Instance method to get QR code summary
 */
qrCodeSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.qrType,
    content: this.content.substring(0, 50),
    createdAt: this.createdAt
  };
};

/**
 * Static method to get QR code statistics
 */
qrCodeSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$qrType',
        count: { $sum: 1 },
        lastCreated: { $max: '$createdAt' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return stats;
};

// Create and export the model
const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;