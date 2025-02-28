const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: [
            'Authentication',
            'Chat',
            'Video Call',
            'File Management',
            'Live Editor',
            'Project Manager',
            'Docker',
            'CLI',
            'Version Control'
        ],
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Communication', 'Collaboration', 'Development', 'Management'],
        required: true,
    },
    features: {
        type: [String],
        required: true,
        default: [],
    },
    price: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        default: 30, // Duration in days for premium services
    },
    type: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
