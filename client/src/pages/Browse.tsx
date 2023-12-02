import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Container, Divider, FormControlLabel, FormGroup, Grid, Paper, Stack, TextField, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { AccordionInfo, Day, Event, Interval, EventAPIResponse } from "../../../common/Types"
import { accordionData, timeOfDays, allDaysOfWeek } from "../constants/Data"
import LoginPrompt from "../components/Login";
import { useAuth } from "../auth/AuthUserProvider"
import { grayBlue, lightGrayBlue, lightMint, mint } from "../constants/Themes";

const PanelContext = createContext<string | false>(false);
const FilterContext = createContext<string[]>([]);

const EventListing = (props: Event) => {
    const [joined, setJoined] = useState<number>(0);
    const netid = useAuth().netid;

    const handleJoin = async (id: string) => {
        setJoined(1);

        await fetch(`http://localhost:8080/api/user/joined/${netid}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                joinedEvent: id,
                add: true
            })
        });

        await fetch(`http://localhost:8080/api/event/users/${id}`, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                user: netid,
                add: true
            })
        });
        setJoined(2);
    };

    return (
        <>
            <Paper sx = {{margin: 2, backgroundColor: lightMint, borderStyle: "solid", borderColor: mint, borderWidth: "5px"}}>
                <Grid container alignItems = "center" spacing={0} sx={{padding:1}}>
                    <Grid item xs = {8} md = {10}>
                        <Typography variant="h3" sx={{margin: 0}}>{props.title}</Typography>
                        <Typography variant="subtitle1">Hosted by: {props.host}</Typography>
                        
                        <Grid container justifyContent="space-between" >
                            <Details {...props} />
                        </Grid>
                        
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: "-1px" }} />
                    <Grid item xs = {4} md = {2}>
                        <Grid container justifyContent="center"> 
                            <Button variant="contained" disabled={joined != 0} onClick = {() => handleJoin(props.id)}>
                                <Typography variant="body1" sx={{fontWeight:600}}>{joined == 0 ? "Join!" : joined == 1 ? "..." : "Joined!"}</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
}

const Details = (props: Event) => {
    
    const Item = styled('h3')({
        marginTop: 0,
        marginBottom: 0,
    });

    const Location = () => {
        return (
            <Grid item xs = {12} md = {props.now ? 12 : 4}>
                <Item>
                    <Typography variant="h4">
                        <b>Located at:</b><br /> {props.location}
                    </Typography>
                </Item>
            </Grid>
        );
    }

    const toStringTime = (t: Interval) : string => {
        const startPeriod = t.startHr >= 12 ? "pm" : "am";
        const endPeriod = t.endHr >= 12 ? "pm" : "am";

        const times = [t.startHr === 0 ? 12 : t.startHr > 12 ? t.startHr % 12 : t.startHr, t.startMin, 
                        t.endHr === 0 ? 12 : t.endHr > 12 ? t.endHr % 12 : t.endHr, t.endMin]
                        .map((x) => x < 10 ? `0${x}` : `${x}`);

        return `${times[0]}:${times[1]}${startPeriod} - ${times[2]}:${times[3]}${endPeriod}`
    } 


    return (
        <>
            <Location />
            {
                props.now ?
                <></> :
                <> 
                    <Grid item xs = {12} md = {4}>
                        <Item>
                            <Typography variant="h4"><b>Days:</b><br /> {props.days}</Typography>
                        </Item>
                    </Grid>
                    <Grid item xs = {12} md = {4}>
                        <Item>
                            <Typography variant="h4"><b>Time:</b><br />{toStringTime(props.time)}</Typography>
                        </Item>
                    </Grid>
                </>
            }

        </>
    );

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MultiFilter = (props: AccordionInfo & {changeExpand: (p: string | false, e: any) => void, setFilters: (f: string[]) => void}) => { 

    const panel = useContext(PanelContext);
    const filters = useContext(FilterContext);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeActivity = (f : string, e: any) => {
        e.target.checked ? props.setFilters(filters.concat([f])) : props.setFilters(filters.filter((x) => x !== f));
    }
    
    return (
        <>
            <Accordion expanded={panel === props.accordionName} onChange={(e) => props.changeExpand(props.accordionName, e)}>
                <AccordionSummary sx={{backgroundColor: grayBlue}}>
                    <Typography variant="h4" sx={{fontWeight:600}}>{props.accordionName}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{backgroundColor: lightGrayBlue}}>
                    <FormGroup>
                        {props.labelNames.map((item : string) => <FormControlLabel key={item} control = {<Checkbox color="secondary"/>} 
                         label={item}
                        onChange={(e) => changeActivity(item.indexOf(" ") !== -1 ? item.substring(0, item.indexOf(" ")) : item, e)}/>)}
                        
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

const AllFilters = (props: {setFilters: (f: string[]) => void}) => {
        
    const [expanded, setExpanded] = useState<string | false>(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeExpand = (panel : string | false, e: any) => {
        setExpanded(panel === expanded ? false : panel);
        e;
    }

    return (
        <>
            <PanelContext.Provider value={expanded}>
                {accordionData.map((filter) => <>
                    <MultiFilter {...filter} changeExpand = {changeExpand} setFilters = {props.setFilters} key={filter.accordionName}/>
                </>)}
            </PanelContext.Provider>
            
        </>
    );
}

const BrowsePage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState<string>("");
    const [filters, setFilters] = useState<string[]>([]);

    const loggedIn = useAuth().loggedIn;
    const netid = useAuth().netid;

    const isDay = (d:string) : boolean => allDaysOfWeek.includes(d);

    const isTime = (t:string) : boolean => {
        return timeOfDays.includes(t);
    }

    const numToDay = (d:number) : Day => d === 0 ? "Su" :
                                            d == 1 ? "Mo" :
                                            d == 2 ? "Tu" :
                                            d == 3 ? "We" :
                                            d == 4 ? "Th" :
                                            d == 5 ? "Fr" : "Sa" ; 
    const overlapTime = (t1:Interval, t2:Interval | undefined) : boolean =>  {
        return t2 == undefined || !(t1.endHr < t2.startHr || t1.startHr > t2.endHr);
    }

    const timeToInteral = (t:string) : Interval => t === "Morning" ? {startHr:6, startMin:0, endHr:12, endMin:0} :
                                                    t === "Afternoon" ? {startHr:12, startMin:0, endHr:18, endMin:0} : 
                                                    {startHr:18, startMin:0, endHr:22, endMin:0};

    const getAllEvents = async() => {
        return await fetch("http://localhost:8080/api/event")
            .then((res) => res.json())
            .then((data: EventAPIResponse) => data.data);
    }

    useEffect(() => {
        getAllEvents().then((events) => setEvents(events));
    }, []);

    const searchedEvents: Event[] = useMemo(() => {
        return events.filter((item) => {
            const searchQuery: string = search.trim().toLowerCase();
            return item.title.trim().toLowerCase().includes(searchQuery);
        });
    }, [search, events]); 

    const filteredEvents: Event[] = useMemo(() => {
        const nonJoinedEvents = searchedEvents.filter((e) => !e.users.includes(netid ?? ""));

        if (filters.length === 0) return nonJoinedEvents;

        let dayFilters : Day[] = filters.filter((item) => isDay(item)).map((d) => d.substring(0, 2)) as Day[];
        dayFilters = dayFilters.length == 0 ? allDaysOfWeek.map(day => day.substring(0,2)) as Day[] : dayFilters;

        const timeFilters: string[] = filters.filter((item) => isTime(item));

        const dayFiltered = nonJoinedEvents.filter((e) => (e.days.length == 0 ? [numToDay(new Date().getDay())] : e.days).some((d) => dayFilters.includes(d)));
                
        return timeFilters.length == 0 ? 
        dayFiltered :
        dayFiltered.filter((e) => timeFilters.some((time) => overlapTime(timeToInteral(time), e.time)));   

    }, [filters, searchedEvents, netid]);

    const currentEvents = useMemo(() => {
        const nowEvents = filteredEvents.filter((item) => item.now); 
        return (nowEvents.length == 0) ? 
            <Typography variant="h3">No events :(</Typography> :
            nowEvents.map((item) => <EventListing {...item} key={item.title + item.host} />);

    }, [filteredEvents]);

    const nonCurrentEvents = useMemo(() => {
        const notNowEvents = filteredEvents.filter((item) => !item.now);

        return (notNowEvents.length == 0) ? 
        <Typography variant="h3">No events :(</Typography> :
            notNowEvents.map((item) => <EventListing {...item} key={item.title + item.host} />);
    }, [filteredEvents]);

    return(
        <>
            <Container maxWidth="xl">
                <LoginPrompt loggedIn={loggedIn}>
                    <Stack direction="row">
                        <Container sx = {{width:3/4}}>
                            <TextField fullWidth label="Search" variant="outlined" margin="normal" onChange = {(e) => {setSearch(e.target.value)}} color="secondary"/>
                            <Typography variant="h2">Happening Now</Typography>
                            {currentEvents}
                            <Divider />
                            <Typography variant="h2">Scheduled</Typography>
                            {nonCurrentEvents}
                        </Container> 
                        <Container sx ={{width:1/4}}>
                            <Typography variant="h2">Filters</Typography>
                            <Paper elevation={1} sx={{padding:1, backgroundColor: grayBlue}}>
                                <Typography variant="h4"> <div style={{fontWeight:600}}>Current Filters:</div> {filters.length == 0 ? "None" : filters.join(", ")}</Typography>
                            </Paper>
                            <Divider  style={{margin: "10px"}} />
                            <FilterContext.Provider value={filters}>
                                <AllFilters setFilters={setFilters}/>
                            </FilterContext.Provider>
                        </Container>   
                    </Stack>
                </LoginPrompt>
            </Container>
        </>
    );

}

export default BrowsePage;