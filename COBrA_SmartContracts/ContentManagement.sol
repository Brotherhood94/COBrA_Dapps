pragma solidity ^0.4.21;

import "./BaseContentManagement.sol";
import "./Catalog.sol";


contract ContentManagement is BaseContentManagement {

  Catalog catalog;
  address author;
  bytes32 contentName;
  bytes32 genre;
  uint price;
  uint globalViews = 0;
  uint payoutViews = 0; //counter of views for the payout
  uint totFeedback = 0; //*number of feedback received //rimane comunque consistente anche con più utenti contemporaneamente
  uint8[4] rateByCategory;

  mapping (address => bool) grantedUsers;
  mapping (address => bool) canRate; //*Guarantees that only the users that have consumed the content can vote exactly one time.

  modifier onlyGranted() {
    require(grantedUsers[msg.sender]);
    _;
  }

  modifier onlyAuthor() {
    require(msg.sender == author);
    _;
  }

  modifier onlyCatalog() {
    require(msg.sender == address(catalog));
    _;
  }

  modifier onlyIfConsumed() {
   require(canRate[msg.sender]);
   _;
 }

 modifier onlyWithinRange(uint8 _cat0Rate, uint8 _cat1Rate, uint8 _cat2Rate) { //*
   require(_cat0Rate >= 0 && _cat0Rate <= maxRate && _cat1Rate >= 0 && _cat1Rate <= maxRate && _cat2Rate >= 0 && _cat2Rate <= maxRate );
   _;
 }

  event requestPayoutEvent(
    address indexed to
  );

  event feedbackActivation(
    bytes32 indexed contentName
  );

  constructor(string _contentName, string _genre, Catalog _newCatalog, uint _price) public{
    author = msg.sender;
    catalog = _newCatalog;
    assembly{
      sstore(contentName_slot, mload(add(_contentName, 32)))  //convert from string to byte32 and assign to storage variable
      sstore(genre_slot, mload(add(_genre, 32)))  //same as above
    }
    price = _price;
  }

  function getContentName() external view returns (bytes32){
    return contentName;
  }

  function getViews() external view returns (uint256){
    return globalViews;
  }

  function getAuthor() external view returns (address){
    return author;
  }

  function getGenre() external view returns (bytes32){
    return genre;
  }

  function getPayoutViews() onlyCatalog view external returns (uint){
    return payoutViews;
  }

  function getRate(uint8 _index) view external returns (uint8) {  //Obeserved that mapping gas cost, in this case is negligible against an implementation struc-based
    return rateByCategory[_index];
  }

  function getPrice() view external returns (uint){
    return price;
  }

  function getMaxRate() view external returns (uint){
    return maxRate;
  }

  function resetPayoutViews() onlyCatalog external{
    require(payoutViews >= catalog.getPayoutViews());  //double check. Otherwise, Catalog could behave in a malicious way
    payoutViews = 0;
  }

  function grantAccess(address _user) onlyCatalog external{
    grantedUsers[_user] = true;
  }

  function consumeContent() onlyGranted external{
    delete grantedUsers[msg.sender];
    globalViews++;
    payoutViews++;
    checkViews();
    canRate[msg.sender] = true;
    emit feedbackActivation(contentName);
  }

  function rateContent(uint8 _cat0Rate, uint8 _cat1Rate, uint8 _cat2Rate) onlyIfConsumed onlyWithinRange(_cat0Rate, _cat1Rate, _cat2Rate) external{
    delete canRate[msg.sender]; //Disable the possibility to vote more than one time per ConsumedContent for msg.sender.
    rateByCategory[0] = uint8((rateByCategory[0] * totFeedback + _cat0Rate) / (totFeedback+1));
    rateByCategory[1] = uint8((rateByCategory[1] * totFeedback + _cat1Rate) / (totFeedback+1));
    rateByCategory[2] = uint8((rateByCategory[2] * totFeedback + _cat2Rate) / (totFeedback+1));
    rateByCategory[3] = (rateByCategory[0]+rateByCategory[1]+rateByCategory[2]) / 3;
    totFeedback++;
    catalog.updateMostRated();
  }

  function checkViews() private{
    if(payoutViews >= catalog.getPayoutViews()){
      emit requestPayoutEvent(catalog);
      catalog.requestPayout();
    }
    catalog.updateMostPopularByAuthor();  //checks whether the catalog has to update Author's mostPopular content with this content
    catalog.updateMostPopularByGenre();   //checks whether the catalog has to update Genre's mostPopular content with this content
  }

  function closeContract() onlyCatalog external{
    selfdestruct(address(0));
  }


  function bytesToString(bytes32 _bytes32) private pure returns (string){
    string memory result;
    assembly {
      let val := mload(0x40)
      mstore(val, 0x20)
      mstore(add(val, 0x20), _bytes32)
      mstore(0x40, add(val, 0x40))
      result := val
    }
    return result;
  }

}
