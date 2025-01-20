import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [resFile, setResFile] = useState(null);

  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
      } else {
        dataArray = await contract.display(account);
      }

      if (!dataArray || Object.keys(dataArray).length === 0) {
        alert("No File to display");
        return;
      }

      const str = dataArray.toString();
      const str_array = str.split(",");

      const images = str_array.map((item, i) => {
        // Extract file name from the URL
        const fileName = item.split("/").pop(); // Get the last part of the URL
        return (
          <a href={item} key={i} target="_blank" rel="noopener noreferrer">
            <img
              src={
                resFile && resFile.data
                  ? `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`
                  : item
              }
              alt={fileName} // Use the file name here
              className="image-list"
            />
          </a>
        );
      });
      setData(images);
    } catch (e) {
      console.error("Error fetching data:", e);
      alert("You don't have access or an error occurred.");
    }
  };

  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};

export default Display;
