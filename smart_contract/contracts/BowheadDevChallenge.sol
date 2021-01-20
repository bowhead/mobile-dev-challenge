// SPDX-License-Identifier: GPLv3
pragma solidity >=0.4.22 <0.9.0;

contract BowheadDevChallenge {
  mapping(address => uint) private UserLevel;
  mapping(address => uint) private UserDataSubmissions;
  mapping(address => bytes32[]) private UserData;

  event UserRegistered(address user, uint level);
  event NewUserEarnings(address user, uint earning);

  function registerUser(uint level) external {
    require(level > 0, 'The level must be greater than 0');
    UserLevel[msg.sender] = level;

    emit UserRegistered(msg.sender, level);
  }

  function addHealthData(bytes32 data) external {
    uint userLevel = UserLevel[msg.sender];
    require(userLevel > 0, 'The user does not exist');

    uint submissions = UserDataSubmissions[msg.sender] + 1;
    UserDataSubmissions[msg.sender] = submissions;

    UserData[msg.sender].push(data);

    emit NewUserEarnings(msg.sender, userLevel * submissions);
  }

  function getHealthData() external view returns (bytes32[] memory userData){
    uint userLevel = UserLevel[msg.sender];
    require(userLevel > 0, 'The user does not exist');

    return UserData[msg.sender];
  }


}