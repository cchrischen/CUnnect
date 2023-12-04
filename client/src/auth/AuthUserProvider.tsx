import { User } from "firebase/auth";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import { auth } from "../utils/firebase";

type AuthData = {
  user: User | null;
  netid: string | null;
  loggedIn: boolean;
};

const AuthUserContext = createContext<AuthData>({
  user: null,
  netid: null,
  loggedIn: false,
});

export default function AuthUserProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [user, setUser] = useState<AuthData>({
    user: null,
    netid: null,
    loggedIn: false,
  });

  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUser({
          user: userAuth,
          netid: userAuth.email
            ? userAuth.email.slice(0, userAuth.email.indexOf("@"))
            : null,
          loggedIn: true,
        });
      } else {
        setUser({ user: null, netid: null, loggedIn: false });
      }
    });
  }, []);

  return (
    <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthUserContext);
  return context;
};
