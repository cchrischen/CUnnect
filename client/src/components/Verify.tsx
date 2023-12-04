import { Container, Typography } from "@mui/material";
import { ReactNode } from "react";

import { useAuth } from "../auth/AuthUserProvider";

type VerifyProps = {
  children: ReactNode;
  authorizedUsers: string[];
};

const VerifyAuth = (props: VerifyProps) => {
  const netid = useAuth().netid;

  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return props.authorizedUsers.includes(netid ?? "") ? (
    props.children
  ) : (
    <Container sx={style}>
      <Typography variant="h2">You do not have access to this page.</Typography>
    </Container>
  );
};

export default VerifyAuth;
