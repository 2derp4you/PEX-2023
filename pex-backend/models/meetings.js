const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        require: true,
    },
    time: {
        type: String,
        require: true,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);