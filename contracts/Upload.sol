// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Upload {
  
  struct Access {
     address user; 
     bool access;
  }

  struct File {
      address owner;
      string url;
  }

  mapping(address => string[]) private value;
  mapping(address => File[]) private files;
  mapping(address => mapping(address => bool)) private ownership;
  mapping(address => Access[]) private accessList;
  mapping(address => mapping(address => bool)) private previousData;

  address[] private allUsers; // Store unique users

  function add(address _user, string memory url) external {
      if (value[_user].length == 0) {
          allUsers.push(_user); // Add user only if they're new
      }
      value[_user].push(url);
      files[_user].push(File(_user, url)); 
  }

  function allow(address user) external {
      ownership[msg.sender][user] = true; 
      if (previousData[msg.sender][user]) {
         for (uint i = 0; i < accessList[msg.sender].length; i++) {
             if (accessList[msg.sender][i].user == user) {
                  accessList[msg.sender][i].access = true; 
             }
         }
      } else {
          accessList[msg.sender].push(Access(user, true));  
          previousData[msg.sender][user] = true;  
      }
  }

  function disallow(address user) public {
      ownership[msg.sender][user] = false;
      for (uint i = 0; i < accessList[msg.sender].length; i++) {
          if (accessList[msg.sender][i].user == user) { 
              accessList[msg.sender][i].access = false;  
          }
      }
  }

  function display(address _user) external view returns (string[] memory) {
      require(_user == msg.sender || ownership[_user][msg.sender], "You don't have access");
      return value[_user];
  }

  function shareAccess() public view returns (Access[] memory) {
      return accessList[msg.sender];
  }

  // ✅ Function to fetch all unique users
  function getAllUsers() public view returns (address[] memory) {
      return allUsers;
  }

  // ✅ Function to fetch all uploaded files of a specific user
  function getAllFiles(address _user) public view returns (File[] memory) {
      return files[_user];
  }
}
