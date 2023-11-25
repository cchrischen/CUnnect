import HomePage from "../pages/Home";
import BrowsePage from "../pages/Browse";
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
        element: <BrowsePage />
    },
    {
        link: "/host",
        label: "Host",
        element: <HostPage />
    },
    {
        link: "/profile/:netid",
        label: "Profile",
        element: <ProfilePage />
    }
];