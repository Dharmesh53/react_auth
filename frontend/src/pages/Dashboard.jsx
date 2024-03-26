import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
let firstRender = true;

const Dashboard = () => {
  const [data, setData] = useState({});

  const refreshToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/refresh", {
        withCredentials: true,
      });
      const result = await res.data;
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };

  const sendReq = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });
      const result = await res.data;
      setData(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (firstRender) {
      sendReq();
      firstRender = false;
    }
    let interval = setInterval(() => {
      refreshToken();
    }, 1000 * 29);
    return () => clearInterval(interval);
  }, []);
  return <div>{data && <span>{data.name}'s</span>} Dashboard</div>;
};

export default Dashboard;
