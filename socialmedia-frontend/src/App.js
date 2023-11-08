import AdminLayout from "layouts/Admin.js";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from "views/Login";
import SignUp from "views/SignUp";
import SocialPlatforms from "views/SocialPlatforms";

const App = () => {
  const isAuth = window.localStorage.getItem("authToken");

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Route path="/signup" render={(props) => <SignUp {...props} />} />
        <Route
          path="/social-platforms"
          render={(props) => <SocialPlatforms {...props} />}
        />
        {isAuth && <Redirect to="/admin/dashboard" />}
      </Switch>
    </BrowserRouter>
  );
};

export default App;
