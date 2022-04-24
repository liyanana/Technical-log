import React, { useEffect } from "react";
export default function MyAdd() {
  useEffect(() => {
    console.log("component");
  }, []);
  return <div className="my-add">10</div>;
}
