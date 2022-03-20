import { useEffect, useState } from "react";

const { ipcRenderer } = window;

const style = {
  margin: 10,
  padding: 10,
  border: "1px solid",
  borderRadius: 8
};

const App = () => {
  const [version, setVersion] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    ipcRenderer.send("app_version");

    ipcRenderer.on("app_version", (event, args) => {
      setVersion(args.version);
    });

    ipcRenderer.on("files", (event, args) => {
      setFiles(args.files);
    });
  }, []);

  return (
    <div>
      <div style={style}>
        <p>This is first electron desktop app.</p>
        <p>This application version is {version}</p>
      </div>
      <div style={style}>
        <button
          onClick={() => {
            ipcRenderer.send("files");
          }}
        >
          파일 명 가져오기
        </button>
        {files.map(file => (
          <p key={file}>{file}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
