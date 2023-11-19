import React, { useState, useEffect } from "react";
import axios from "axios";
import constants from "../Services/constants";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    assetCount: "",
    cpuUsage: "",
    directoryCount: "",
    diskUsage: "",
    jobCount: "",
    ramUsage: "",
    userCount: "",
  });

  // console.log(dashboardData);

  const dashboard = async () => {
    try {
      let getDashboard = await axios.get(constants.API_URL + "dashboard");
      if (getDashboard.status === 200) {
        let data = getDashboard.data;
        setDashboardData({
          assetCount: data.assetCount,
          cpuUsage: data.cpuUsage,
          directoryCount: data.directoryCount,
          diskUsage: data.diskUsage,
          jobCount: data.jobCount,
          ramUsage: data.ramUsage,
          userCount: data.userCount,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let getDashboard = setInterval(() => {
      dashboard();
    }, 1000);
    return () => {
      clearInterval(getDashboard);
    };
  }, []);

  return (
    <div>
      {/* <span className="px-2">
        CPU : {dashboardData ? dashboardData.cpuUsage : 0}{" "}
      </span> */}
      {/* <span className="px-2">
        RAM : {dashboardData ? dashboardData.ramUsage : 0}
      </span> */}
      {/* <span className="px-2">
        Assets : {dashboardData ? dashboardData.assetCount : 0}{" "}
      </span> */}
      {/* <span className="px-2">
        Directories : {dashboardData ? dashboardData.directoryCount : 0}
      </span> */}
      {/* <span className="px-2">
        DiskUsage : {dashboardData ? dashboardData.diskUsage : 0}
      </span> */}
      {/* <span className="px-2">
        {" "}
        jobs : {dashboardData ? dashboardData.jobCount : 0}{" "}
      </span> */}
      {/* <span className="px-2">
        Users : {dashboardData ? dashboardData.userCount : 0}{" "}
      </span> */}
      <div className="mx-4 my-2 d-flex">

        <div className="col-6 d-flex mx-1 p-2">
          <div className="mx-2 " style={{width:"100px"}}>
            <label className="mb-1 ms-3">Ram Usage</label>
      <CircularProgressbar value={dashboardData.ramUsage} text={`${dashboardData.ramUsage}%`} />
    </div>
      <div className="mx-2" style={{width:"100px"}}>
      <label  className="mb-1 ms-3">Disk Usage</label>
      <CircularProgressbar
      text={`${dashboardData.diskUsage}%`}
        value={dashboardData.diskUsage}
        strokeWidth={50}
        styles={buildStyles({
          strokeLinecap: "butt",
          textColor:"black"
        })}
      />    </div>
          <div className="mx-2" style={{width:"100px"}}>
          <label className="mb-1 ms-3">CPU Usage</label>

          <CircularProgressbar
            value={dashboardData.cpuUsage}
            text={`${dashboardData.cpuUsage}%`}
            circleRatio={0.75}
            styles={buildStyles({
              rotation: 1 / 2 + 1 / 8,
              strokeLinecap: "butt",
              trailColor: "#eee"
            })}
          />
        
        </div>

</div>
        <div className="col-6 mx-1 p-2">        
        <button   class="btn btn-primary btn-sm position-relative mx-2 my-1 ">
  Assets
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    {dashboardData.assetCount}
    <span class="visually-hidden">unread messages</span>
  </span>
</button>
        <button  class="btn btn-primary btn-sm position-relative mx-2 my-1 ">
  Directory
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    {dashboardData.directoryCount}
    <span class="visually-hidden">unread messages</span>
  </span>
</button>
        <button  class="btn btn-primary btn-sm position-relative mx-2 my-1 ">
  Jobs
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    {dashboardData.jobCount}
    <span class="visually-hidden">unread messages</span>
  </span>
</button>
        <button  class="btn btn-primary btn-sm position-relative mx-2 my-1 ">
  Users
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    {dashboardData.userCount}
    <span class="visually-hidden">unread messages</span>
  </span>
</button>
</div>

</div>
          
    </div>
  );
};

export default Dashboard;
