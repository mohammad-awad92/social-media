import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
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
import "./Login.css";

export const getPages = async (accessToken) => {
  try {
    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const pages = await axios.get("http://localhost:8080/pages", headers);
    const socialAccounts = await axios.get(
      "http://localhost:8080/social-account",
      headers
    );
    console.log("pages", pages?.data);
    console.log("accounts", socialAccounts?.data);
    window.localStorage.setItem(
      "facebook_pages",
      JSON.stringify(pages?.data?.data)
    );
    window.localStorage.setItem(
      "social_accounts",
      JSON.stringify(socialAccounts?.data?.data)
    );
    return [pages?.data?.data, socialAccounts?.data?.data];
  } catch (error) {
    console.log("error get pages", error);
  }
};

const Login = () => {
  const location = useLocation();
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [error, setError] = useState(false);
  const isExternal = new URLSearchParams(location.search).get("external");

  const onSubmit = async () => {
    try {
      if (!isInputValid()) return;
      const res = await axios.post("http://localhost:8080/auth-user/login", {
        email: email,
        password: password,
      });
      console.log("login res", res.data);
      window.localStorage.setItem("authToken", res.data.data.token);
      window.localStorage.setItem("userId", res.data.data.user.id);

      // const [pages] = await getPages(res.data.data.token);
      // if (pages.length > 0) history.push("/admin/dashboard");
      // else 
      history.push(`/social-platforms?external=${isExternal}`);
      setError(false);
    } catch (error) {
      console.log("error", error);
      setError(true);
    }
  };

  const isInputValid = () => {
    if (!email) {
      setIsValidEmail(false);
      return false;
    }
    if (!password) {
      setIsValidPassword(false);
      return false;
    }
    return true;
  };

  return (
    <div className="content login-margin">
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <CardTitle tag="h5">Login</CardTitle>
            </CardHeader>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Input
                    id="exampleEmail"
                    name="email"
                    placeholder="example@example.com"
                    type="email"
                    invalid={!isValidEmail}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsValidEmail(true);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="examplePassword">Password</Label>
                  <Input
                    invalid={!isValidPassword}
                    type="password"
                    name="password"
                    id="examplePassword"
                    placeholder="********"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsValidPassword(true);
                    }}
                  />
                </FormGroup>{" "}
                {error && (
                  <div style={{ color: "red" }}>User does not exists</div>
                )}
                <div style={{ paddingTop: "16px" }}>
                  Don't have account? <Link to="/signup">Sign up</Link>
                </div>
                <Button
                  className="btn-round"
                  color="primary"
                  onClick={onSubmit}
                  style={{ float: "right" }}
                >
                  Login
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
