import React from "react";
import { useState } from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";

const Accounts = () => {
  const [twitter, setTwitter] = useState(false);
  const location = useLocation();
  const isExternal = new URLSearchParams(location.search).get("external");

  useEffect(() => {
    if (isExternal) window.close();
  }, []);

  return (
    <Box sx={{ mt: "80px", ml: "16px" }}>
      <FormGroup row>
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked disabled />}
          label="Facebook"
          labelPlacement="start"
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          value="start"
          control={<Switch color="primary" checked disabled />}
          label="Instagram"
          labelPlacement="start"
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          value="start"
          sx={{ mb: 0 }}
          control={
            <Switch
              sx={{ ml: "24px" }}
              checked={twitter}
              onChange={(event) => setTwitter(event.target.checked)}
              color="primary"
            />
          }
          label="Twitter"
          labelPlacement="start"
        />
        {twitter && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ml: "24px",
            }}
          >
            Your twitter account is not connected, click
            <span
              style={{
                color: "#1976D2",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() =>
                window.open(
                  "http://localhost:8080/twitter/auth",
                  "",
                  "width=800,height=600"
                )
              }
            >
              &nbsp;Sign in with Twitter&nbsp;
            </span>
            to connect.
          </Box>
        )}
      </FormGroup>
    </Box>
  );
};

export default Accounts;
