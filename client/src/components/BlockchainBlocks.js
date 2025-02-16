import React from "react";

const BlockchainBlocks = ({ blocks }) => {
  if (!blocks || blocks.length === 0) {
    return <p style={{ color: "white" }}>No blocks found.</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20px", color: "white" }}>
      <h2>Blockchain Blocks</h2>
      {blocks.map((block) => (
        <div key={block.index} style={{ border: "1px solid white", padding: "10px", margin: "10px", backgroundColor: "#333" }}>
          <h3>Block {block.index}</h3>
          <p><strong>Block Hash:</strong> {block.hash}</p>
          <p><strong>Previous Block Hash:</strong> {block.previousHash}</p>
          <p><strong>Transaction:</strong>
          <ul>
            {block.transactions.map((tx, i) => (
              <li key={i}>{tx.fileName}</li>
            ))}
          </ul>
          </p>
          <p><strong>Owner:</strong>
          <ul>
            {block.transactions.map((tx, i) => (
              <li key={i}>{tx.owner}</li>
            ))}
          </ul>
          </p>
        </div>
      ))}
    </div>
  );
};

export default BlockchainBlocks;
