import BrowsePage from "../pages/Browse";
import ChatPage from "../pages/Chat";
import ErrorPage from "../pages/Error";
import HomePage from "../pages/Home";
import HostPage from "../pages/Host";
import ProfilePage from "../pages/Profile";

export const PATHS: {
  link: string;
  label: string;
  element: JSX.Element;
}[] = [
  {
    link: "/",
    label: "Home",
    element: <HomePage />,
  },
  {
    link: "/browse",
    label: "Browse",
    element: <BrowsePage />,
  },
  {
    link: "/host",
    label: "Host",
    element: <HostPage />,
  },
  {
    link: "/profile",
    label: "Profile",
    element: <ProfilePage />,
  },
  {
    link: "chat/:id",
    label: "Chat",
    element: <ChatPage />,
  },
  {
    link: "*",
    label: "Error",
    element: <ErrorPage />,
  },
];
