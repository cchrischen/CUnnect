import { Box, Container, Divider, Grid, IconButton, Tab, Menu, MenuItem, Paper, Stack, Tabs, TextField, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Event, User } from "../../../common/Types";
import { colleges, tempEvent, tempUser } from "../constants/Data";
import { MoreVert, People } from "@mui/icons-material";
import { useAuth } from "../auth/AuthUserProvider";
import LoginPrompt from "../components/Login";
import { mint, lightMint, generalTheme } from "../constants/Themes";

type PanelProps = {
    children: React.ReactNode,
    value: number,
    index: number
}

const PanelTab = (props: PanelProps) => {
    return(
        <>
            <div hidden={props.value != props.index} id={`vertical-tabpanel-${props.index}`} style={{width:"750px"}}>
                {props.children}
            </div>
        </>
    );
}

const ProfilePanel = (props: User) => {
    const GridLabel = (prop:{label:string}) => {
        return (
            <Grid item xs = {12} md = {3}>
                <Typography variant="h3" sx={{margin: "20px", fontSize: "27px"}}>{prop.label}</Typography>
            </Grid>
        );
    };

    const numToYear = (num: number) => {
        return num == 1 ? "Freshman" : num == 2 ? "Sophomore" : num == 3 ? "Junior" : "Senior";
    }

    return (
        <>
            <Container>
                <Grid container alignItems = "center" spacing={0} sx={{padding:2}}>
                    <GridLabel label="First" />
                    <Grid item xs={9}>
                        <TextField disabled value={props.first}/>
                    </Grid>
                    <GridLabel label="Last" />
                    <Grid item xs={9}>
                        <TextField disabled value={props.last}/>
                    </Grid>
                    <GridLabel label="College" />
                    <Grid item xs={9}>
                        <Select value={props.college ?? ""} disabled>
                            {colleges.map((c) => {
                                return(
                                    <MenuItem value={c}>{c}</MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                    <GridLabel label="Year" />
                    <Grid item xs={9}>
                        <Select value={props.year ? numToYear(props.year) : ""} disabled>
                            {[...Array(5).keys()].slice(1).map((i) => {
                                return(
                                    <MenuItem value={numToYear(i)}>{numToYear(i)}</MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}


const EventPaper = (props: {event: string, refresh: () => void, eventType: string, netid: string}) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [event, setEvent] = useState<Event>(tempEvent);

    const fetchEvent = async () => {
        return await fetch(`http://localhost:8080/api/event/${props.event}`)
        .then((res) => res.json())
        .then((data) => data.data);
    };
    
    useEffect(() => {
        fetchEvent().then((e) => setEvent(e));
    }, [])

    const handleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget);
        handleMenu();
    };
    
    const handleDelete = async (id: string) => {
        await fetch(`http://localhost:8080/api/event/${id}`, {method:"DELETE"});

        await fetch(`http://localhost:8080/api/user/hosted/${props.netid}`, {
            method:"PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
          
            body: JSON.stringify({
                hostedEvent: event.id,
                add: false
            })
        });

        return props.refresh();
    };

    const handleLeave = async (id: string) => {
        await fetch(`http://localhost:8080/api/event/users/${id}`, {
            method:"PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
          
            body: JSON.stringify({
                user: props.netid,
                add: false
            })
        });

        await fetch(`http://localhost:8080/api/user/joined/${props.netid}`, {
            method:"PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
          
            body: JSON.stringify({
                joinedEvent: event.id,
                add: false
            })
        });

        return props.refresh();
    };

    return(
        <>
            <Paper sx={{margin: "10px", padding: "10px", backgroundColor: lightMint, borderStyle: "solid", borderColor: mint, borderWidth: "5px"}}>
                <Stack direction="row" justifyContent="space-between">
                    <Link to={`/chat/${event.id}`}>
                        <Box sx={{cursor:"pointer", color: "#000000"}}>
                            <Typography variant="h3" sx={{margin: 0}}>{event.title}</Typography>
                            <Box sx={{alignItems:"center", display:"flex"}}>
                                <People/>
                                <Typography sx={{display: "inline", margin: 0, marginLeft: "5px"}}>{event.users.length}</Typography>
                            </Box>
                        </Box>
                    </Link>

                    <IconButton onClick={handleMenuOpen}>
                        <MoreVert />
                    </IconButton>
                    <Menu open={isMenuOpen} onClose={handleMenu} onClick={handleMenu} anchorEl={anchorEl}>
                        <MenuItem onClick={props.eventType == "hosted" ? () => handleDelete(event.id) : () => handleLeave(event.id)}>
                            {props.eventType == "hosted" ? "Delete" : "Leave"}
                        </MenuItem>
                    </Menu>
                </Stack>
            </Paper>
        </>
    );
};


const EventPanel = (props: User & {refresh: () => void, netid: string}) => {

    return(
        <>
            <Container>
                <Typography variant="h2">Events you have created</Typography>
                {props.hostedEvents.map((e) => {
                    return(
                        <EventPaper {...props} event={e} eventType="hosted"/>
                    );
                })}
                <Divider sx = {{width: "100%"}}/>
                <Typography variant="h2">Events you have joined</Typography>
                {props.joinedEvents.map((e) => {
                    return(
                        <EventPaper {...props} event={e} eventType="joined"/>
                    );
                })}
            </Container>
        </>
    );
}

const ProfilePage = () => {
    const [value, setValue] = useState<number>(0);
    const [user, setUser] = useState<User>(tempUser);
    const netid = useAuth().netid;
    const loggedIn = useAuth().loggedIn;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: any, val: number) => {
        setValue(val);
    }

    const fetchUserInfo = async () => {
        return await fetch(`http://localhost:8080/api/user/${netid}`)
        .then((res) => res.json())
        .then((data) => data.data[0]);
    };
    
    const refresh = () => {
        fetchUserInfo().then((u) => setUser(u));
    };
    
    useEffect(() => {
        if (netid && loggedIn) {
            refresh();
        }
    }, [netid]);

    const tabStyle = generalTheme.typography.h3;
    tabStyle.fontSize = "20px";

    return(
        <>
            <Container>
                <LoginPrompt loggedIn={loggedIn}>
                    <Typography variant="h2" sx={{textAlign:"center", fontSize: "60px"}}>Hello {user.first}!</Typography>
                    <Box sx={{ flexGrow: 1, display: 'flex'}}>
                        <Tabs orientation="vertical" sx={{ borderColor: 'divider', width: "150px" }} value = {value} onChange={handleChange}>
                            <Tab sx={tabStyle} label="My Profile" id="vertical-tab-0"/>
                            <Tab sx={tabStyle} label="My Events" id="vertical-tab-1"/>
                        </Tabs>
                        <PanelTab value={value} index={0}>
                            <ProfilePanel {...user}/>
                        </PanelTab>
                        <PanelTab value = {value} index={1}>
                            <EventPanel {...user} refresh={refresh} netid={netid ?? ""}/>
                        </PanelTab>
                    </Box>
                </LoginPrompt>
            </Container>
        </>
    );  
}

export default ProfilePage;