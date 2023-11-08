import axios from "axios";
import React from "react";
import FacebookLogin from "react-facebook-login";
import { useHistory, useLocation } from "react-router-dom";
import { Row } from "reactstrap";
import { getPages } from "./Login";
import "./social-platforms.css";

const createSocialPlatform = async (socialPlatform, facebookInfo) => {
  const toBeSent = {
    id: facebookInfo.userID,
    name: facebookInfo.name,
    email: facebookInfo.email,
    accessToken: facebookInfo.accessToken,
    tokenExpireDate: facebookInfo.data_access_expiration_time,
    socialPlatform: socialPlatform,
  };
  const authToken = window.localStorage.getItem("authToken");
  return await axios.post(
    "http://localhost:8080/social-account/register",
    toBeSent,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

const SocialPlatforms = () => {
  const history = useHistory();
  const location = useLocation();
  const isExternal = new URLSearchParams(location.search).get("external");

  const responseFacebook = async (response) => {
    console.log("facebook login res", response);
    if (response?.status === "unknown") {
      return;
    }
    try {
      const res = await createSocialPlatform("Facebook", response);
      const accessToken = window.localStorage.getItem("authToken");
      await getPages(accessToken);
      if (isExternal == "true") {
        window.opener.postMessage({ authToken: accessToken }, "*");
        window.close();
      }
      history.push("/admin/dashboard");
      console.log("create social platform res", res.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container">
      <div className="card-container">
        <Row className="text-facebook-login1">
          Your account has been set up!
        </Row>
        <Row className="text-facebook-login2">
          connect a channel so you can publish you first post
        </Row>
        <Row className="text-center test">
          <FacebookLogin
            appId="730903515153138"
            autoLoad={false}
            fields="name,email,picture"
            scope="pages_manage_posts,pages_read_engagement,read_insights,pages_read_user_content,pages_show_list,instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,instagram_manage_messages,instagram_shopping_tag_products,ads_management,business_management"
            callback={responseFacebook}
          />
        </Row>
      </div>
    </div>
  );
};

export default SocialPlatforms;
