import { AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import { Diversity3 } from "@mui/icons-material"
import { PATHS } from "../constants/Navigation";
import { Link } from "react-router-dom";

const HeaderSimple = () => {

    const pages = PATHS.slice(1).map((page) => <>
        <Link key={page.label} to={page.link}>
            <Button sx={{ color: "white", display: "block"}}>{page.label}</Button>
        </Link>
    </>);

    return (
        <>
            <Box >
                <AppBar position="static">
                    <Toolbar>
                            <Link to={PATHS[0].link}>
                                <Button sx ={{ color: "white", mr:3}}>
                                    <Diversity3 sx ={{mr:1}}/>
                                    <Typography variant="h5" sx ={{fontWeight:700, letterSpacing: ".1rem", textTransform:"capitalize"}}>CUnnect</Typography> 
                                </Button>
                            </Link>
                            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }}}>
                                {pages}
                            </Box>

                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );

}

export default HeaderSimple;