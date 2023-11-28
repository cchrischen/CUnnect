import { Container } from "@mui/material";

const ErrorPage = () => {
    const style = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }

    return(
        <Container sx={style}>
            <h1>Uh oh!</h1>
            <h3>Make sure your link is right.</h3>
        </Container>
    );
}  

export default ErrorPage;