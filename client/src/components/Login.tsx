import { Button, Container, Typography } from "@mui/material";
import { ReactNode } from "react";

import { signIn } from "../auth/auth";

type LoginProps = {
  children: ReactNode;
  loggedIn: boolean;
};

const LoginPrompt = (props: LoginProps) => {
  const handleLogIn = async () => {
    return await signIn();
  };

  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return props.loggedIn ? (
    props.children
  ) : (
    <Container sx={style}>
      <Typography variant="h2">Please login to access this page</Typography>
      <Button variant="contained" onClick={handleLogIn}>
        <Typography variant="h4">Login</Typography>
      </Button>
    </Container>
  );
};

export default LoginPrompt;
