import express from "express";
import cors from "cors";
import { getNowEvents, getScheduledEvents, getEventsByDay, addEvent, updateTime, getEvents, deleteEvent } from "./event.controller";
import { Event } from "../common/Types";
import { addUser, deleteUser, getUser, getUsers, updateCollege, updateYear } from "./users.controller";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get(`/api/event`, async (req, res) => {
    console.log("[GET] entering `event` endpoint");

    try{
        const events = await getEvents();
        
        res.status(200).send({
            message: `SUCCESS received all events from the events collection in Firestore`,
            data: events
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: an error occurred at /api/event GET endpoint: ${err}`
        });
    }
});

app.get(`/api/event/now`, async (req, res) => {
    console.log("[GET] entering `event/now` endpoint");

    try{
        const events = await getNowEvents();

        res.status(200).send({
            message: `SUCCESS received all events happening now from the events collection in Firestore`,
            data: events,
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: an error occurred at /api/event/now GET endpoint: ${err}`
        });
    }

});

app.get(`/api/event/scheduled`, async (req, res) => {
    console.log("[GET] entering `event/scheduled` endpoint");

    try{
        const events = await getScheduledEvents();

        res.status(200).send({
            message: `SUCCESS received all events scheduled from the events collection in Firestore`,
            data: events,
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: an error occurred at /api/event/scheduled GET endpoint: ${err}`
        });
    }
});

app.get(`/api/event/scheduled/day/:day`, async (req, res) => {
    console.log("[GET] entering `event/now/:day` endpoint");
    const day = req.params.day;

    try{
        const events = await getEventsByDay(day);

        res.status(200).send({
            message: `SUCCESS received all events at ${day} from events-scheduled collection in Firestore`,
            data: events,
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: an error occured at /api/event/scheduled/:day GET endpoint: ${err}`,
        });
    }
});

app.post(`/api/event/:id`, async(req, res) => {
    console.log("[POST] entering `event/:id` endpoint");
    const id = req.params.id;
    const { title, now, host, location, time, days } = req.body;
    const nowEvent: Event = {
        title,
        now, 
        host,
        location,
        time,
        days
    }

    try{
        await addEvent(id, nowEvent);
        res.status(200).send({
            message: `SUCCESS added event with id: ${id} to events-now collection in Firestore`,
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: an error occured at /api/now/:id POST endpoint: ${err}`, 
        })
    }
});

app.delete(`/api/event/:id`, async (req, res) => {
    console.log("[DELETE] entering `event/:id` endpoint")
    const id = req.params.id;

    try {
        await deleteEvent(id);

        res.status(200).send({
            message: `SUCCESS current event with id: ${id} deleted in event-now collection in Firestore`
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: an error occurred at /api/event/:id DELETE endpoint: ${err}`
        });
    }
});

app.put(`/api/event/scheduled/time/:id`, async (req, res) => {
    console.log("[PUT] entering `event/scheduled/time/:id` endpoint")
    const id  = req.params.id;
    const time = req.body.time;

    try {
        await updateTime(id, time);

        res.status(200).send({
            message: `SUCCESS updated scheduled event with id: ${id} with new time`
        });
    } catch (err) {
        res.status(200).json({
            error: `ERROR: error occurred at /api/event/scheduled/time/:id PUT endpoint: ${err}`
        });
    }
});

// Users API Endpoints
app.get(`/api/user/`, async (req, res) => {
    console.log("[GET] entering `user` endpoint");

    try {
        const users = await getUsers();
        res.status(200).send({
            message: `SUCCESS received all users from users collection in Firestore`,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: error occured at /api/user GET endpoint: ${err}` 
        });
    }
});

app.get(`/api/user/:netid`, async (req, res) => {
    console.log("[GET] entering `user/:netid` endpoint");
    const netid =  req.params.netid;
    try {
        const users = await getUser(netid);
        res.status(200).send({
            message: `SUCCESS received user with netid: ${netid} from users collection in Firestore`,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: error occured at /api/user/:netid GET endpoint: ${err}` 
        });
    }
});

app.post(`/api/user/:netid`, async (req, res) => {
    console.log(`[POST] entering user/:netid endpoint`);
    const netid = req.params.netid;
    const { first, last, year, college } = req.body;
    const user = {
        first, 
        last, 
        year,
        college
    };

    try {
        await addUser(netid, user);
        res.status(200).send({
            message: `SUCCESS added user with netid: ${netid} to users collection in Firestore`
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: error occured at /api/user/:netid POST endpoint: ${err}`
        });
    }
});

app.put(`/api/user/year/:netid`, async (req, res) => {
    console.log(`[PUT] entering user/year/:netid endpoint`);
    const netid = req.params.netid;
    const year = req.body.year;

    try {
        await updateYear(netid, year);
        res.status(200).send({
            message: `SUCCESS updated year of user with netid: ${netid} in user collection in Firestore`
        })
    } catch (err) {
        res.status(500).json({
            error: `ERROR: error occurred at /api/user/year/:netid PUT endpoint: ${err}`
        });
    }
});

app.put(`/api/user/college/:netid`, async (req, res) => {
    console.log(`[PUT] entering user/college/:netid endpoint`);
    const netid = req.params.netid;
    const college = req.body.college;

    try {
        await updateCollege(netid, college);
        res.status(200).send({
            message: `SUCCESS updated college of user with netid: ${netid} in user collection in Firestore`
        })
    } catch (err) {
        res.status(500).json({
            error: `ERROR: error occurred at /api/user/college/:netid PUT endpoint: ${err}`
        });
    }
});

app.delete(`/api/user/:netid`, async (req, res) => {
    console.log(`[DELETE] entering user/:netid endpoint`);
    const netid = req.params.netid;

    try {
        await deleteUser(netid);
        res.status(200).send({
            message: `SUCCESS deleted user with netid: ${netid} in user collection in Firestore`
        });
    } catch (err) {
        res.status(500).json({
            error: `ERROR: error occurred at /api/user/:netid DELETE endpoint: ${err}`
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});