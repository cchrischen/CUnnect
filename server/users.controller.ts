import { db } from "./firebase";
import { User } from "@full-stack/types";

const userCollectionRef = db.collection("people");

export const getUsers = async () => {
  const snapshot = await userCollectionRef.get();
  let users: User[] = [];

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

  if ((await newUser.get()).exists) {
    return;
  }

  return await newUser.set(user);
};

export const updateYear = async (netid: string, year: string) => {
  return await userCollectionRef.doc(netid).update({ year: year });
};

export const updateCollege = async (netid: string, college: string) => {
  return await userCollectionRef.doc(netid).update({ college: college });
};

export const updateFirstName = async (netid: string, first: string) => {
  return await userCollectionRef.doc(netid).update({ first: first });
};

export const updateLastName = async (netid: string, last: string) => {
  return await userCollectionRef.doc(netid).update({ last: last });
};

export const deleteUser = async (netid: string) => {
  return await userCollectionRef.doc(netid).delete();
};
