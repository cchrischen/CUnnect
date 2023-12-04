import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, Diversity3 } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";

import { signIn, signOut } from "../auth/auth";
import { useAuth } from "../auth/AuthUserProvider";
import { PATHS } from "../constants/Navigation";

const HeaderSimple = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = useAuth().loggedIn;

  const handleSignIn = async () => {
    if (isLoggedIn) {
      await signOut();
    } else {
      await signIn();
    }
  };

  const handleMenu = () => {
    setIsOpen(!isOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
    handleMenu();
  };

  const pages = PATHS.slice(1, 3).map((page) => (
    <Link key={page.label} to={page.link}>
      <Button sx={{ color: "white", display: "block" }}>
        <Typography variant="h3" sx={{ fontSize: "25px" }}>
          {page.label}
        </Typography>
      </Button>
    </Link>
  ));

  return (
    <>
      <Box>
        <AppBar position="static">
          <Toolbar sx={{ margin: "5px 0px" }}>
            <Link to={PATHS[0].link}>
              <Button sx={{ color: "white", mr: 3 }}>
                <Diversity3 sx={{ mr: 1 }} />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: ".1rem",
                    textTransform: "capitalize",
                    margin: 0,
                  }}
                >
                  CUnnect
                </Typography>
              </Button>
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>{pages}</Box>
            <Box>
              {!isLoggedIn ? (
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleSignIn}
                >
                  Login
                </Button>
              ) : (
                <>
                  <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleMenuOpen}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    open={isOpen}
                    onClose={handleMenu}
                    onClick={handleMenu}
                    anchorEl={anchorEl}
                  >
                    <MenuItem>
                      <Link to={`/profile`}>
                        <Typography sx={{ color: "#000000" }}>
                          Profile
                        </Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleSignIn}>Sign Out</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default HeaderSimple;
