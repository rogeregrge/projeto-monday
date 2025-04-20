import { useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

export default function BoardItemsTable() {
  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    monday.get("context").then((res) => {
      const boardId = res.data.boardId;
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
            columns {
              id
              title
            }
            items_page(limit: 50) {
              items {
                id
                name
                column_values {
                  id
                  value
                  text
                }
              }
            }
          }
        }
      `)
      .then((res) => {
        const board = res.data.boards[0];
        setColumns(board.columns || []);
        setItems(board.items_page.items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao buscar dados do board.");
        console.error("Erro na query GraphQL:", err);
        setLoading(false);
      });
  }

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Itens do Board</h3>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Item</th>
            {columns.map((col) => (
              <th key={col.id}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              {columns.map((col) => {
                const colVal = item.column_values.find((c) => c.id === col.id);
                let display = colVal?.text || "—";

                try {
                  const parsed = JSON.parse(colVal?.value || "{}");
                  if (parsed?.url && parsed?.text) {
                    display = (
                      <a href={parsed.url} target="_blank" rel="noreferrer">
                        {parsed.text}
                      </a>
                    );
                  }
                } catch (e) {
                  // ignora erros de JSON
                }

                return <td key={col.id}>{display}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
