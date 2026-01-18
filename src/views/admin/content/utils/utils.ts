

export type VideoVisibility = "public" | "private";

export const VIDEO_VISIBILITY_OPTIONS:any = [
  {
    label: "Public",
    value: "public",
    icon: "globe",
    description: "Anyone can view this video",
  },
  {
    label: "Private",
    value: "private",
    icon: "lock",
    description: "Only you can access this video",
  },
];

export const FILTERS: Record<string, number> = {
    "Last Day": 1,
    "Last Week": 7,
    "Last Month": 30,
    "Last 3 Months": 90,
    "Last 6 Months": 180,
    "Last Year": 365,
};