import { Button, Container } from "@mui/material";
import { ReactNode } from "react";
import { signIn } from "../auth/auth";

type LoginProps = {
    children: ReactNode;
    loggedIn: boolean;
}

const LoginPrompt = (props: LoginProps) => {

    const handleLogIn = async () => {
        return await signIn();
    }

    const style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }

    return (
        <>
            {
            props.loggedIn?
            props.children :
            <>
                <Container sx={style}>
                    <h1>Please login to access this page</h1>
                    <Button variant="outlined" onClick={handleLogIn}>Login</Button>
                </Container>
            </>
            }
        </>
    );
};

export default LoginPrompt;