import React, { useEffect } from "react";
export default function MyComponent() {
  useEffect(() => {
    console.log("component");
  }, []);
  return <div className="my-component">000</div>;
}
