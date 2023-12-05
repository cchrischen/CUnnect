import { doc, onSnapshot } from "firebase/firestore";
import {
  Box,
  Container,
  Divider,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import LoginPrompt from "../components/Login";
import VerifyAuth from "../components/Verify";
import ErrorPage from "./Error";

import { useAuth } from "../auth/AuthUserProvider";
import { Event, Message } from "@full-stack/types";
import { serverBaseURL, tempEvent } from "../constants/Constants";
import { grayBlue, lightGrayBlue, lightMint } from "../constants/Themes";
import { db } from "../utils/firebase";

const Details = (props: Event) => {
  return (
    <Container sx={{ paddingY: "20px" }}>
      <Typography variant="h3" sx={{ fontSize: "20px", fontWeight: "normal" }}>
        Hosted by: {props.host}
      </Typography>
      <Typography variant="h3" sx={{ fontSize: "20px", fontWeight: "normal" }}>
        Located at: {props.location}
      </Typography>
      <Divider sx={{ borderBottomWidth: 5, padding: "10px" }} />
      <Typography variant="h3">Users</Typography>
      <ul>
        {props.users.map((user) => (
          <li>
            <Typography variant="h4" sx={{ fontSize: "20px" }}>
              {user}
            </Typography>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const ChatApp = (props: Event) => {
  const [atSend, setAtSend] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const netid = useAuth().netid;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyPress = (event: any) => {
    if (event.key == "Enter") {
      onMouseClick();
    }
  };

  const onMouseEnter = () => setAtSend(true);
  const onMouseLeave = () => setAtSend(false);
  const onMouseClick = async () => {
    if (!sending) {
      if (text.trim() != "") {
        setSending(true);
        const tempText = text;
        setText("");
        const first = await fetch(`${serverBaseURL}/api/user/${netid}`)
          .then((res) => res.json())
          .then((data) => data.data[0].first);

        await fetch(`${serverBaseURL}/api/event/messages/${props.id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: tempText,
            netid: netid,
            author: first,
          }),
        });
      } else {
        setText("");
      }
      setSending(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleText = (e: any) => setText(e.target.value);

  const Message = (props: Message) => {
    const isSender: boolean = useMemo(() => {
      return (netid ?? "") == props.netid;
    }, [props.netid]);

    return (
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "5px",
          alignItems: isSender ? "flex-end" : "flex-start",
        }}
      >
        <Typography variant="subtitle1" sx={{ paddingBottom: 0 }}>
          {props.author}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            backgroundColor: isSender ? "#FFFFFF" : lightMint,
            padding: "5px",
            border: "solid",
            borderColor: "#000000",
            borderWidth: 2,
            borderRadius: 2,
            maxWidth: window.innerWidth / 3,
          }}
        >
          {props.message}
        </Typography>
      </Container>
    );
  };

  return (
    <Stack sx={{ height: "100%", flexDirection: "column" }}>
      <Box
        sx={{
          height: 9 / 10,
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {props.users.length <= 1 ? (
          <Box
            sx={{
              height: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h3">It's only you here...</Typography>
            <Typography variant="h4">Wait until others join!</Typography>
          </Box>
        ) : (
          <>
            {props.messages
              .slice()
              .reverse()
              .map((mes) => (
                <Message {...mes} />
              ))}
          </>
        )}
      </Box>
      <Box
        sx={{
          height: 1 / 10,
          border: "solid",
          borderRadius: 2,
          borderWidth: 3,
        }}
      >
        <Stack direction="row" sx={{ height: "100%" }}>
          <OutlinedInput
            disabled={props.users.length <= 1}
            color="secondary"
            placeholder="Send a message..."
            sx={{ width: 7 / 8 }}
            onKeyDown={handleKeyPress}
            onChange={handleText}
            value={text}
          />
          <Container
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onMouseClick}
            sx={{
              width: 1 / 8,
              backgroundColor: atSend ? grayBlue : lightGrayBlue,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {sending ? (
              <Typography variant="h3">...</Typography>
            ) : (
              <Send sx={{ fontSize: atSend ? "45px" : "40px" }} />
            )}
          </Container>
        </Stack>
      </Box>
    </Stack>
  );
};

const ChatPage = () => {
  const { id } = useParams();
  const loggedIn = useAuth().loggedIn;

  const EventDoc = doc(db, `events/${id}`);

  const [event, setEvent] = useState<Event | null>(tempEvent);

  useEffect(() => {
    const unsubscribe = onSnapshot(EventDoc, (snapshot) => {
      snapshot.exists() ? setEvent(snapshot.data() as Event) : setEvent(null);
    });

    return () => unsubscribe();
  }, [EventDoc]);

  return !event ? (
    <ErrorPage />
  ) : (
    <Box>
      <LoginPrompt loggedIn={loggedIn}>
        <VerifyAuth authorizedUsers={event.users}>
          <Stack sx={{ height: window.innerHeight - 74 }}>
            <Box sx={{ paddingX: 2, backgroundColor: grayBlue }}>
              <Typography variant="h2">{event.title}</Typography>
            </Box>
            <Box
              sx={{
                height: window.innerHeight - 170,
                display: "flex",
                flexGrow: 1,
              }}
            >
              <Stack direction="row" sx={{ display: "flex", flexGrow: 1 }}>
                <Box sx={{ width: 1 / 4, backgroundColor: lightGrayBlue }}>
                  <Details {...event} />
                </Box>
                <Box sx={{ width: 3 / 4 }}>
                  <ChatApp {...event} />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </VerifyAuth>
      </LoginPrompt>
    </Box>
  );
};

export default ChatPage;
