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
      console.log("Contexto:", res.data);

      if (boardId) {
        fetchBoardData(boardId);
      } else {
        setError("Board ID não encontrado.");
        setLoading(false);
      }
    });
  }, []);

  function fetchBoardData(boardId) {
    monday
      .api(`
        query {
          boards(ids: ${boardId}) {
            name
            items_page(limit: 50) {
              items {
                id
                name
                group {
                  id
                }
                column_values {
                  id
                  value
                }
              }
            }
          }
        }
      `)
      .then((res) => {
        console.log("Resposta:", res);
        const boardItems = res.data.boards[0].items_page.items || [];
        setItems(boardItems);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao buscar itens do board.");
        console.error("Erro na query GraphQL:", err);
        setLoading(false);
      });
  }

  if (loading) return <p>Carregando itens...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Itens do Board</h3>
      {items.length === 0 ? (
        <p>Nenhum item encontrado.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: "1rem" }}>
              <strong>{item.name}</strong> (Grupo: {item.group?.id})<br />
              {item.column_values.map((col) => (
                <div key={col.id}>
                  <small>
                    <strong>{col.id}:</strong>{" "}
                    {col.value ? col.value : "—"}
                  </small>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
