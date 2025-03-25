# Decentralized Secure File Sharing System

## Overview
The **Decentralized Secure File Sharing System** is a blockchain-based platform that enables secure and decentralized file storage and sharing. It leverages **Ethereum, Solidity, IPFS (Pinata), and MySQL** to ensure data integrity, security, and accessibility.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Blockchain:** Ethereum, Solidity, Hardhat
- **Storage:** IPFS (Pinata)
- **Authentication:** MySQL
- **Wallet Integration:** MetaMask

## Features
✅ **Decentralized File Storage**: Uses IPFS (Pinata) for secure and immutable file storage.  
✅ **Blockchain Security**: Ensures secure access control with Ethereum smart contracts.  
✅ **User Authentication**: MySQL-based authentication for users and admins.  
✅ **File Upload & Access Management**: Users can upload files, set permissions, and share them securely.  
✅ **MetaMask Integration**: Connects with Ethereum wallets for transactions and authentication.  

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MetaMask](https://metamask.io/)
- [Hardhat](https://hardhat.org/)
- [MySQL](https://www.mysql.com/)

### Clone the Repository
```sh
git clone https://github.com/shivamani21/decentralized-file-sharing.git
cd decentralized-file-sharing
```

### Install Dependencies
```sh
npm install
```

### Set Up MySQL Database
1. Create a database in MySQL.
2. Update `.env` with your database credentials.

### Deploy Smart Contract (Hardhat)
```sh
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

### Run the Application
```sh
npm start
```

## Smart Contracts
- **Upload.sol**: Manages file storage, access control, and sharing permissions.
- **Deployment using Hardhat**: Contracts are deployed to Ethereum testnets.

## File Storage (IPFS Pinata)
- Files are uploaded to IPFS via Pinata.
- The returned hash is stored on the blockchain for verification.

## Authentication System
- Users and admins are authenticated using **MySQL**.
- Login system ensures secure access to uploaded files.

## Usage
1. **Connect MetaMask** to authenticate users.
2. **Upload files** securely to IPFS.
3. **Set permissions** for file access.
4. **Share files** using blockchain-verified access.
5. **Admins manage user roles** and file permissions.

## Future Enhancements
- Implement **Layer 2 scaling (Polygon)** to reduce gas fees.
- Improve **UI/UX** for better user interaction.
- Introduce **role-based access control** for more granular file management.

## Contributing
1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit changes and push.
4. Create a pull request (PR).

## License
This project is licensed under the MIT License.

## Contact
For queries, reach out at **shivamani21@github**.

