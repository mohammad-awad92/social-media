import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import Swal from "sweetalert2";
import { getPages } from "./Login";

const AdType = {
  Publish: "PUBLISH",
  Scheduled: "SCHEDULE",
  Temporary: "TEMPORARY",
};

const CreateAds = () => {
  const [facebookPages, setFacebookPages] = useState([]);
  const [instagramAccounts, setInstagramAccounts] = useState([]);

  const [selectedFacebookPages, setSelectedFacebookPages] = useState([]);
  const [selectedInstagramAccounts, setSelectedInstagramAccounts] = useState(
    []
  );
  const [description, setDescription] = useState("");
  const [type, setType] = useState(AdType.Publish);
  const [loading, setLoading] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [image, setImage] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: false,
    instagram: false,
    twitter: false,
  });

  console.log("selectedPlat", selectedPlatforms);

  const onImageUpload = async () => {
    try {
      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      formData.append("image", image, image?.name);

      // Details of the uploaded file
      console.log(formData);
      const res = await axios.post("http://localhost:8080/upload", formData);
      console.log("res", res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const onSubmit = async () => {
    console.log("description", description);
    const platforms = [];
    selectedPlatforms.facebook && platforms.push("FACEBOOK");
    selectedPlatforms.instagram && platforms.push("INSTAGRAM");
    selectedPlatforms.twitter && platforms.push("TWITTER");
    console.log("selectedPlatforms", platforms);
    try {
      setLoading(true);
      const authToken = window.localStorage.getItem("authToken");
      let res;
      const advertisementDto = {
        pages: selectedFacebookPages,
        socialAccounts: selectedInstagramAccounts,
        socialPlatform: platforms,
        img: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        Description_AD: description,
      };
      const auth = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      if (type === AdType.Publish) {
        res = await axios.post(
          "http://localhost:8080/advertiesment/create",
          { ...advertisementDto, Status_Ad: AdType.Publish },
          auth
        );
      }
      if (type === AdType.Scheduled) {
        const date = new Date(scheduleDate);
        date.setHours(scheduleTime.split(":")[0]);
        date.setMinutes(scheduleTime.split(":")[1]);
        console.log("schduledDate", date);
        res = await axios.post(
          "http://localhost:8080/schedule",
          { ...advertisementDto, Status_Ad: AdType.Scheduled, time_date: date },
          auth
        );
      }

      Swal.fire({
        icon: "success",
        title: "publish successfully",
        text: "Something went wrong!",
      });
      setDescription("");
      if (!selectedPlatforms.twitter) await onImageUpload();
      setLoading(false);
      console.log("res", res);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setLoading(false);
      console.log("err", err);
    }
  };

  const getData = async () => {
    try {
      const [pages, socialAccounts] = await getPages(
        window.localStorage.getItem("authToken")
      );
      setFacebookPages(pages);
      setInstagramAccounts(
        socialAccounts.filter(
          (account) => account.socialPlatform === "Instagram"
        )
      );
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="content">
      <Row>
        <Col>
          <Card className="card-user">
            <CardHeader>
              <CardTitle tag="h5">Create Advertisement</CardTitle>
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col md="3">
                    <FormGroup>
                      <Label for="exampleSelect">Advertisement Type</Label>
                      <Input
                        type="select"
                        name="select"
                        onChange={(e) => {
                          console.log("sd", e.target.value);
                          setType(e.target.value);
                        }}
                      >
                        <option value={AdType.Publish} selected>
                          Publish
                        </option>
                        <option value={AdType.Scheduled}>Schedule</option>
                      </Input>
                    </FormGroup>
                  </Col>

                  {type == AdType.Scheduled && (
                    <>
                      <Col md="4">
                        <FormGroup>
                          <Label for="exampleDatetime">Date</Label>
                          <Input
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            type="date"
                            name="date"
                            id="exampleDatetime"
                            placeholder="datetime placeholder"
                          />
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label for="exampleDatetime">Time</Label>
                          <Input
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            type="time"
                            name="datetime"
                            placeholder="datetime placeholder"
                          />
                        </FormGroup>
                      </Col>
                    </>
                  )}
                </Row>
                <>
                  <Row>
                    <Col>
                      <Label>Select Social Platforms</Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "32px",
                        }}
                      >
                        <FormControlLabel
                          value="end"
                          control={
                            <Checkbox
                              onChange={() =>
                                setSelectedPlatforms({
                                  ...selectedPlatforms,
                                  facebook: !selectedPlatforms.facebook,
                                })
                              }
                            />
                          }
                          label="Facebook"
                          labelPlacement="end"
                        />
                        {selectedPlatforms.facebook && (
                          <Autocomplete
                            multiple
                            options={facebookPages}
                            sx={{ flex: 1 }}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, selected) =>
                              setSelectedFacebookPages(selected)
                            }
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField {...params} label="Select Pages" />
                            )}
                          />
                        )}
                      </Box>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "32px",
                          mt: "16px",
                        }}
                      >
                        <FormControlLabel
                          value="end"
                          control={
                            <Checkbox
                              onChange={() =>
                                setSelectedPlatforms({
                                  ...selectedPlatforms,
                                  instagram: !selectedPlatforms.instagram,
                                })
                              }
                            />
                          }
                          label="Instagram"
                          labelPlacement="end"
                        />
                        {selectedPlatforms.instagram && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Autocomplete
                              multiple
                              options={instagramAccounts}
                              sx={{ width: "100%", mb: "16px" }}
                              getOptionLabel={(option) => option.name}
                              onChange={(_, selected) =>
                                setSelectedInstagramAccounts(selected)
                              }
                              filterSelectedOptions
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Accounts"
                                />
                              )}
                            />
                            <Input
                              id="exampleFile"
                              name="file"
                              type="file"
                              // invalid={!isValidEmail}
                              onChange={(event) => {
                                if (
                                  event.target.files &&
                                  event.target.files[0]
                                ) {
                                  let img = event.target.files[0];
                                  console.log("img", img);
                                  setImage(img);
                                  // this.setState({
                                  //   image: URL.createObjectURL(img),
                                  // });
                                }
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "32px",
                          mt: "16px",
                        }}
                      >
                        <FormControlLabel
                          value="end"
                          control={
                            <Checkbox
                              onChange={() =>
                                setSelectedPlatforms({
                                  ...selectedPlatforms,
                                  twitter: !selectedPlatforms.twitter,
                                })
                              }
                            />
                          }
                          label="Twitter"
                          labelPlacement="end"
                        />
                      </Box>
                    </Col>
                  </Row>
                </>
                <Col md="12">
                  <FormGroup>
                    <label>Description</label>
                    <Input
                      type="textarea"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <Button
                    className="btn-round"
                    color="primary"
                    onClick={onSubmit}
                    style={{ float: "right" }}
                  >
                    {loading ? (
                      <Spinner color="secondary" size="sm" />
                    ) : (
                      "Publish"
                    )}
                  </Button>
                </Col>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateAds;
