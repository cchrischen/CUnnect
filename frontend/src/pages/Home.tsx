import { ConnectWithoutContact, Search } from "@mui/icons-material";
import { Button, Box, Container, Divider, Paper, Stack } from "@mui/material";
import { Link } from "react-router-dom"
import { PATHS } from "../constants/Navigation";
import { sampleData as data } from "../constants/Data";
import { Event } from "../../../common/Types";

const Title = () => {
    const headingStyle = {
        fontSize:100,
        margin:0
    }
    
    const subheadingStyle = {
        fontSize:25,
        margin:0
    }

    return(
        <>
            <Stack sx={{height:"100%"}} alignItems="center" justifyContent="center">
                <h1 style={headingStyle}>CUnnect</h1>
                <h3 style={subheadingStyle}>Eat, Play, Study Together</h3>
            </Stack>
        </>
    );

}

const SelectEvents = () => {
    const eventsNow: Event[] = data.filter((x: Event) => x.now);

    return(
        <>
            <h2 style={{textAlign:"center"}}>Some events happening now:</h2>
            <Box>
                <Stack direction="row" justifyContent="space-around">
                    {eventsNow.map((e) => {
                        return(
                            <>
                                <Paper sx={{width:1/5}}>
                                    <h3 style={{fontWeight:400, textAlign:"center"}}>{e.title}</h3>
                                </Paper>
                            </>
                        );
                    })}
                </Stack>
            </Box>
        </>
    );
}

const GettingStarted = () => {

    const containerStyles = {
        marginTop:"1rem", 
        marginBottom: "1rem", 
        height:"90%", 
        alignItems:"center",
    }

    const buttonStyles = {
        width: "200px",
        height:"200px"
    }

    return (
        <>
            <Container style={containerStyles}>
                <Stack direction="row" alignItems="center" justifyContent="space-around" sx={{height:"100%"}}>
                    <Link to={PATHS[1].link}>
                        <Button variant = "outlined" sx={buttonStyles}>
                            <Stack sx={{height: "80%"}}>
                                <h1 style={{fontSize:"100px", marginTop: 0, marginBottom:0, height:"80%"}}>
                                    <Search fontSize="inherit"/>
                                </h1>
                                <h3>Browse</h3>
                            </Stack>
                        </Button>
                    </Link>
                    <Link to={PATHS[2].link}>
                        <Button variant = "outlined" sx={buttonStyles}>
                            <Stack sx={{height: "80%"}}>
                                <h1 style={{fontSize:"100px", marginTop: 0, marginBottom:0, height:"80%"}}>
                                    <ConnectWithoutContact fontSize="inherit"/>
                                </h1>
                                <h3>Host</h3>
                            </Stack>
                        </Button>
                    </Link>
                </Stack>
            </Container>
        </>
    );
}

const HomePage = () => {

    return (
        <>
            <Stack>
                <Box sx={{height:"29vh"}} alignItems="center">
                    <Title />
                </Box>
                <Divider></Divider>
                <Box sx={{height:"35vh"}}>
                    <SelectEvents />
                </Box>
                <Divider></Divider>
                <Box sx={{height:"35vh"}}>
                    <GettingStarted />
                </Box>
            </Stack>
        </>
    );
};

export default HomePage;