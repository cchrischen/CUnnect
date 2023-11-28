import { auth } from "../utils/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const signIn = async () => {

    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        const token = credential?.accessToken;
        const netid: string | null = user.email == null ? null : user.email.slice(0, user.email.indexOf("@"));

        return { token, user, netid };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        const code = err.code;
        const message = err.message;

        console.log(
            `An error ${code} occurred when logging user with message: ${message}`
        );
        return null;
    }

};

export const signOut = async () => {
    await auth.signOut();
}