import { Box, Button, Chip, Container, Grid, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/system"
import { allDaysOfWeek } from "../constants/Data"
import { Day, Interval } from "../../../common/Types"

const Fields = (props:{now: boolean, updateDays: (d: Day[]) => void, updateTitle: (t: string) => void, updateLocation: (l: string) => void}) => {
    
    const [days, setDays] = useState<string[]>([]);

    const upTo12 = [...Array(13).keys()].slice(1);
    const mult5to60 = [...Array(12).keys()].map((num) => num * 5);

    const TimeChooser = styled(Select)({
        margin: 5,
        minWidth: 100,
    });

    const DayChip = styled(Chip)({
        marginRight: 10,
    })

    const MenuProps = {
        style: {
            maxHeight: "324px",
        },
    }

    const handleTimeToString = (t: number) => {
        return t < 10 ? `0${t}` : `${t}`;
    }

    const handleChipClick = (cLabel: string, e) => {
        days.includes(cLabel) ? setDays(days.filter((d) => d !== cLabel)) : setDays(days.concat([cLabel])); 
    }

    useEffect(() => {
        props.updateDays(days as Day[]);
    }, [days])

    const GridLabel = (prop:{label:string}) => {
        return (
            <Grid item xs = {12} md = {2}>
                <h2>{prop.label}</h2>
            </Grid>
        );
    };

    const SelectTime = (props: {timeType: string}) => {
        return(
            <>
                <TimeChooser sx={{ml:0}} MenuProps={MenuProps} defaultValue={1} className={props.timeType}>
                    {upTo12.map((num) => {
                        return <MenuItem value={num} key={num}>{handleTimeToString(num)}</MenuItem>
                    })}
                </TimeChooser>
                <h3 style={{display:"inline", margin:10}}>:</h3>
                <TimeChooser MenuProps={MenuProps} defaultValue={0} className={props.timeType}>
                    {mult5to60.map((num) => {
                        return <MenuItem value={num} key={num}>{handleTimeToString(num)}</MenuItem>
                    })}
                </TimeChooser>
                <TimeChooser defaultValue="AM" className={props.timeType}>
                    <MenuItem value={"AM"}>AM</MenuItem>
                    <MenuItem value={"PM"}>PM</MenuItem>
                </TimeChooser>
            </>
        );
    }

    const NowFields = () => {
        return (
            <>
                <GridLabel label="Ends at" />
                <Grid item xs={10}>
                    <Box>
                        <SelectTime timeType="end"/>
                    </Box>
                </Grid>
            </>
        );
    }

    const LaterFields = () => {
        return(
            <>
                <GridLabel label= "Days"/>
                <Grid item xs={10}>
                    <Stack direction="row">
                        {allDaysOfWeek.map((day) => day.substring(0,2)).map((day) => {
                            return (
                                <DayChip variant={days.includes(day) ? "filled" : "outlined"} label={day} onClick={(e) => handleChipClick(day, e)}></DayChip>
                            );
                        })}
                    </Stack>
                </Grid>
                <GridLabel label="Start Time" />
                <Grid item xs={10}>
                    <SelectTime timeType="start"/>
                </Grid>
                <GridLabel label="End Time" />
                <Grid item xs={10}>
                    <SelectTime timeType="end"/>
                </Grid>
            </>
        );
    }

    return (
        <>
            <Grid container alignItems = "center" spacing={0} sx={{padding:2}}>
                <GridLabel label="Title"></GridLabel>
                <Grid item xs={10}>
                    <TextField fullWidth onChange={(e) => props.updateTitle(e.target.value)}/>
                </Grid>
                <GridLabel label="Location" />
                <Grid item xs={10}>
                    <TextField onChange={(e) => props.updateLocation(e.target.value)}/>
                </Grid>
                {props.now ? <NowFields /> : <LaterFields />}
            </Grid>
        </>
    );
};

const HostPage = () => {
    const [now, setNow] = useState<boolean|undefined>(undefined);
    const [title, setTitle] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [days, setDays] = useState<Day[]>([]);

    const ButtonText = styled("h2")({
        lineHeight:0,
    });

    const handleTimeChange = (t: string) => {
        t === "now" ?
            now === true ?
                setNow(undefined) : setNow(true)
        : now === false ?
            setNow(undefined) : setNow(false);
    }

    const toIntervalTime = (time: string[]): number[] => {
        let hr = -1;
        let min = -1;
        
        if (time.length == 0) {
            return [hr, min];
        }

        min = parseInt(time[1]);

        if (time[2] == "AM") {
            hr = time[0] == "12" ? 0 : parseInt(time[0]);
        } else {
            hr = time[0] == "12" ? 12 : parseInt(time[0]) + 12;
        }
        
        return [hr, min];
    }

    const getTimeData = (): Interval => {
        let start = Array.from(document.getElementsByClassName("start")).map((el) => Array.from(el.children)[1].value);
        let end = Array.from(document.getElementsByClassName("end")).map((el) => Array.from(el.children)[1].value);

        start = toIntervalTime(start);
        end = toIntervalTime(end);

        return {
            startHr: start[0],
            startMin: start[1],
            endHr: end[0],
            endMin: end[1]
        }

    };

    const handleSubmit = async () => {
        const time = getTimeData();
        const id = "cc2785-2"; // TEMPORARY -- make new id from auth
        return await fetch("http://localhost:8080/api/event/" + id, {
            method:"POST", 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
          
            body: JSON.stringify({
                now: now,
                title: title,
                location: location,
                days: days,
                time: time,
                host: "Chris" // TEMPORARY -- get host name from people firestore collection
            })
        });
    };

    return (
        <>
            <Container sx = {{mt:4}}>
                <Stack>
                    <Box>
                        <Stack direction="row" justifyContent="space-around">
                            <Button variant={now === true ? "contained" : "outlined"} onClick={()=>handleTimeChange("now")}>
                                <ButtonText>Now</ButtonText>
                            </Button>
                            <Button variant={now === false ? "contained" : "outlined"}>
                                <ButtonText onClick={()=>handleTimeChange("notnow")}>Later</ButtonText>
                            </Button>
                        </Stack>
                    </Box>
                    {now != undefined ? <Fields now={now} updateDays={setDays} updateLocation={setLocation} updateTitle={setTitle}/> : <></>}
                    {now != undefined ? <Box style={{display:"flex", justifyContent:"center"}}>
                        <Button variant="outlined" onClick={handleSubmit}>
                            <ButtonText>Submit!</ButtonText>
                        </Button>
                    </Box> : <></>}
                    
                </Stack>

            </Container>
        </>
    );
};

export default HostPage;