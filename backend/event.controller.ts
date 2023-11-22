import { db } from "./firebase";
import { Event } from "../common/Types";

const eventCollectionRef = db.collection("events");

export const getEvents = async () => {
    const snapshot = await eventCollectionRef.get();
    let events : Event[]= [];
   
    snapshot.forEach((doc) => {
        events.push(doc.data() as Event);
    });
    return events;
};

export const getNowEvents = async () => {
    const snapshot = await eventCollectionRef.where("now", "==", true).get();
    let events : Event[]= [];
   
    snapshot.forEach((doc) => {
        events.push(doc.data() as Event);
    });

    return events;
};

export const getScheduledEvents = async () => {
    const snapshot = await eventCollectionRef.where("now", "==", false).get();
    let events : Event[]= [];
   
    snapshot.forEach((doc) => {
        events.push(doc.data() as Event);
    });
    
    return events;
};

export const getEventsByDay = async (days: string) => {
    const dayFilters = days.split("-");

    const snapshot = await eventCollectionRef.where("days", "!=", null)
                    .where("days", "array-contains-any", dayFilters).get();
    let events : Event[]= [];

    snapshot.forEach((doc) => {
        events.push(doc.data() as Event);
    });
    return events;
};

export const addEvent = async (id: string, event: Event) => {
    const newDoc = eventCollectionRef.doc(id);
    return await newDoc.set(event);
}
export const deleteEvent = async (id: string) => {
    return await eventCollectionRef.doc(id).delete();
};

export const updateTime = async (id: string, time: number[]) => {
    return await eventCollectionRef.doc(id).update({time: time});
};