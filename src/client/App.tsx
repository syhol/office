import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  InsertImage,
  InsertTable,
  imagePlugin,
  ListsToggle,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useEffect, useState } from "react";

export default function App() {
  const [markdown, setMarkdown] = useState(`# Welcome to Office

A **free and open-source** collaborative document editor built on open standards.

## Features

- Real-time markdown editing
- Powered by MDXEditor
- WebSocket-based collaboration (coming soon)
- Self-hostable

Try editing this document!
`);

  const [wsStatus, setWsStatus] = useState<"connecting" | "connected" | "disconnected">(
    "connecting",
  );

  useEffect(() => {
    // WebSocket connection for real-time collaboration
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      setWsStatus("connected");
      console.log("Connected to collaboration server");
    };

    ws.onclose = () => {
      setWsStatus("disconnected");
      console.log("Disconnected from server");
    };

    ws.onmessage = (event) => {
      // Handle remote updates (to be implemented with CRDT/OT)
      console.log("Received update:", event.data);
    };

    // Send updates to server
    const _sendUpdate = (content: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "update",
            content,
          }),
        );
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header
        style={{
          background: "#2563eb",
          color: "white",
          padding: "1rem 2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
          Office - Collaborative Document Editor
        </h1>
      </header>

      <div style={{ flex: 1, overflow: "auto", padding: "2rem" }}>
        <MDXEditor
          markdown={markdown}
          onChange={setMarkdown}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: "JavaScript",
                ts: "TypeScript",
                css: "CSS",
                html: "HTML",
                python: "Python",
              },
            }),
            diffSourcePlugin(),
            frontmatterPlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <CreateLink />
                  <InsertImage />
                  <InsertTable />
                  <ListsToggle />
                  <BlockTypeSelect />
                </>
              ),
            }),
          ]}
        />
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          padding: "0.5rem 1rem",
          background:
            wsStatus === "connected"
              ? "#10b981"
              : wsStatus === "connecting"
                ? "#f59e0b"
                : "#ef4444",
          color: "white",
          borderRadius: "6px",
          fontSize: "0.875rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {wsStatus === "connected"
          ? "Connected"
          : wsStatus === "connecting"
            ? "Connecting..."
            : "Disconnected"}
      </div>
    </div>
  );
}
