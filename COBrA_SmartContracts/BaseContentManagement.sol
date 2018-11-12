pragma solidity ^0.4.21;


contract BaseContentManagement {

  uint8 constant maxRate = 100;

  function grantAccess(address user) external;

  function consumeContent() external;

  function getContentName() external view returns (bytes32);

  function rateContent(uint8 _cat0Rate, uint8 _cat1Rate, uint8 _cat2Rate) external;

  function getViews() external view returns (uint256);

  function getAuthor() external view returns (address);

  function getGenre() external view returns (bytes32);

  function getPayoutViews() view external returns (uint);

  function getRate(uint8 _index) view external returns (uint8);

  function getPrice() view external returns (uint);

  function getMaxRate() view external returns (uint);

  function resetPayoutViews() external;

  function closeContract() external;

}
