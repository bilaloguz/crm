import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Pages/Home";
import Settings from "./Pages/Settings";
import Login from "./Login";
import Navbar from "./Components/Navbar";
import NotFound from "./Pages/NotFound";
import AuthService from "./Services/authService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);
  if (!currentUser) {
    return <Login />;
  }
  return (
    <BrowserRouter>
      <ToastContainer
        // toastStyle={{ backgroundColor: "#343A40" }}
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/Settings" component={Settings} />
        <Route path="" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

//   const { token, setToken } = useToken();
//   console.log(sessionStorage);
//   const username = sessionStorage.getItem("username");
//   if(!token) {
//     return <Login setToken={setToken} />
//   }
//   console.log(username);

//   return (
//       <BrowserRouter>
//       <Navbar/>
//         <Switch>
//           <Route exact path="/" component={Home} />
//           <Route path="" component={NotFound} />
//         </Switch>
//         <div className="fixed-bottom navbar-expand-sm navbar-dark bg-dark">
//           <div className="container-fluid">dsfsadf</div>
//         </div>
//       </BrowserRouter>
//   );
// }

export default App;
