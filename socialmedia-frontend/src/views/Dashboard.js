import { Autocomplete, Box, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import CircularProgress from "@mui/material/CircularProgress";

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

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [tilesData, setTilesData] = useState({
    pageLikes: 0,
    pageEngagedUsers: 0,
    pagePostEngagements: 0,
    pageViewsTotal: 0,
    pagePostReactions: {
      // Face
      like: 0,
      love: 0,
      haha: 0,
      anger: 0,
      wow: 0,
      sorry: 0,
      // Insta
      likes: 0,
      comments: 0,
      shares: 0,
      saved: 0,
    },
  });

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
  const lineChartData =
    selectedPlatform == Platforms.instagram
      ? getDataDependOnMetric("impressions") || [{ value: 1 }, { value: 2 }]
      : getDataDependOnMetric("page_post_engagements");
  const lineChartValues = lineChartData?.map((obj) => obj?.value);
  const lineChartLabels = lineChartData?.map((obj) =>
    dayjs(obj?.end_time).format("D-MMM")
  );

  const getMetricData = (metric) => {
    let metricData = data.filter((item) => item.name === metric)[0];
    return metricData?.values?.[0];
  };

  const getMetricChartData = (metric) => {
    return data.filter((item) => item.name === metric)[0]?.values;
  };

  const getFbMetricsData = async () => {
    const payload = {
      metrics: `page_fans,page_engaged_users,page_post_engagements,page_views_total
      ,page_actions_post_reactions_like_total,page_actions_post_reactions_love_total
      ,page_actions_post_reactions_wow_total,page_actions_post_reactions_haha_total
      ,page_actions_post_reactions_sorry_total,page_actions_post_reactions_anger_total`,
      period: "day", // day | week | days_28
      since: dayjs().subtract(93, "day").toISOString(),
      until: dayjs().toISOString(), // timestamp
    };

    const res = await axios.get(
      `https://graph.facebook.com/${selectedPage.page_id}/insights?metric=${payload.metrics}
      &period=${payload.period}&since=${payload.since}&until=${payload.until}
      &access_token=${selectedPage.accessToken}`
    );
    console.log("facebook insights", res.data?.data);

    setTilesData({
      pageLikes: getMetricValues("page_fans", res.data?.data).values.pop()
        .value,
      pageViewsTotal: sumMetricValues(
        getMetricValues("page_views_total", res.data?.data).values
      ),
      pageEngagedUsers: sumMetricValues(
        getMetricValues("page_engaged_users", res.data?.data).values
      ),
      pagePostEngagements: sumMetricValues(
        getMetricValues("page_post_engagements", res.data?.data).values
      ),
      pagePostReactions: {
        like: sumMetricValues(
          getMetricValues(
            "page_actions_post_reactions_like_total",
            res.data?.data
          ).values
        ),
        love: sumMetricValues(
          getMetricValues(
            "page_actions_post_reactions_love_total",
            res.data?.data
          ).values
        ),
        haha: sumMetricValues(
          getMetricValues(
            "page_actions_post_reactions_haha_total",
            res.data?.data
          ).values
        ),
        anger: sumMetricValues(
          getMetricValues(
            "page_actions_post_reactions_anger_total",
            res.data?.data
          ).values
        ),
        wow: sumMetricValues(
          getMetricValues(
            "page_actions_post_reactions_wow_total",
            res.data?.data
          ).values
        ),
        sorry: sumMetricValues(
          getMetricValues(
            "page_actions_post_reactions_sorry_total",
            res.data?.data
          ).values
        ),
      },
    });

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

    setTilesData({
      ...tilesData,
      pageLikes:
        getMetricValues("profile_views", res.data?.data)?.total_value?.value ||
        2,
      pageViewsTotal:
        getMetricValues("impressions", res.data?.data)?.total_value?.value || 4,
      pageEngagedUsers:
        getMetricValues("impressions", res.data?.data)?.total_value?.value || 4,
      pagePostEngagements:
        getMetricValues("impressions", res.data?.data)?.total_value?.value || 6,
      pagePostReactions: {
        likes:
          getMetricValues("likes", res.data?.data)?.total_value?.value || 3,
        comments:
          getMetricValues("comments", res.data?.data)?.total_value?.value || 2,
        shares: getMetricValues("shares", res.data?.data)?.total_value?.value,
        saved:
          getMetricValues("saves", res.data?.data)?.total_value?.value || 1,
      },
    });

    setData(res.data?.data);
  };

  console.log("tiles Data", tilesData.pagePostReactions);

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
  }, [selectedPlatform, selectedPage]);

  const lineData = {
    labels: lineChartLabels,
    datasets: [
      {
        label: "Impressions",
        data: lineChartValues,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const fbPieData = {
    labels: ["Like", "Love", "Sorry", "Haha", "Wow", "Anger"],
    datasets: [
      {
        label: "# of Reactions",
        data: [
          tilesData.pagePostReactions.like,
          tilesData.pagePostReactions.love,
          tilesData.pagePostReactions.sorry,
          tilesData.pagePostReactions.haha,
          tilesData.pagePostReactions.wow,
          tilesData.pagePostReactions.anger,
        ],
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
        borderWidth: 1,
      },
    ],
  };

  const igPieData = {
    labels: ["Like", "Comments", "Shares", "Saves"],
    datasets: [
      {
        label: "# of Reactions",
        data: [
          tilesData.pagePostReactions.likes,
          tilesData.pagePostReactions.comments,
          tilesData.pagePostReactions.shares,
          tilesData.pagePostReactions.saved,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {};

  //
  const BasicCard = ({ title, subTitle, icon, igMetricName, fbMetricName }) => {
    return (
      <Col lg="3" md="6" sm="6">
        <Card className="card-stats">
          <CardBody>
            <Row>
              <Col md="4" xs="5">
                <div className="icon-big text-center icon-warning">{icon}</div>
              </Col>
              <Col md="8" xs="7">
                <div className="numbers">
                  <p className="card-category">{title}</p>
                  <CardTitle tag="p">
                    {
                      getMetricData(
                        selectedPlatform == Platforms.instagram
                          ? igMetricName
                          : fbMetricName
                      )?.value
                    }{" "}
                    {subTitle}
                  </CardTitle>
                  <p />
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              <i className="fas fa-sync-alt" /> Update Now
            </div>
          </CardFooter>
        </Card>
      </Col>
    );
  };

  return (
    <>
      {loading && (
        <div className="content flex ">
          <CircularProgress />
        </div>
      )}
      {!loading && (
        <div className="content">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              mt: "20px",
              mb: "20px",
            }}
          >
            <Autocomplete
              options={[Platforms.facebook, Platforms.instagram]}
              value={selectedPlatform}
              sx={{ flex: 1, backgroundColor: "white" }}
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
            <Autocomplete
              value={selectedPage}
              options={
                selectedPlatform === Platforms.instagram
                  ? instagramAccounts
                  : facebookPages
              }
              sx={{ flex: 1, backgroundColor: "white" }}
              getOptionLabel={(option) => option.name}
              onChange={(_, selected) => setSelectedPage(selected)}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="Select Page" />
              )}
            />
          </Box>
          <Row>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-globe text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Page Followers</p>
                        <CardTitle tag="p">{tilesData.pageLikes}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-calendar" /> {period}
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-money-coins text-success" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Page Engaged Users</p>
                        <CardTitle tag="p">
                          {tilesData.pageEngagedUsers}
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-calendar" /> {period}
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-vector text-danger" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Page Total View</p>
                        <CardTitle tag="p">
                          {tilesData.pageViewsTotal}
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-calendar" /> {period}
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-favourite-28 text-primary" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Page Posts Engagements</p>
                        <CardTitle tag="p">
                          {tilesData.pagePostEngagements}
                        </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-calendar" /> {period}
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Page Impressions</CardTitle>
                  <p className="card-category">
                    The number of times any content from your Page or about your
                    Page entered a person's screen. This includes posts,
                    stories, ads, as well other content or information on your
                    Page.
                  </p>
                </CardHeader>
                <CardBody>
                  <Line data={lineData} options={options} />
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Page Posts Reactions</CardTitle>
                  <p className="card-category">
                    Daily total post reactions of a page
                  </p>
                </CardHeader>
                <CardBody style={{ width: "400px" }}>
                  {selectedPlatform == Platforms.instagram ? (
                    <Pie data={igPieData} options={options} />
                  ) : (
                    <Pie data={fbPieData} options={options} />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Dashboard;
