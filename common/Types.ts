export type Day = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";

export type Activity = "Eat" | "Play" | "Study" | "";

export type AccordionInfo = {
  accordionName: string;
  labelNames: string[];
};

export type Message = {
  message: string;
  netid: string;
  author: string;
};

export type Event = {
  title: string;
  now: boolean;
  host: string;
  location: string;
  time: Interval;
  days: Day[];
  users: string[];
  id: string;
  hostNetid: string;
  messages: Message[];
};

export type Interval = {
  startHr: number;
  startMin: number;
  endHr: number;
  endMin: number;
};

export type User = {
  first: string;
  last: string;
  year: number | null;
  college: string | null;
};

export type EventAPIResponse = {
  message: string;
  data: Event[];
};
