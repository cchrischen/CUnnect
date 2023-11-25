import { AccordionInfo, Event, User } from "../../../common/Types"

export const accordionData: AccordionInfo[] = [
    // {accordionName: "Activity", labelNames:["Eat", "Play", "Study"]},
    {accordionName: "Days", labelNames:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
    {accordionName: "Time", labelNames:["Morning (6am - noon)", "Afternoon (noon - 6pm)", "Evening (6pm - 10pm)"]}
]

export const timeOfDays: string[] = ["Morning", "Afternoon", "Evening"];

export const allDaysOfWeek: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const colleges: string[] = ["AAP", "Brooks","CAS", "CALS", "CoE", "Dyson", "Hotel", "HuMec", "ILR"];

export const tempEvent: Event = {title:"Loading Data...", host:"", now: true, location:"", days:[], users:[], id:"", time:{startHr:-1, startMin:-1, endHr:-1, endMin:-1}};

export const tempUser: User = {first: "Loading...", last: "", college: "AAP", year: 1, joinedEvents: [], hostedEvents: []}