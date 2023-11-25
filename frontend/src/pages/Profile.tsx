import { Box, Container, Dialog, DialogTitle, Divider, Grid, IconButton, Tab, Menu, MenuItem, Paper, Stack, Tabs, TextField, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event, User } from "../../../common/Types";
import { colleges, tempEvent, tempUser } from "../constants/Data";
import { MoreVert, People } from "@mui/icons-material";

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
            <Grid item xs = {12} md = {2}>
                <h2>{prop.label}</h2>
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
                    <Grid item xs={10}>
                        <TextField disabled value={props.first}/>
                    </Grid>
                    <GridLabel label="Last" />
                    <Grid item xs={10}>
                        <TextField disabled value={props.last}/>
                    </Grid>
                    <GridLabel label="College" />
                    <Grid item xs={10}>
                        <Select value={props.college} disabled>
                            {colleges.map((c) => {
                                return(
                                    <MenuItem value={c}>{c}</MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                    <GridLabel label="Year" />
                    <Grid item xs={10}>
                        <Select value={numToYear(props.year)} disabled>
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


const EventPaper = (props: {event: string, refresh: () => void, eventType: string, netid: string, events: string[]}) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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
    
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        handleMenu();
    };
    
    const handleDelete = async (e, id: string) => {
        await fetch(`http://localhost:8080/api/event/${id}`, {method:"DELETE"});

        props.eventType == "joined" ?
        await fetch(`http://localhost:8080/api/user/joined/${props.netid}`, {
            method:"PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
          
            body: JSON.stringify({
                joinedEvents: props.events.filter((e) => e != id)
            })
        }) :
        await fetch(`http://localhost:8080/api/user/hosted/${props.netid}`, {
            method:"PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
          
            body: JSON.stringify({
                hostedEvents: props.events.filter((e) => e != id)
            })
        });

        return props.refresh();
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return(
        <>
            <Paper style={{margin: 10, padding: 10}}>
                <Stack direction="row" justifyContent="space-between">
                    <Box sx={{cursor:"pointer"}} onClick={handleDialogOpen}>
                        <h3 style={{margin:0}}>{event.title}</h3>
                        <Box sx={{alignItems:"center", display:"flex"}}>
                            <People/>
                            <p style={{display:"inline", margin:0, marginLeft:5}}>{event.users.length}</p>
                        </Box>
                    </Box>

                    <IconButton onClick={handleMenuOpen}>
                        <MoreVert />
                    </IconButton>
                    <Menu open={isMenuOpen} onClose={handleMenu} onClick={handleMenu} anchorEl={anchorEl}>
                        <MenuItem onClick={(e) => handleDelete(e, event.id)}>
                            Delete
                        </MenuItem>
                    </Menu>
                </Stack>
            </Paper>
            <UserDialog open={isDialogOpen} users={event.users} onClose={handleDialogClose}/>
        </>
    );
};

const UserDialog = (props:{open: boolean, users: string[], onClose:() => void}) => {
    return(
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>
                Users in Event:
            </DialogTitle>
            <ul style={{marginTop:0}}>
                {props.users.map(u => <li>{u}</li>)}
            </ul>
        </Dialog>
    );
};


const EventPanel = (props: User & {refresh: () => void, netid: string}) => {

    return(
        <>
            <Container>
                <h2>Events you have created</h2>
                {props.hostedEvents.map((e) => {
                    return(
                        <EventPaper {...props} event={e} events={props.hostedEvents} eventType="hosted"/>
                    );
                })}
                <Divider sx = {{width: "100%"}}/>
                <h2>Events you have joined</h2>
                {props.joinedEvents.map((e) => {
                    return(
                        <EventPaper {...props} event={e} events={props.joiendEvents} eventType="joined"/>
                    );
                })}
            </Container>
        </>
    );
}

const ProfilePage = () => {
    const params = useParams();
    const [value, setValue] = useState<number>(0);
    const [user, setUser] = useState<User>(tempUser);

    const handleChange = (event, val: number) => {
        setValue(val);
    }

    const fetchUserInfo = async () => {
        return await fetch(`http://localhost:8080/api/user/${params.netid}`)
            .then((res) => res.json())
            .then((data) => data.data[0]);
    };

    const refresh = () => {
        fetchUserInfo().then((u) => setUser(u));
    };

    useEffect(() => {
        refresh();
    }, []);

    return(
        <>
            <Container>
                <h1 style={{textAlign:"center"}}>Hello {user.first}!</h1>
                <Box sx={{ flexGrow: 1, display: 'flex'}}>
                    <Tabs orientation="vertical" sx={{ borderColor: 'divider', width: "150px" }} value = {value} onChange={handleChange}>
                        <Tab label="My Profile" id="vertical-tab-0"/>
                        <Tab label="My Events" id="vertical-tab-1"/>
                    </Tabs>
                    <PanelTab value={value} index={0}>
                        <ProfilePanel {...user}/>
                    </PanelTab>
                    <PanelTab value = {value} index={1}>
                        <EventPanel {...user} refresh={refresh} netid={params.netid}/>
                    </PanelTab>
                </Box>
            </Container>
        </>
    );  
}

export default ProfilePage;