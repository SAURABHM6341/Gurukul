import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const fullCode = `<!DOCTYPE html>
<html>
  <head><title>Example</title>
  <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1><a href="/">Header</a></h1>
    <nav>
      <a href="one/">One</a>
      <a href="two/">Two</a>
      <a href="three/">Three</a>
    </nav>
  </body>
</html>`;

function AnimatedCodeBlock() {
  const [code, setCode] = useState("");
  const typingSpeed = 10; // ms per character
  const pauseBeforeRestart = 1000; // ms pause before repeating

  useEffect(() => {
    let index = 0;
    let typingInterval;

    const startTyping = () => {
      setCode("");
      typingInterval = setInterval(() => {
        setCode((prev) => prev + fullCode[index]);
        index++;
        if (index >= fullCode.length) {
          clearInterval(typingInterval);
          setTimeout(() => {
            index = 0;
            startTyping();
          }, pauseBeforeRestart);
        }
      }, typingSpeed);
    };

    startTyping();

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div style={styles.glassContainer}>
      <SyntaxHighlighter
        language="html"
        style={materialDark}
        customStyle={styles.codeBlock}
        showLineNumbers={false}
        wrapLongLines={false}
        PreTag="div"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const styles = {
  glassContainer: {
    width: "500px",
    height: "342px",
    margin: "2rem auto",
    padding: "1.5rem",
    borderRadius: "20px",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: `0 0 40px rgba(59, 130, 246, 0.3),
    0 0 80px rgba(147, 51, 234, 0.2),
    0 0 120px rgba(16, 185, 129, 0.1)`,
    overflow: "hidden",
    position: "relative",
  },
  codeBlock: {
    background: "transparent",
    height: "100%",
    overflow: "hidden",
    fontSize: "13px",
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
    lineHeight: "1.4",
    padding: "0",
    margin: "0",
  },
};

export default AnimatedCodeBlock;
