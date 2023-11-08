import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Col,
  CardHeader,
  CardTitle,
  Row,
} from "reactstrap";

export default function SignUp() {
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const isValidInput = () => {
    if (!name || !email) {
      setError("Please fill the required fields");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password should be at least 6 characters");
      return false;
    }
    if (!phone || phone.length < 10) {
      setError("Phone number should be at least 10 characters");
      return false;
    }
    setError(null);
    return true;
  };

  const onSubmit = async () => {
    try {
      if (!isValidInput()) return;
      const data = {
        name,
        age,
        phone,
        address,
        email,
        password,
        image: "",
      };
      console.log("data", data);
      const res = await axios.post(
        `http://localhost:8080/auth-user/signUp`,
        data
      );
      console.log("res", res.data);
      history.push("/login");
    } catch (error) {
      console.log("err", error);
    }
  };

  return (
    <div className="signup-container">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Sign Up</CardTitle>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup>
                  <Row>
                    <Col md="6">
                      <Label>Name*</Label>
                      <Input
                        name="name"
                        placeholder="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          // setIsValidEmail(true);
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Email*</Label>
                      <Input
                        name="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          // setIsValidEmail(true);
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Age</Label>
                      <Input
                        name="age"
                        placeholder="age"
                        value={age}
                        onChange={(e) => {
                          setAge(e.target.value);
                          // setIsValidEmail(true);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Label>Phone</Label>
                      <Input
                        name="phone"
                        placeholder="phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          // setIsValidEmail(true);
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Address</Label>
                      <Input
                        name="address"
                        placeholder="address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          // setIsValidEmail(true);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Label for="examplePassword">Password</Label>
                      <Input
                        name="password"
                        placeholder="password"
                        value={password}
                        type="password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          // setIsValidEmail(true);
                        }}
                      />
                    </Col>
                  </Row>
                  {/* <Label>Image</Label>
                  <Row>
                    <Col>
                      <Input
                        id="exampleFile"
                        name="file"
                        type="file"

                        // invalid={!isValidEmail}
                        // onChange={(e) => {
                        //   setEmail(e.target.value);
                        //   setIsValidEmail(true);
                        // }}
                      />
                    </Col>
                  </Row> */}
                </FormGroup>
                <div style={{ paddingTop: "16px" }}>
                  Already has account? <Link to="/login">Login</Link>
                </div>
                {error && (
                  <div style={{ color: "red", paddingTop: "16px" }}>
                    {error}
                  </div>
                )}
                <Button
                  className="btn-round"
                  color="primary"
                  onClick={onSubmit}
                  style={{ float: "right" }}
                >
                  Signup
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
