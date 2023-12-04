import { Container, Typography } from "@mui/material";

const ErrorPage = () => {
  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  return (
    <Container sx={style}>
      <Typography variant="h2">Uh oh.</Typography>
      <Typography variant="h4">Make sure your link is right.</Typography>
    </Container>
  );
};

export default ErrorPage;
