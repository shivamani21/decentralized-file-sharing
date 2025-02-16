import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import BlockchainBlocks from "./components/BlockchainBlocks";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_ADDRESS = "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a";

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: account, password }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Login Successful");
        setLoggedIn(true);
        if (account.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
          setIsAdmin(true);
          fetchAllBlocks();
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to connect to the server");
    }
  };

  const handleRegister = async () => {
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: account, password }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Registration Successful! Logging in...");
        handleLogin();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to connect to the server");
    }
  };

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("accountsChanged", () => window.location.reload());
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  const fetchAllBlocks = async () => {
    if (contract) {
      try {
        console.log("Fetching all blocks...");
        const users = await contract.getAllUsers();
        console.log("Users retrieved from blockchain:", users);

        let allFiles = [];
        for (let user of users) {
          const userFiles = await contract.getAllFiles(user);
          console.log(`Files for user ${user}:`, userFiles);

          userFiles.forEach(file => {
            allFiles.push({ owner: user, fileUrl: file.url });
          });
        }

        // ✅ Sort files by upload order to maintain a global block sequence
        // Assuming files are stored in order in the contract, this keeps global order
        let allBlocks = allFiles.map((data, index) => ({
          index: index + 1,
          hash: ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
            ["string", "address"],
            [data.fileUrl, data.owner]
          )),
          previousHash: index === 0 ? "000000000000" : ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
            ["string", "address"],
            [allFiles[index - 1].fileUrl, allFiles[index - 1].owner]
          )),
          transactions: [{ fileName: data.fileUrl, owner: data.owner }],
        }));

        console.log("Final blocks to display:", allBlocks);
        setBlocks(allBlocks);
      } catch (error) {
        setError("Failed to fetch blockchain data");
        console.error("Error fetching blockchain data:", error);
      }
    }
};


if (!loggedIn) {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login or Register</h2>
        <p className="account-text">Ethereum Address: {account || "Not connected"}</p>
        <input
          className="login-input"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-group">
          <button className="login-button" onClick={handleLogin}>Login</button>
          <button className="register-button" onClick={handleRegister}>
            Register
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}


  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>Share</button>
      )}
      {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}
      <div className="App">
        <h1 className="heading" style={{ color: "white" }}>DECENTRALIZED FILE SHARING</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        <p style={{ color: "white" }}>Account ID: {account || "Not connected"}</p>
        <FileUpload account={account} provider={provider} contract={contract} />
        <Display contract={contract} account={account} />
        {isAdmin && (
          <>
            <h2 style={{ color: "white", marginTop: "20px" }}>Blockchain Ledger</h2>
            <button onClick={fetchAllBlocks} style={{ marginBottom: "10px" }}>Admin View All Blocks</button>
            <BlockchainBlocks blocks={blocks} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
