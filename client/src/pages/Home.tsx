import { ConnectWithoutContact, Search } from "@mui/icons-material";
import { Box, Container, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom"
import { PATHS } from "../constants/Navigation";
import { useState } from "react";
import Connect from "../assets/connect.png";
import { mint, grayBlue, pastelBeige} from "../constants/Themes";

const subBoxStyle = {paddingY: "20px", height: " 100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"};

const TitleBox = () => {
    
    return(
        <Container maxWidth="md" sx={{paddingY: "40px"}}>
            <Box sx={{display: "flex", justifyContent: "center", marginBottom: "30px"}}>
                <img src={Connect}></img>
            </Box>
            <Typography variant="h1">CUnnect</Typography>
            <Typography variant="h4" sx={{fontSize: "50px"}}>Eat, Study, Play Together</Typography>
        </Container>
    );
};
    
const BrowseBox = (props: {inBox: boolean}) => {
    return(
        <Container maxWidth="md" sx={subBoxStyle}>
            <Search sx={{fontSize: props.inBox ? "250px" : "200px", marginBottom: "30px", color: "#203547"}}/>
            <Typography variant="h1" sx={{fontSize: "40px", color: "#203547"}}>
                Browse
            </Typography>
        </Container>
    );
};

const HostBox = (props: {inBox: boolean}) => {
    return(
        <Container maxWidth="md" sx={subBoxStyle}>
            <ConnectWithoutContact sx={{fontSize: props.inBox ? "250px" : "200px", marginBottom: "30px", color: "#203547"}}/>
            <Typography variant="h1" sx={{fontSize: "40px", color: "#203547"}}>
                Host
            </Typography>
        </Container>
    );
};

const HomePage = () => {
    const [mousePos, setMousePos] = useState<number>(0);

    const handleMouseEnter = (pos: number) => {
        setMousePos(pos);
    };

    return(
        <Stack sx={{height:"100vh"}} direction="row">
            <Box sx={{backgroundColor: mint, width: 2/3}} onMouseEnter={() => handleMouseEnter(0)}>
                <TitleBox />
            </Box>
            <Box sx={{width: 1/3}}>
                <Stack sx={{height: "100%"}}>
                    <Box sx={{backgroundColor: grayBlue, height:1/2}} onMouseEnter={() => handleMouseEnter(1)}>
                        <Link to={PATHS[1].link}>
                            <BrowseBox inBox={mousePos == 1}/>
                        </Link>
                    </Box>
                    <Box sx={{backgroundColor: pastelBeige, height: 1/2}} onMouseEnter={() => handleMouseEnter(2)}>
                        <Link to={PATHS[2].link}>
                            <HostBox inBox={mousePos == 2}/>
                        </Link>
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
};

export default HomePage;