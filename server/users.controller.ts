import { db } from "./firebase";
import { User } from "../common/Types";
import { FieldValue } from "firebase-admin/firestore";

const userCollectionRef = db.collection("people");

export const getUsers = async () => {
    const snapshot = await userCollectionRef.get();
    let users : User[]= [];

    snapshot.forEach((u) => {
        users.push(u.data() as User);
    });

    return users;
};

export const getUser = async (netid: string) => {
    const snapshot = await userCollectionRef.doc(netid).get();

    return [snapshot.data() as User];
};

export const addUser = async (netid: string, user: User) => {
    const newUser = userCollectionRef.doc(netid);

    if (((await newUser.get()).exists)) {
        return;
    }

    return await newUser.set(user);
};

export const updateYear = async (netid: string, year: string) => {
    return await userCollectionRef.doc(netid).update({year: year});
};

export const updateCollege = async (netid: string, college: string) => {
    return await userCollectionRef.doc(netid).update({college: college});
};

export const updateJoinedEvents = async (netid: string, joined: string, add: boolean) => {
    console.log(netid, joined, add);
    return await userCollectionRef.doc(netid).update({
        joinedEvents: add ? FieldValue.arrayUnion(joined) : FieldValue.arrayRemove(joined)
    });
};

export const updateHostedEvent = async (netid: string, hosted: string, add: boolean) => {
    return await userCollectionRef.doc(netid).update({
        hostedEvents: add ? FieldValue.arrayUnion(hosted) : FieldValue.arrayRemove(hosted)
    });  
};

export const deleteUser = async (netid: string) => {
    return await userCollectionRef.doc(netid).delete();
};