import Dashboard from "views/Dashboard.js";
import CreateAds from "views/CreatedAds";
import MyAds from "views/MyAds";
import Schedule from "views/Schedule";
import Reports from "views/Reports";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CreateIcon from "@mui/icons-material/Create";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PreviewIcon from "@mui/icons-material/Preview";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Accounts from "views/Accounts";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <AnalyticsIcon sx={{ mr: "20px", fontSize: "25px" }} />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/CreateAds",
    name: "Create Ad",
    icon: <CreateIcon sx={{ mr: "20px", fontSize: "25px" }} />,
    component: CreateAds,
    layout: "/admin",
  },
  {
    path: "/my-ads",
    name: "My Ads",
    icon: <PreviewIcon sx={{ mr: "20px", fontSize: "25px" }} />,
    component: MyAds,
    layout: "/admin",
  },
  {
    path: "/schedule",
    name: "Schedule",
    icon: <CalendarMonthIcon sx={{ mr: "20px", fontSize: "25px" }} />,
    component: Schedule,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "reports",
    icon: <AssessmentIcon sx={{ mr: "20px", fontSize: "25px" }} />,
    component: Reports,
    layout: "/admin",
  },
  {
    path: "/accounts",
    name: "My Accounts",
    icon: <AssessmentIcon sx={{ mr: "20px", fontSize: "25px" }} />,
    component: Accounts,
    layout: "/admin",
  },
];
export default routes;
