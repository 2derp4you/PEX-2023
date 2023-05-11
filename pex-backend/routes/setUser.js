const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const dotenv = require('dotenv');

dotenv.config();

const saltRounds = 10;

router.post('/register', async (req, res) => {
    let hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        isAdmin: req.body.isAdmin,
    });

    try {
        const user = await newUser.save();

        const accessToken = jwt.sign({
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            user: user,
            accessToken,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login/:email/:pass', async (req, res) => {
    try {
        let user = await User.find({ email: req.params.email });
        if(!user) {
            res.status(404).json('User not found!');
        }
        bcrypt.compare(req.params.pass, user[0].password, (err, result) => {
            if(err) {
                res.status(500).json(err);
            } else {
                if(result) {
                    const { password, ...others } = user[0]._doc;

                    const accessToken = jwt.sign({
                        id: user[0]._id,
                        firstname: user[0].firstname,
                        lastname: user[0].lastname,
                        email: user[0].email,
                        isAdmin: user[0].isAdmin,
                    }, process.env.JWT_SECRET, { expiresIn: '7d' });

                    res.status(200).json({
                        user: others,
                        accessToken,
                    });
                } else {
                    res.status(400).json('Wrong password!');
                }
            }
        });
    } catch (err) {
        res.status(500).json("no func");
    }
});

module.exports = router;