const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const userRoute = require('./routes/setUser');
const meetingRoute = require('./routes/setMeeting');

//setter opp for bruk av .env filen
dotenv.config();
//setter opp for bruk av json
app.use(express.json());

//kobler til mongoDB
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "pexData"
    })
    .then(console.log("Connectet to mongoDB"))
    .catch((err) => console.log(err));

//setter opp for bruk av cors og hvilet domene som kan bruke serveren
app.use(
    cors({
        origin: "https://pex.sigve.dev",
        methods: "GET,POST,PUT,DELETE",
        credentials: true
    })
);

app.get("/auth", (req, res) => {
    try {
        const header = req.headers["authorization"];
        const authData = jwt.verify(header, process.env.JWT_SECRET);

        if(authData) {
            res.status(200).json(authData);
        } else {
            res.status(401).json("Not authorized!");
        }
    } catch (err) {
        res.status(401).json("Not authorized!");
    }
})

app.use("/user", userRoute);
app.use("/meeting", meetingRoute);

//starter serveren
app.listen("25580", ()=>{
    console.log("Server is running on port 25580!");
})