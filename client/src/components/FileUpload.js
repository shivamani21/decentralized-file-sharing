import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider, fetchBlocks }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No File selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      console.log("Uploading file to Pinata...");

      const resFile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: "b6fd54333640d4281974",
            pinata_secret_api_key: "8fc36d59263b9713a0c7116c60d34b080a9354b85c78258408bebd1e900a0184",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      console.log("File uploaded successfully:", ImgHash);

      console.log("Sending transaction to smart contract...");
      const tx = await contract.add(account, ImgHash);
      await tx.wait();

      console.log("Transaction confirmed!");
      alert("File uploaded successfully to IPFS!");

      setFileName("No File selected");
      setFile(null);

      if (typeof fetchBlocks === "function") {
        fetchBlocks();  // ✅ Call fetchBlocks only if it exists
      } else {
        console.error("fetchBlocks is not a function");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Check console for details.");
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (!data) return;

    setFile(data);
    setFileName(data.name);
    console.log("Selected file:", data.name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">Choose File</label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">File: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
