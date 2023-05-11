const router = require('express').Router();
const Meeting = require('../models/meetings');

router.post('/add', async (req, res) => {
    const newMeeting = new Meeting({
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        confirmed: req.body.confirmed,
    });

    try {
        const meeting = await newMeeting.save();
        res.status(200).json(meeting);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.status(200).json(meetings);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(req.params.id, {
            confirmed: true
        }, { new: true });
        res.status(200).json(meeting);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndDelete(req.params.id);
        res.status(200).json(meeting);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;