import { AccordionInfo, Event, User } from "../../../common/Types"

export const accordionData: AccordionInfo[] = [
    // {accordionName: "Activity", labelNames:["Eat", "Play", "Study"]},
    {accordionName: "Days", labelNames:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
    {accordionName: "Time", labelNames:["Morning (6am - noon)", "Afternoon (noon - 6pm)", "Evening (6pm - 10pm)"]}
]

export const timeOfDays: string[] = ["Morning", "Afternoon", "Evening"];

export const allDaysOfWeek: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const colleges: string[] = ["AAP", "Brooks","CAS", "CALS", "CoE", "Dyson", "Hotel", "HuMec", "ILR"];

export const tempEvent: Event = {title:"Loading Data...", host:"bruh", now: true, location:"here", days:[], users:["cc2785", "jd1"], id:"", time:{startHr:-1, startMin:-1, endHr:-1, endMin:-1}, messages:[
    {message: "howdy", author: "Chris", netid: "cc2785"}, {message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat", author: "John", netid: "jd1"},
    {message: "g elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ul", author: "John", netid: "jd1"},
    {message: "g elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ul", author: "John", netid: "jd1"}
]};

export const tempUser: User = {first: "Loading...", last: "", college: "AAP", year: 1, joinedEvents: [], hostedEvents: []}