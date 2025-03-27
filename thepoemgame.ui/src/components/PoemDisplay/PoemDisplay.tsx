import React, { useEffect, useState, useRef } from "react";
import Paper, { PaperTitleSection, PaperTitle, LineWrapper } from "./Paper";

// Example poem data structure from API
interface Author {
  id: string;
  name: string;
}

interface PoemLine {
  id: string;
  content: string;
  author: Author;
  lineNumber: number;
}

interface Poem {
  id: string;
  title: string;
  lines: PoemLine[];
}

const PoemDisplay = () => {
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const paperRef = useRef<HTMLDivElement>(null);

  // Measure container width for text wrapping
  useEffect(() => {
    if (!paperRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const contentWidth = entry.contentRect.width;
        setContainerWidth(contentWidth);
      }
    });

    resizeObserver.observe(paperRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Fetch poem data from API
  useEffect(() => {
    const fetchPoemData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        const response = await fetch("/api/poems/123");
        const data = await response.json();
        setPoem(data);
      } catch (error) {
        console.error("Error fetching poem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoemData();
  }, []);

  if (loading || !poem) {
    return <div>Loading poem...</div>;
  }

  return (
    <div ref={paperRef}>
      <Paper paperType="blue-lined" showLineNumbers={true}>
        <PaperTitleSection>
          <PaperTitle>{poem.title}</PaperTitle>
        </PaperTitleSection>

        {/* Auto-generate line sections from API data */}
        {poem.lines.map((line) => (
          <LineWrapper
            key={line.id}
            content={line.content}
            lineNumber={line.lineNumber}
            author={line.author}
            containerWidth={containerWidth}
          />
        ))}
      </Paper>
    </div>
  );
};

export default PoemDisplay;
