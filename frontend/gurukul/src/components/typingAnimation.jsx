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
        showLineNumbers
        wrapLongLines
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
    padding: "1rem",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: `0 0 80px rgba(255, 102, 204, 0.2),
    0 0 120px rgba(255, 204, 0, 0.1),
    0 0 160px rgba(51, 153, 255, 0.08)`,
    overflow: "hidden",
  },
  codeBlock: {
    background: "transparent",
    height: "100%",
    overflow: "auto",
    fontSize: "14px",
  },
};

export default AnimatedCodeBlock;
