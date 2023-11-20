import { AccordionInfo, Event } from "../../../common/Types"


export const sampleData: Event[] = [
    {title: "dinner", now: true, host:"john", location:"bethe", time:null, days:null},
    {title: "tennis", now: false, host: "jane", days: ["Th", "Fr", "Sa", "Su"], location: "mcclintock", time:{startHr:20, startMin:0, endHr:21, endMin:0}},
    {title: "cs 1110 prelim review", now: false, host:"george", days: ["We", "Th"], location: "olin library", time:{startHr:12, startMin:0, endHr: 15, endMin:30}},
    {title: "breakfast", now: true, host:"georgina", location:"morrison", time:null, days:null},
    {title: "volleyball", now: false, host: "bob", location: "court by ckb", days:["Mo"], time:{startHr:10, startMin: 0, endHr: 11, endMin: 30}},
    {title: "free food giveaway", now: true, host:"joe", location:"rbg", time:null, days:null}
]

export const accordionData: AccordionInfo[] = [
    // {accordionName: "Activity", labelNames:["Eat", "Play", "Study"]},
    {accordionName: "Days", labelNames:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
    {accordionName: "Time", labelNames:["Morning (6am - noon)", "Afternoon (noon - 6pm)", "Evening (6pm - 10pm)"]}
]

export const timeOfDays: string[] = ["Morning", "Afternoon", "Evening"];

export const allDaysOfWeek: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];