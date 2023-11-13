import { db } from "./firebase";
import { currentEvent, scheduledEvent } from "../common/Types";

const eventNowCollectionRef = db.collection("events-now");
const eventScheduledCollectionRef = db.collection("events-scheduled");

export const getEvents = async () => {
    const snapshot = await eventNowCollectionRef.get();
    let events : {[key: string]: any} = {};
   
    snapshot.forEach((doc) => {
        events[doc.id] = doc.data() as Event;
    });
    return events;
};

export const getNowEvents = async () => {
    const snapshot = await eventNowCollectionRef.get();
    let events : {[key: string]: any} = {};

    snapshot.forEach((doc) => {
        events[doc.id] = doc.data() as currentEvent;
    });

    return events;
};

export const getScheduledEvents = async () => {
    const snapshot = await eventScheduledCollectionRef.get();
    let events : {[key: string]: any} = {};

    snapshot.forEach((doc) => {
        events[doc.id] = doc.data() as scheduledEvent;
    });
    
    return events;
};

export const getEventsByDay = async (days: string) => {
    const dayFilters = days.split("-");

    const snapshot = await eventScheduledCollectionRef.where("days", "array-contains-any", dayFilters).get();
    let events: {[key: string]: any} = {};

    snapshot.forEach((doc) => {
        events[doc.id] = doc.data() as scheduledEvent;
    });
    return events;
};

export const addScheduledEvent = async (id: string, event: scheduledEvent) => {
    const newDoc = eventScheduledCollectionRef.doc(id);
    return await newDoc.set(event);
}

export const addCurrentEvent = async (netid: string, event: currentEvent) => {
    const newDoc = eventNowCollectionRef.doc(netid);
    return await newDoc.set(event);
};

export const deleteScheduledEvent = async (id: string) => {
    return await eventScheduledCollectionRef.doc(id).delete();
};

export const deleteCurrentEvent = async (netid: string) => {
    return await eventNowCollectionRef.doc(netid).delete();
};

export const updateTime = async (id: string, time: number[]) => {
    return await eventScheduledCollectionRef.doc(id).update({time: time});
};