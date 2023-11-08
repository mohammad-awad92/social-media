import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteIcon from "@mui/icons-material/Delete";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PublishIcon from "@mui/icons-material/Publish";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Card, CardTitle, Col } from "reactstrap";

function MyAds() {
  const [userAds, setUserAds] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const getAddsList = async () => {
    try {
      const authToken = window.localStorage.getItem("authToken");
      const res = await axios.get(`http://localhost:8080/advertiesment/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("ads list", res.data);
      setUserAds(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (ad) => {
    try {
      setIsLoading(true);
      const headers = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
        },
      };
      const res = await axios.delete(
        `http://localhost:8080/advertiesment/delete?adId=${ad.advertisementId}&sourceId=${ad.sourceId}&adDbId=${ad.id}&sourceType=${ad.sourceType}`,
        headers
      );
      console.log("delete", res);
      getAddsList();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddsList();
  }, []);

  return (
    <div
      className="content"
      style={{
        marginTop: 75,
        display: "flex",
        flexWrap: "wrap",
        minHeight: "unset",
      }}
    >
      {userAds?.map((ad) => {
        return (
          <Col md="6">
            <Card className="card-user">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: "16px",
                }}
              >
                <CardTitle
                  tag="text"
                  style={{ fontSize: "12px", color: "gray" }}
                >
                  {moment(ad.createdAt).calendar()}
                </CardTitle>
                {ad.sourceType !== "ACCOUNT" && (
                  <IconButton onClick={() => onDelete(ad)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              <CardTitle
                style={{
                  fontSize: "14px",
                  paddingLeft: "16px",
                  textTransform: "capitalize",
                }}
              >
                {ad?.Status_Ad === "PUBLISH" ? (
                  <PublishIcon sx={{ color: "greenyellow" }} />
                ) : ad?.Status_Ad === "SCHEDULE" ? (
                  <CalendarMonthIcon sx={{ color: "skyblue" }} />
                ) : null}
                {ad?.Status_Ad}
              </CardTitle>
              <CardTitle
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "gray",
                  textTransform: "capitalize",
                  paddingLeft: "16px",
                }}
              >
                {ad?.page?.name}
              </CardTitle>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: "16px",
                }}
              >
                <CardTitle
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                  }}
                >
                  {ad.Description_AD}
                </CardTitle>
                <CardTitle style={{ fontSize: "12px", color: "gray" }}>
                  {ad.sourceType === "PAGE" ? (
                    <FacebookIcon sx={{ fontSize: "35px", color: "#1778F2" }} />
                  ) : ad.sourceType === "ACCOUNT" ? (
                    <InstagramIcon
                      sx={{
                        fontSize: "35px",
                        color: "white",
                        borderRadius: "8px",
                        background:
                          "radial-gradient(circle farthest-corner at 35% 90%, #fec564, transparent 50%), radial-gradient(circle farthest-corner at 0 140%, #fec564, transparent 50%), radial-gradient(ellipse farthest-corner at 0 -25%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 20% -50%, #5258cf, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 0, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 60% -20%, #893dc2, transparent 50%), radial-gradient(ellipse farthest-corner at 100% 100%, #d9317a, transparent), linear-gradient(#6559ca, #bc318f 30%, #e33f5f 50%, #f77638 70%, #fec66d 100%)",
                      }}
                    />
                  ) : (
                    <TwitterIcon sx={{ fontSize: "35px", color: "#1C9AF0" }} />
                  )}
                </CardTitle>
              </Box>
            </Card>
          </Col>
        );
      })}
    </div>
  );
}

export default MyAds;
