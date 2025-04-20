import { useEffect, useState } from "react";
import mondaySdk from "monday-sdk-js";

import {
  Loader,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  Heading,
  Box,
} from "@vibe/core";

const monday = mondaySdk();

export default function BoardItemsList() {
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

  if (loading) return <Loader size={32} />;
  if (error)
    return (
      <Text color="error" size="medium">
        {error}
      </Text>
    );

  return (
    <Box p={3}>
      <Heading type={Heading.types.h3}>Itens do Board</Heading>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Item</TableCell>
            {columns.map((col) => (
              <TableCell key={col.id}>{col.title}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
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
                } catch (e) {}

                return <TableCell key={col.id}>{display}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
