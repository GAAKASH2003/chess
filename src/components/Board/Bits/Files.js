import "./Files.css";
const alpha = "ABCDEFGH";
const Files = ({ files }) => (
  <>
    <div className="files">
      {files.map((file) => (
        <span key={file}>{alpha[file.charCodeAt(0) - 97]}</span>
      ))}
    </div>
  </>
);

export default Files;
