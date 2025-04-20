import { useState } from "react";
import mondaySdk from "monday-sdk-js"
import { useEffect } from "react";
import BoardItemsList from "../components/BoardItemsList";

const monday = mondaySdk();


function App() {
  const [boardId, setBoardId] = useState(null);

  useEffect(() => {
    monday.get("context").then((res) => {
      setBoardId(res.data.boardId);
    });
  }, []);

  return(
    <div style={{padding: "2rem", textAlign:"center"}}>
      <h1>Hello World</h1>
      <p>Integrado com Monday.com</p>
      <p>ID do board: {boardId}</p>
      <BoardItemsList />
    </div>
  );
}

export default App;