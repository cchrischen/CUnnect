import cors from "cors";
import express from "express";

import { Event, User } from "../common/Types";
import {
	addEvent,
  deleteEvent,
  getEvent,
  getEvents,
  getHostedEvents,
  getJoinedEvents,
  getNowEvents,
  getScheduledEvents,
  updateMessages,
  updateTime,
  updateUsers,
} from "./event.controller";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateCollege,
  updateFirstName,
  updateLastName,
  updateYear,
} from "./users.controller";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get(`/api/event`, async (req, res) => {
  console.log("[GET] entering `event` endpoint");
  const { eventType } = req.query;

  try {
    const events =
      eventType == "now"
        ? await getNowEvents()
        : eventType == "scheduled"
        ? await getScheduledEvents()
        : await getEvents();

    res.status(200).send({
      message: `SUCCESS received all events from the events collection in Firestore`,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred at /api/event GET endpoint: ${err}`,
    });
  }
});

app.get(`/api/event/:id`, async (req, res) => {
  console.log("[GET] entering `event/:id` endpoint");
  const id = req.params.id;

  try {
    const events = await getEvent(id);

    res.status(200).send({
      message: `SUCCESS received event with id ${id}from the events collection in Firestore`,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred at /api/event/:id GET endpoint: ${err}`,
    });
  }
});

app.get(`/api/event/hosted/:netid`, async (req, res) => {
  console.log("[GET] entering `event/hosted/:netid` endpoint");
  const netid = req.params.netid;

  try {
    const events = await getHostedEvents(netid);

    res.status(200).send({
      message: `SUCCESS received all events hosted by ${netid} from events collection in Firestore`,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occured at /api/hosted/:netid GET endpoint: ${err}`,
    });
  }
});

app.get(`/api/event/joined/:netid`, async (req, res) => {
  console.log("[GET] entering `event/joined/:netid` endpoint");
  const netid = req.params.netid;

  try {
    const events = await getJoinedEvents(netid);

    res.status(200).send({
      message: `SUCCESS received all events joined by ${netid} from events collection in Firestore`,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occured at /api/joined/:netid GET endpoint: ${err}`,
    });
  }
});

app.post(`/api/event`, async (req, res) => {
  console.log("[POST] entering `event/:id` endpoint");
  const { title, now, host, location, time, days, users, hostNetid } = req.body;
  const event: Event = {
    title,
    now,
    host,
    location,
    time,
    days,
    users,
    id: "",
    hostNetid,
    messages: [],
  };

  try {
    const id = await addEvent(event);
    res.status(200).send({
      message: `SUCCESS added event with id: ${id} to events-now collection in Firestore`,
      id: id,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occured at /api/now/:id POST endpoint: ${err}`,
    });
  }
});

app.delete(`/api/event/:id`, async (req, res) => {
  console.log("[DELETE] entering `event/:id` endpoint");
  const id = req.params.id;

  try {
    await deleteEvent(id);

    res.status(200).send({
      message: `SUCCESS current event with id: ${id} deleted in event-now collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: an error occurred at /api/event/:id DELETE endpoint: ${err}`,
    });
  }
});

app.put(`/api/event/users/:id`, async (req, res) => {
  console.log("[PUT] entering `event/users/:id` endpoint");
  const id = req.params.id;
  const user = req.body.user;
  const add = req.body.add;

  try {
    await updateUsers(id, user, add);

    res.status(200).send({
      message: `SUCCESS updated users for event with id: ${id} in events collection`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/event/users/:id PUT endpoint: ${err}`,
    });
  }
});

app.put(`/api/event/scheduled/time/:id`, async (req, res) => {
  console.log("[PUT] entering `event/scheduled/time/:id` endpoint");
  const id = req.params.id;
  const time = req.body.time;

  try {
    await updateTime(id, time);

    res.status(200).send({
      message: `SUCCESS updated scheduled event with id: ${id} with new time`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/event/scheduled/time/:id PUT endpoint: ${err}`,
    });
  }
});

app.put(`/api/event/messages/:id`, async (req, res) => {
  console.log("[PUT] entering event/messages/:id endpoint");
  const id = req.params.id;
  const { message, netid, author } = req.body;

  try {
    await updateMessages(id, message, netid, author);

    res.status(200).json({
      message: `SUCCESS updated messages for event with id:${id} with new message`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/event/messages/:id PUT endpoint: ${err}`,
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
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occured at /api/user GET endpoint: ${err}`,
    });
  }
});

app.get(`/api/user/:netid`, async (req, res) => {
  console.log("[GET] entering `user/:netid` endpoint");
  const netid = req.params.netid;
  try {
    const users = await getUser(netid);
    res.status(200).send({
      message: `SUCCESS received user with netid: ${netid} from users collection in Firestore`,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occured at /api/user/:netid GET endpoint: ${err}`,
    });
  }
});

app.post(`/api/user/:netid`, async (req, res) => {
  console.log(`[POST] entering user/:netid endpoint`);
  const netid = req.params.netid;
  const { first, last, year, college } = req.body;
  const user: User = {
    first,
    last,
    year,
    college,
  };

  try {
    await addUser(netid, user);
    res.status(200).send({
      message: `SUCCESS added user with netid: ${netid} to users collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occured at /api/user/:netid POST endpoint: ${err}`,
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
      message: `SUCCESS updated year of user with netid: ${netid} in user collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/user/year/:netid PUT endpoint: ${err}`,
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
      message: `SUCCESS updated college of user with netid: ${netid} in user collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/user/college/:netid PUT endpoint: ${err}`,
    });
  }
});

app.put(`/api/user/first/:netid`, async (req, res) => {
  console.log(`[PUT] entering user/first/:netid endpoint`);
  const netid = req.params.netid;
  const first = req.body.first;

  try {
    await updateFirstName(netid, first);
    res.status(200).send({
      message: `SUCCESS updated first name of user with netid: ${netid} in user collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/user/first/:netid PUT endpoint: ${err}`,
    });
  }
});

app.put(`/api/user/last/:netid`, async (req, res) => {
  console.log(`[PUT] entering user/last/:netid endpoint`);
  const netid = req.params.netid;
  const last = req.body.last;

  try {
    await updateLastName(netid, last);
    res.status(200).send({
      message: `SUCCESS updated last name of user with netid: ${netid} in user collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/user/last/:netid PUT endpoint: ${err}`,
    });
  }
});

app.delete(`/api/user/:netid`, async (req, res) => {
  console.log(`[DELETE] entering user/:netid endpoint`);
  const netid = req.params.netid;

  try {
    await deleteUser(netid);
    res.status(200).send({
      message: `SUCCESS deleted user with netid: ${netid} in user collection in Firestore`,
    });
  } catch (err) {
    res.status(500).json({
      error: `ERROR: error occurred at /api/user/:netid DELETE endpoint: ${err}`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
