import { useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export default function BoardItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    monday.get("context").then((res) => {
      const boardId = res.data.boardId;
      if (boardId) {
        fetchBoardItems(boardId);
      } else {
        setError("Board ID não encontrado.");
        setLoading(false);
      }
    });
  }, []);

  function fetchBoardItems(boardId) {
    monday
      .api(`
        query {
          boards(ids: ${boardId}) {
            items {
              id
              name
            }
          }
        }
      `)
      .then((res) => {
        const boardItems = res.data.boards[0]?.items || [];
        setItems(boardItems);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao buscar itens do board.");
        console.error(err);
        setLoading(false);
      });
  }

  if (loading) return <p>Carregando itens...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Itens do Board</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            #{item.id} - {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
