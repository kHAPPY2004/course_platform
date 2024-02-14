import React, { useEffect } from "react";
import axios from "axios";
const Signup: React.FC = () => {
  useEffect(() => {
    axios
      .post("/api/signup")
      .then((result: any) => {
        console.log(result);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  return <div>signup</div>;
};

export default Signup;
