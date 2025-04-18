import { useState } from "react";
import mondaySdk from "monday-sdk-js"
import { useEffect } from "react";

const monday = mondaySdk();


function App() {
  useEffect(() => {
    monday.listen("context", (res) => {
      console.log("Monday context:", res);
    });
  }, []);

  return(
    <div style={{padding: "2rem", textAlign:"center"}}>
      <h1>Hello World</h1>
      <p>Integrado com Monday.com</p>
    </div>
  );
}

export default App;