export type Day = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";

export type Activity = "Eat" | "Play" | "Study" | "";

export type AccordionInfo = {
    accordionName: string,
    labelNames: string[]
};

export type Event = {
    title: string,
    now: boolean,
    host: string,
    location: string,
    time?: Interval,
    days?: Day[]
};

export type currentEvent = {
    title: string,
    host: string,
    location: string
}

export type scheduledEvent = {
    title: string,
    host: string,
    location: string,
    time: Interval,
    days: Day[]
}

export type Interval = {
    startHr:number,
    startMin:number,
    endHr:number,
    endMin:number
};