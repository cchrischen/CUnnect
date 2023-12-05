import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, MoreVert, People } from "@mui/icons-material";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import LoginPrompt from "../components/Login";

import { useAuth } from "../auth/AuthUserProvider";
import { Event, User } from "@full-stack/types";
import { colleges, serverBaseURL, tempUser } from "../constants/Constants";
import { generalTheme, lightMint, mint } from "../constants/Themes";

type PanelProps = {
  children: ReactNode;
  value: number;
  index: number;
};

const PanelTab = (props: PanelProps) => {
  return (
    <>
      <div
        hidden={props.value != props.index}
        id={`vertical-tabpanel-${props.index}`}
        style={{ width: "-webkit-fill-available" }}
      >
        {props.children}
      </div>
    </>
  );
};

const GridLabel = (prop: { label: string }) => {
  return (
    <Grid item xs={12} md={3}>
      <Typography variant="h3" sx={{ margin: "20px", fontSize: "27px" }}>
        {prop.label}
      </Typography>
    </Grid>
  );
};

type ProfileDetailsProps = {
  children: ReactNode[];
  netid: string;
  editing: number;
  setEditing: (i: number) => void;
  details: (string | number | null)[];
};

const ProfileDetails = (props: ProfileDetailsProps): JSX.Element => {
  const labels = ["First", "Last", "College", "Year"];
  const [saving, setSaving] = useState<boolean>(false);

  const handleIconClick = (index: number) => props.setEditing(index);
  const handleCancel = () => props.setEditing(-1);

  const handleSave = async (index: number) => {
    const updatedDetail = labels[index].toLowerCase();
    const url = `${serverBaseURL}/api/user/${updatedDetail}/${props.netid}`;
    const body: { [key: string]: string | number | null } = {};
    body[updatedDetail] = props.details[index];
    setSaving(true);

    await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    setSaving(false);
    props.setEditing(-1);
  };

  return( 
    <>
  {props.children.map((child, index) => (
      <Box key={labels[index]} sx={{ display: "flex", width: "100%" }}>
        <GridLabel label={labels[index]} />
        <Grid item xs={9}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>{child}</Box>
            {props.editing == index ? (
              <Box>
                <Button
                  color="secondary"
                  variant="contained"
                  sx={{ marginRight: "10px" }}
                  onClick={() => handleSave(index)}
                >
                  {saving ? "..." : "SAVE"}
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleCancel}
                >
                  CANCEL
                </Button>
              </Box>
            ) : (
              <IconButton onClick={() => handleIconClick(index)}>
                <Edit />
              </IconButton>
            )}
          </Stack>
        </Grid>
      </Box>
    ))}
    </>
  );
};

const ProfilePanel = (props: User & { netid: string }) => {
  const [first, setFirst] = useState<string>(props.first);
  const [last, setLast] = useState<string>(props.last);
  const [college, setCollege] = useState<string | null>(props.college);
  const [year, setYear] = useState<number | null>(props.year);

  const [editing, setEditing] = useState<number>(-1);

  const numToYear = (num: number) => {
    return num == 1
      ? "Freshman"
      : num == 2
      ? "Sophomore"
      : num == 3
      ? "Junior"
      : "Senior";
  };

  const yearToNum = (year: string) => {
    return year == "Freshman"
      ? 1
      : year == "Sophomore"
      ? 2
      : year == "Junior"
      ? 3
      : 4;
  };

  useMemo(() => {
    setFirst(props.first);
    setLast(props.last);
    setCollege(props.college);
    setYear(props.year);
  }, [props]);

  return (
    <>
      <Container>
        <Grid container alignItems="center" spacing={0} sx={{ padding: 2 }}>
          <ProfileDetails
            editing={editing}
            setEditing={setEditing}
            {...props}
            details={[first, last, college, year]}
          >
            <TextField
              disabled={editing != 0}
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              color="secondary"
            />
            <TextField
              disabled={editing != 1}
              value={last}
              onChange={(e) => setLast(e.target.value)}
              color="secondary"
            />
            <Select
              value={college ?? ""}
              disabled={editing != 2}
              onChange={(e) => setCollege(e.target.value)}
              color="secondary"
            >
              {colleges.map((c) => {
                return (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                );
              })}
            </Select>
            <Select
              value={year ? numToYear(year) : ""}
              disabled={editing != 3}
              onChange={(e) => setYear(yearToNum(e.target.value))}
              color="secondary"
            >
              {[...Array(5).keys()].slice(1).map((i) => {
                return (
                  <MenuItem key={i} value={numToYear(i)}>
                    {numToYear(i)}
                  </MenuItem>
                );
              })}
            </Select>
          </ProfileDetails>
        </Grid>
      </Container>
    </>
  );
};

const EventPaper = (
  props: User &
    Event & { refresh: () => void; eventType: string; netid: string }
) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
    handleMenu();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${serverBaseURL}/api/event/${id}`, { method: "DELETE" });

    return props.refresh();
  };

  const handleLeave = async (id: string) => {
    await fetch(`${serverBaseURL}/api/event/users/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user: props.netid,
        add: false,
      }),
    });

    return props.refresh();
  };

  return (
    <>
      <Paper
        sx={{
          margin: "10px",
          padding: "10px",
          backgroundColor: lightMint,
          borderStyle: "solid",
          borderColor: mint,
          borderWidth: "5px",
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Link to={`/chat/${props.id}`}>
            <Box sx={{ cursor: "pointer", color: "#000000" }}>
              <Typography variant="h3" sx={{ margin: 0 }}>
                {props.title}
              </Typography>
              <Box sx={{ alignItems: "center", display: "flex" }}>
                <People />
                <Typography
                  sx={{ display: "inline", margin: 0, marginLeft: "5px" }}
                >
                  {props.users.length}
                </Typography>
              </Box>
            </Box>
          </Link>

          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu
            open={isMenuOpen}
            onClose={handleMenu}
            onClick={handleMenu}
            anchorEl={anchorEl}
          >
            <MenuItem
              onClick={
                props.eventType == "hosted"
                  ? () => handleDelete(props.id)
                  : () => handleLeave(props.id)
              }
            >
              {props.eventType == "hosted" ? "Delete" : "Leave"}
            </MenuItem>
          </Menu>
        </Stack>
      </Paper>
    </>
  );
};

const EventPanel = (props: User & { netid: string }) => {
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    await fetch(`${serverBaseURL}/api/event/hosted/${props.netid}`)
      .then((res) => res.json())
      .then((data) => setHostedEvents(data.data));

    await fetch(`${serverBaseURL}/api/event/joined/${props.netid}`)
      .then((res) => res.json())
      .then((data) => {
        setJoinedEvents(data.data);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Container key={`EventPanel-${props.netid}`}>
      <Typography variant="h2">Events you have created</Typography>
      {hostedEvents.map((e) => {
        return (
          <EventPaper
            {...props}
            {...e}
            refresh={fetchEvents}
            eventType="hosted"
          />
        );
      })}
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h2">Events you have joined</Typography>
      {joinedEvents.map((e) => {
        return (
          <EventPaper
            {...props}
            {...e}
            refresh={fetchEvents}
            eventType="joined"
          />
        );
      })}
    </Container>
  );
};

const ProfilePage = () => {
  const [value, setValue] = useState<number>(0);
  const [user, setUser] = useState<User>(tempUser);
  const netid = useAuth().netid ?? "";
  const loggedIn = useAuth().loggedIn;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any, val: number) => {
    setValue(val);
  };

  const fetchUserInfo = async () => {
    return await fetch(`${serverBaseURL}/api/user/${netid}`)
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

  return (
    <>
      <Container>
        <LoginPrompt loggedIn={loggedIn}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", fontSize: "60px" }}
          >
            Hello {user.first}!
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Tabs
              orientation="vertical"
              sx={{ borderColor: "divider", width: "150px" }}
              value={value}
              onChange={handleChange}
            >
              <Tab sx={tabStyle} label="My Profile" id="vertical-tab-0" />
              <Tab sx={tabStyle} label="My Events" id="vertical-tab-1" />
            </Tabs>
            <PanelTab value={value} index={0}>
              <ProfilePanel {...user} netid={netid} />
            </PanelTab>
            <PanelTab value={value} index={1}>
              <EventPanel {...user} netid={netid} />
            </PanelTab>
          </Box>
        </LoginPrompt>
      </Container>
    </>
  );
};

export default ProfilePage;
