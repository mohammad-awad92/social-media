import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Card as MuiCard,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import SendIcon from "@mui/icons-material/Send";
const Platforms = {
  instagram: "Instagram",
  facebook: "Facebook",
};

const sumMetricValues = (values) => {
  return values?.reduce(
    (accumulator, currentValue) => accumulator + currentValue?.value,
    0
  );
};

const getMetricValues = (metric, data) => {
  return data?.filter((item) => item.name === metric)[0];
};

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [metric, setMetric] = useState("page_engaged_users");

  console.log("fromDate", fromDate);

  const facebookPages = JSON.parse(
    window.localStorage.getItem("facebook_pages")
  );
  const instagramAccounts = JSON.parse(
    window.localStorage.getItem("social_accounts")
  ).filter((account) => account.socialPlatform === "Instagram");

  const [selectedPage, setSelectedPage] = useState(facebookPages[0]);
  const [selectedPlatform, setSelectedPlatform] = useState(Platforms.facebook);

  let period =
    selectedPlatform == Platforms.instagram ? "Last Month" : "Lifetime";

  const getDataDependOnMetric = (metric) => {
    for (var i = 0; i < data?.length; i++) {
      if (data[i]?.name === metric) return data[i]?.values;
    }
    return;
  };

  // Pie
  const lineChartValues = data[0]?.values?.map((obj) => obj?.value);
  const lineChartLabels = data[0]?.values?.map((obj) =>
    dayjs(obj?.end_time).format("D-MMM")
  );

  console.log("lineChartValues", lineChartValues);

  const getMetricData = (metric) => {
    let metricData = data.filter((item) => item.name === metric)[0];
    return metricData?.values?.[0];
  };

  const getMetricChartData = (metric) => {
    return data.filter((item) => item.name === metric)[0]?.values;
  };

  const getFbMetricsData = async () => {
    const payload = {
      metrics: metric,
      period: "days_28", // day | week | days_28
      //   since: dayjs().subtract(93, "day").toISOString(),
      since: fromDate
        ? new Date(fromDate)?.toISOString()
        : dayjs().subtract(93, "day").toISOString(),
      //   until: dayjs().toISOString(), // timestamp
      until: toDate ? new Date(toDate)?.toISOString() : dayjs().toISOString(), // timestamp
    };

    const res = await axios.get(
      `https://graph.facebook.com/${selectedPage.page_id}/insights?metric=${payload.metrics}
      &period=${payload.period}&since=${payload.since}&until=${payload.until}
      &access_token=${selectedPage.accessToken}`
    );

    setData(res.data?.data);
  };

  const getIgMetricsData = async () => {
    const payload = {
      metric: `impressions,profile_views,likes,comments,shares,saves`,
      period: "day", // day | week | days_28 | lifetime
      since: dayjs().subtract(30, "day").toISOString(),
      until: dayjs().toISOString(), // timestamp
    };

    const res = await axios.get(
      `https://graph.facebook.com/v16.0/${selectedPage.id}/insights?metric=${payload.metric}&period=${payload.period}&since=${payload.since}&until=${payload.until}&access_token=${selectedPage.accessToken}&metric_type=total_value`
    );
    console.log("instagram insights", res.data?.data);

    setData(res.data?.data);
  };

  const getData = async () => {
    setLoading(true);
    try {
      if (selectedPlatform === Platforms.instagram) {
        await getIgMetricsData();
      } else {
        await getFbMetricsData();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedPlatform, selectedPage, metric, fromDate, toDate]);

  const fbPieData = {
    labels: lineChartLabels,
    datasets: [
      {
        label: "# of Reactions",
        data: lineChartValues,
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 10,
      },
    ],
  };

  const options = {};

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && (
        <div className="content">
          <Grid container spacing={4}>
            <Grid item xs={3.5}>
              <Card>
                <CardBody>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h7" color="blue">
                        Filters
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        options={[Platforms.facebook, Platforms.instagram]}
                        value={selectedPlatform}
                        getOptionLabel={(option) => option}
                        onChange={(_, selected) => {
                          setSelectedPlatform(selected);
                          selected === Platforms.instagram
                            ? setSelectedPage(instagramAccounts[0])
                            : setSelectedPage(facebookPages[0]);
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField {...params} label="Select Platform" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        value={selectedPage}
                        options={
                          selectedPlatform === Platforms.instagram
                            ? instagramAccounts
                            : facebookPages
                        }
                        getOptionLabel={(option) => option.name}
                        onChange={(_, selected) => setSelectedPage(selected)}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField {...params} label="Select Page" />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{ flex: 1 }}>
                        <InputLabel id="demo-simple-select-label">
                          Filter BY
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="filterBy"
                          value={metric}
                          label="Age"
                          onChange={(e) => setMetric(e.target.value)}
                        >
                          <MenuItem value={"page_engaged_users"}>
                            page_engaged_users
                          </MenuItem>
                          <MenuItem value={"page_posts_impressions"}>
                            page_posts_impressions
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="From Date"
                          value={fromDate}
                          onChange={(newValue) => {
                            setFromDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="To Date"
                          value={toDate}
                          onChange={(newValue) => {
                            setToDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </CardBody>
              </Card>
            </Grid>

            <Grid item xs={8.5}>
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">{metric}</CardTitle>
                  <p className="card-category">
                    Daily total post reactions of a page
                  </p>
                </CardHeader>
                <CardBody style={{ width: "700px" }}>
                  <Bar data={fbPieData} options={options} />
                  {/* {selectedPlatform == Platforms.instagram ? (
                    <Pie data={igPieData} options={options} />
                  ) : (
                    <Pie data={fbPieData} options={options} />
                  )} */}
                </CardBody>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
};

export default Reports;
