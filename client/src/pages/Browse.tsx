import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Container, Divider, FormControlLabel, FormGroup, Grid, Paper, Stack, TextField, Typography } from "@mui/material"
import { styled } from "@mui/system"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { AccordionInfo, Day, Event, Interval, EventAPIResponse } from "../../../common/Types"
import { accordionData, timeOfDays, allDaysOfWeek } from "../constants/Data"
import LoginPrompt from "../components/Login";
import { useAuth } from "../auth/AuthUserProvider"

const PanelContext = createContext<string | false>(false);
const FilterContext = createContext<string[]>([]);

const EventListing = (props: Event) => {
    return (
        <>
            <Paper sx = {{margin: 4}}>
                <Grid container alignItems = "center" spacing={0} sx={{padding:1}}>
                    <Grid item xs = {8} md = {10}>
                        <h2 style={{marginBottom:0, marginTop:15}}>{props.title}</h2>
                        <p style={{marginTop:0}}>Created by: {props.host}</p>
                        
                        <Grid container justifyContent="space-between" >
                            <Details {...props} />
                        </Grid>
                        
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mr: "-1px" }} />
                    <Grid item xs = {4} md = {2}>
                        <Grid container justifyContent="center"> 
                            <Button variant="contained">Join!</Button>
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
            <>
                <Grid item xs = {12} md = {4}>
                    <Item>Located at: {props.location}</Item>
                </Grid>
            </>
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
        props.now ?
        <>
            <Location />
        </> :
        <>
            <Location />
            <Grid item xs = {12} md = {4}>
                <Item>Days: {props.days}</Item>
            </Grid>
            <Grid item xs = {12} md = {4}>
                <Item>Time: {toStringTime(props.time)}</Item>
            </Grid>
        </>
    );

}

const Heading = (props:{value: string, size?: number}) => {
    return (
        <>
            <h1 style={{fontSize:(props.size ?? 30)}}>{props.value}</h1>
        </>
    );
};

const MultiFilter = (props: AccordionInfo & {changeExpand: (p: string | false, e) => void, setFilters: (f: string[]) => void}) => { 

    const panel = useContext(PanelContext);
    const filters = useContext(FilterContext);

    const changeActivity = (f : string, e) => {
        e.target.checked ? props.setFilters(filters.concat([f])) : props.setFilters(filters.filter((x) => x !== f));
    }
    
    return (
        <>
            <Accordion expanded={panel === props.accordionName} onChange={(e) => props.changeExpand(props.accordionName, e)}>
                <AccordionSummary sx={{backgroundColor:"lightgray"}}>
                    {props.accordionName}
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {props.labelNames.map((item : string) => <FormControlLabel key={item} control = {<Checkbox/>} label={item} 
                        onChange={(e) => changeActivity(item.indexOf(" ") !== -1 ? item.substring(0, item.indexOf(" ")) : item, e)}/>)}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

const AllFilters = (props: {setFilters: (f: string[]) => void}) => {
        
    const [expanded, setExpanded] = useState<string | false>(false);

    const changeExpand = (panel : string | false, e) => {
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
        if (loggedIn) {
            getAllEvents().then((e) => setEvents(e));
        }
    }, []);

    const searchedEvents: Event[] = useMemo(() => {
        return events.filter((item) => {
            const searchQuery: string = search.trim().toLowerCase();
            return item.title.trim().toLowerCase().includes(searchQuery);
        });
    }, [search, events]); 

    const filteredEvents: Event[] = useMemo(() => {

        if (filters.length === 0) return searchedEvents;

        let dayFilters : Day[] = filters.filter((item) => isDay(item)).map((d) => d.substring(0, 2)) as Day[];
        dayFilters = dayFilters.length == 0 ? allDaysOfWeek.map(day => day.substring(0,2)) as Day[] : dayFilters;

        let timeFilters: string[] = filters.filter((item) => isTime(item));
        timeFilters = timeFilters.length == 0 ? timeOfDays : timeFilters;

        return searchedEvents.filter((e) => (e.days.length == 0 ? [numToDay(new Date().getDay())] : e.days).some((d) => dayFilters.includes(d)))
                .filter((e) => timeFilters.some((time) => overlapTime(timeToInteral(time), e.time)));   

    }, [filters, searchedEvents]);

    const currentEvents = useMemo(() => {
        const nowEvents = filteredEvents.filter((item) => item.now); 
        return (nowEvents.length == 0) ? 
            <h2>No events :(</h2> :
            nowEvents.map((item) => <EventListing {...item} key={item.title + item.host} />);

    }, [filteredEvents]);

    const nonCurrentEvents = useMemo(() => {
        const notNowEvents = filteredEvents.filter((item) => !item.now);

        return (notNowEvents.length == 0) ? 
            <h2>No events :(</h2> :
            notNowEvents.map((item) => <EventListing {...item} key={item.title + item.host} />);
    }, [filteredEvents]);

    return(
        <>
            <Box>
                <LoginPrompt loggedIn={loggedIn}>
                    <Stack direction="row">
                        <Container sx = {{width:3/4}}>
                            <TextField fullWidth label="Search" variant="outlined" margin="normal" onChange = {(e) => {setSearch(e.target.value)}}/>
                            <Heading value = "Happening Now" />
                            {currentEvents}
                            <Divider />
                            <Heading value = "Scheduled" />
                            {nonCurrentEvents}
                        </Container> 
                        <Container sx ={{width:1/4}}>
                            <Heading value="Filters"/>
                            <Paper elevation={1} sx={{padding:1}}>
                                <Typography>Current Filters: {filters.length == 0 ? "None" : filters.join(", ")}</Typography>
                            </Paper>
                            <Divider />
                            <FilterContext.Provider value={filters}>
                                <AllFilters setFilters={setFilters}/>
                            </FilterContext.Provider>
                        </Container>   
                    </Stack>
                </LoginPrompt>
            </Box>
        </>
    );

}

export default BrowsePage;