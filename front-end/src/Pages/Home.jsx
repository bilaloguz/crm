import React, { useEffect, useState } from "react";
import Customers from "../Components/customers";

// import "./assets/css/side-nav.css"
const Home = () => {
  //const [selectedDirectory, setSelectedDirectory] = useState({});
  //const [selectedAsset, setAsset] = useState({});
  //const [updateAssets, setUpdateAssets] = useState(false);

  // useEffect(() => {
  //   console.log(selectedAsset.name);
  // }, [selectedAsset.name]);

  // const handleAssetChnage = (e) => {
  //   setAsset(e);
  // };

  // const handleDirectoryChange = (e) => {
  //   setSelectedDirectory(e);
  // };

  return (
    <div className="container-fluid">
      <div className="row mt-4">
        
        <div className="col-md-2">
          
        </div>
        
        <div className="col-md-6">
          <Customers
          />
        </div>
        
        <div className="col-md-4">
          
        </div>

      </div>
    </div>
  );
};
export default Home;
