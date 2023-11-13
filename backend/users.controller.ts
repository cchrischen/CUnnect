import { db } from "./firebase";
import { User } from "../common/Types";

const userCollectionRef = db.collection("people");

export const getUsers = async () => {
    const snapshot = await userCollectionRef.get();
    let users : {[key: string]: any} = {};

    snapshot.forEach((u) => {
        users[u.id] = u.data();
    });

    return users;
};

export const getUser = async (netid: string) => {
    const snapshot = await userCollectionRef.doc(netid).get();

    return snapshot.data();
};

export const addUser = async (netid: string, user: User) => {
    const newUser = userCollectionRef.doc(netid);
    return await newUser.set(user);
};

export const updateYear = async (netid: string, year: string) => {
    return await userCollectionRef.doc(netid).update({year: year});
};

export const updateCollege = async (netid: string, college: string) => {
    return await userCollectionRef.doc(netid).update({college: college});
};

export const deleteUser = async (netid: string) => {
    return await userCollectionRef.doc(netid).delete();
};