import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
});

// const cleanMermaidChart = (diagram) => {
//   if (!diagram) return "";
//   let clean = diagram.replace(/\r\n/g, "\n").trim();

//   if (!clean.startsWith("graph")) {
//     clean = `graph TD\n${clean}`; //TOP-DOWN ==>TD
//   }
//   return clean;
// };

const cleanMermaidChart = (diagram) => {
  let clean = diagram.trim();

  if (!clean.startsWith("graph")) {
    clean = `graph TD\n${clean}`;
  }

  return clean;
};

const autoFixNodes = (diagram) => {
  if (/[A-Za-z0-9_]+\[.*?\]/.test(diagram)) {
    return diagram;
  }

  let index = 0;
  const used = new Map();

  return diagram.replace(/\[(.*?)\]/g, (_, label) => {
    const key = label.trim();

    if (!used.has(key)) {
      used.set(key, `N${++index}`);
    }

    return `${used.get(key)}["${key}"]`;
  });
};

const sanitizeMermaidLabels = (diagram) => {
  return diagram.replace(/([A-Za-z0-9_]+)\[(.*?)\]/g, (_, id, label) => {
    const safe = label.replace(/"/g, "&quot;").replace(/\n/g, " ");

    return `${id}["${safe}"]`;
  });
};

const MermaidSetup = ({ diagram }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!diagram || !containerRef.current) return;
    const renderDiagram = async () => {
      try {
        containerRef.current.innerHTML = "";

        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

        const safeChart = sanitizeMermaidLabels(
          autoFixNodes(cleanMermaidChart(diagram)),
        );

        const { svg } = await mermaid.render(uniqueId, safeChart);

        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error("Mermaid render failed:", error);
      }
    };

    renderDiagram();
  }, [diagram]);

  return (
    <div className="bg-white border rounded-lg p-4 overflow-x-auto">
      <div ref={containerRef} />
    </div>
  );
};

export default MermaidSetup;
