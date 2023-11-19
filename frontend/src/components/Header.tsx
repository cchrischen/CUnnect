import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import { Diversity3, AccountCircle } from "@mui/icons-material"
import { PATHS } from "../constants/Navigation";
import { Link } from "react-router-dom";
import { signIn, signOut } from "../auth/auth";
import { useState } from "react";

const HeaderSimple = () => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSignIn = async () => {
        if (isLoggedIn) {
            await signOut();
        } else {
            await signIn();
        }
        setLoggedIn(!isLoggedIn);
    }

    const handleMenu = () => {
        setIsOpen(!isOpen);
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        handleMenu();
    }

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
                        <Box>
                            {
                                !isLoggedIn ?
                                <Button color="inherit" variant="outlined" onClick={handleSignIn}>Login</Button>:
                                <>
                                    <IconButton size="large" color="inherit" onClick={handleMenuOpen}>
                                        <AccountCircle />
                                    </IconButton>
                                    <Menu open={isOpen} onClose={handleMenu} onClick={handleMenu} anchorEl={anchorEl}>
                                        <MenuItem>
                                            Profile
                                        </MenuItem>
                                        <MenuItem onClick={handleSignIn}>
                                            Sign Out
                                        </MenuItem>
                                    </Menu>
                                </>
                            }
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );

}

export default HeaderSimple;