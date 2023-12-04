import { FieldValue } from "firebase-admin/firestore";

import { db } from "./firebase";
import { Event } from "../common/Types";

const eventCollectionRef = db.collection("events");

export const getEvents = async () => {
  const snapshot = await eventCollectionRef.get();
  let events: Event[] = [];

  snapshot.forEach((doc) => {
    events.push(doc.data() as Event);
  });
  return events;
};

export const getEvent = async (id: string) => {
  const snapshot = await eventCollectionRef.doc(id).get();
  return snapshot.data() as Event;
};

export const getNowEvents = async () => {
  const snapshot = await eventCollectionRef.where("now", "==", true).get();
  let events: Event[] = [];

  snapshot.forEach((doc) => {
    events.push(doc.data() as Event);
  });

  return events;
};

export const getScheduledEvents = async () => {
  const snapshot = await eventCollectionRef.where("now", "==", false).get();
  let events: Event[] = [];

  snapshot.forEach((doc) => {
    events.push(doc.data() as Event);
  });

  return events;
};

export const getHostedEvents = async (netid: string) => {
  const snapshot = await eventCollectionRef
    .where("hostNetid", "==", netid)
    .get();
  let events: Event[] = [];

  snapshot.forEach((doc) => {
    events.push(doc.data() as Event);
  });

  return events;
};

export const getJoinedEvents = async (netid: string) => {
  const snapshot = await eventCollectionRef
    .where("users", "array-contains", netid)
    .where("hostNetid", "!=", netid)
    .get();
  let events: Event[] = [];

  snapshot.forEach((doc) => {
    events.push(doc.data() as Event);
  });

  return events;
};

export const addEvent = async (event: Event) => {
  const newDoc = await eventCollectionRef.add(event);
  await eventCollectionRef.doc(newDoc.id).update({ id: newDoc.id });
  return newDoc.id;
};
export const deleteEvent = async (id: string) => {
  return await eventCollectionRef.doc(id).delete();
};

export const updateTime = async (id: string, time: number[]) => {
  return await eventCollectionRef.doc(id).update({ time: time });
};

export const updateUsers = async (id: string, user: string, add: boolean) => {
  return await eventCollectionRef.doc(id).update({
    users: add ? FieldValue.arrayUnion(user) : FieldValue.arrayRemove(user),
  });
};

export const updateMessages = async (
  id: string,
  message: string,
  netid: string,
  author: string
) => {
  const newMessages = (await getEvent(id)).messages;
  newMessages.push({ message: message, netid: netid, author: author });
  return await eventCollectionRef.doc(id).update({
    messages: newMessages,
  });
};
