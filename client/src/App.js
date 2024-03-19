import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import stubs from "./defaultStubs";
import "./App.css";

const editorOptions = {
  scrollBeyondLastLine: false,
  fontSize: "14px",
  folding: false,
};

const inputOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontSize: "14px",
  lineDecorationsWidth: 5,
};
const outputOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontSize: "14px",
  lineDecorationsWidth: 5,
};

function App() {
  const language = "python";
  const languageIcon = ("./resources/python.png")
  const [code, setCode] = useState("");
  const [input, setInput] = useState("// enter input here");
  const [output, setOutput] = useState("");
  const [editorMode, setEditorMode] = useState("vs-dark");

  useEffect(() => {
    setCode(stubs[language]);
    setOutput("// output");
    setInput("// enter input here");
  }, [language]);

  const toggleTheme = (idName) => {
    let currentClassName = document.getElementById(idName).className;
    let newClassName = currentClassName;
    if (currentClassName === idName + "-dark") newClassName = idName + "-light";
    else newClassName = idName + "-dark";
    document.getElementById(idName).className = newClassName;
  };

  const handleThemeChange = () => {
    if (editorMode === "vs-light") setEditorMode("vs-dark");
    else setEditorMode("vs-light");
    toggleTheme("App");
    toggleTheme("language-button");
    const themeToggler = document.getElementById("theme-icon");
    let classNames = themeToggler.classList;
    if (classNames.contains("theme-icon-light")) {
      classNames.replace("theme-icon-light", "theme-icon-dark");
      classNames.replace("fa-sun", "fa-moon");
    } else {
      classNames.replace("theme-icon-dark", "theme-icon-light");
      classNames.replace("fa-moon", "fa-sun");
    }
  };

  const handleSubmit = async () => {
    const payload = {
      language: language,
      code: code,
      input: input,
    };
    try {

      setOutput(`Code Execution Status: Running`);
      const { data } = await axios.post("http://localhost:5000/run", payload);

      setOutput(
        `Code Execution Status: ${data.success ? "Complete" : "Running"}\n\n${
          data.output
        }`
      );

    } catch ({ response }) {
      if (response) {
        const errorMessage = response.data.err.stderr;
        setOutput(errorMessage);
      } else {
        setOutput("Error connecting to server!");
      }
    }
  };

  return (
    <div id="App" className="App-dark">
      <div id="header" className="header-dark">
        <h3 id="app-name" className="app-name-dark">
          <i className="fas fa-solid fa-cube" aria-hidden="true"></i>
          &nbsp; Online Code Editor
        </h3>

        <div className="nav-right-options">
          <i
            id="theme-icon"
            className="fas fa-solid fa-sun fa-2x nav-icons theme-icon-light"
            aria-hidden="true"
            onClick={handleThemeChange}
          ></i>
        </div>
      </div>

      <div className="secondary-nav-items">
        <button className="btn logo-btn" disabled={true}>
          <img
            src={require(`${languageIcon}`)}
            className="image"
            alt={`${language} icon`}
          />
        </button>
        <button className="btn run-btn">
       Python
        </button>
        <button className="btn run-btn" onClick={handleSubmit}>
          <i className="fas fa-play fa-fade run-icon" aria-hidden="true"></i>
          &nbsp; Run
        </button>
      </div>

      <div className="editor">
        <Editor
          height="100%"
          width="100%"
          theme={editorMode}
          defaultLanguage={language}
          defaultValue={code}
          value={code}
          onChange={(e) => setCode(e)}
          options={editorOptions}
          language={language}
        />
      </div>
      <div className="std-input-output">
        <div className="std-input">
          <Editor
            height="100%"
            width="100%"
            theme={editorMode}
            defaultLanguage="plaintext"
            defaultValue={"// enter input here"}
            value={input}
            options={inputOptions}
            onChange={(e) => setInput(e.target.value)}           />
        </div>
        <div className="std-output">
          <Editor
            height="100%"
            width="100%"
            theme={editorMode}
            defaultLanguage="plaintext"
            defaultValue={"// output"}
            value={output}
            options={outputOptions}
          />
        </div>
      </div>
      <br />
    </div>
  );
}

export default App;
