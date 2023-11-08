import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Col, Row } from "reactstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [scheduledAds, setScheduledAds] = useState([]);
  // const events = [
  //   {
  //     start: moment().toDate(),
  //     end: moment().toDate(),
  //     title: "Some title",
  //   },
  // ];

  const getScheduledAds = async () => {
    try {
      const auth = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
        },
      };
      const res = await axios.get("http://localhost:8080/schedule/all", auth);
      console.log("res: ", res.data.data);
      const events = res.data.data.map((ad) => ({
        start: new Date(ad.time_date),
        end: new Date(ad.time_date),
        title: ad.advertisement.Description_AD,
      }));
      setScheduledAds(events);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getScheduledAds();
  }, []);

  return (
    <div className="content">
      <Row>
        <Col lg="12">
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={scheduledAds}
            style={{ height: "100vh" }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Schedule;
