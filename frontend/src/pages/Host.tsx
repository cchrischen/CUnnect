import { Box, Button, Chip, Container, Grid, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/system"
import { allDaysOfWeek } from "../constants/Data"

const Fields = (props:{now: boolean}) => {
    
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

    const GridLabel = (prop:{label:string}) => {
        return (
            <Grid item xs = {12} md = {2}>
                <h2>{prop.label}</h2>
            </Grid>
        );
    };

    const SelectTime = () => {
        return(
            <>
                <TimeChooser sx={{ml:0}} MenuProps={MenuProps}>
                            {upTo12.map((num) => {
                                return <MenuItem value={num}>{handleTimeToString(num)}</MenuItem>
                            })}
                        </TimeChooser>
                        <h3 style={{display:"inline", margin:10}}>:</h3>
                        <TimeChooser MenuProps={MenuProps}>
                            {mult5to60.map((num) => {
                                return <MenuItem value={num}>{handleTimeToString(num)}</MenuItem>
                            })}
                        </TimeChooser>
                        <TimeChooser>
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
                        <SelectTime />
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
                    <SelectTime />
                </Grid>
                <GridLabel label="End Time" />
                <Grid item xs={10}>
                    <SelectTime />
                </Grid>
            </>
        );
    }

    return (
        <>
            <Grid container alignItems = "center" spacing={0} sx={{padding:2}}>
                <GridLabel label="Title"></GridLabel>
                <Grid item xs={10}>
                    <TextField fullWidth/>
                </Grid>
                <GridLabel label="Location" />
                <Grid item xs={10}>
                    <TextField />
                </Grid>
                {props.now ? <NowFields /> : <LaterFields />}
            </Grid>
        </>
    );
};

const HostPage = () => {
    const [now, setNow] = useState<boolean|undefined>(undefined);

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
                    {now != undefined ? <Fields now={now}/> : <></>}
                    {now != undefined ? <Box style={{display:"flex", justifyContent:"center"}}>
                        <Button variant="outlined">
                            <ButtonText>Submit!</ButtonText>
                        </Button>
                    </Box> : <></>}
                    
                </Stack>

            </Container>
        </>
    );
};

export default HostPage;