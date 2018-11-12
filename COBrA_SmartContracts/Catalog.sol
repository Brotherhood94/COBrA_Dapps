pragma solidity ^0.4.21;

import "./BaseContentManagement.sol";

/*Assumptions:
  --> Standard users are that users those are not premium
  --> An user cannot gift a premium subs to another user that is already premium
  --> Contents's names are unique
  --> A block is mined, on avg, every 15 secs. Thus 240 blocks are mined in 1 hour.
  --> String MAX-LENGTH 32 bytes
*/

contract Catalog{

  address creator;
  uint constant payoutViews = 120;
  uint constant premiumCost = 40 finney;

  BaseContentManagement[] newest;

  struct genre {
    BaseContentManagement latest;
    BaseContentManagement mostPopular;
    BaseContentManagement[4] mostRatedByCategory; //contains the 3 categories + the highest average of all ratings
  }

  struct author {
    BaseContentManagement latest;
    BaseContentManagement mostPopular;
    BaseContentManagement[4] mostRatedByCategory;   //contains the 3 categories + the highest average of all ratings
  }


  mapping (bytes32 => genre) statsByGenre;
  mapping (address => author) statsByAuthor;
  BaseContentManagement[4] overallMostRated;  //contains the 3 categories + the highest average of all ratings

  mapping (bytes32 => BaseContentManagement) nameToContent;

  //Binds each premium address with the block height that determines the premium access expiration
  mapping (address => uint) endPremium;


  //Constructor
  constructor() public{
    creator = msg.sender;
  }

  //Modifiers
  modifier isOriginalAuthor(BaseContentManagement _contentManagementContract){ //Guarantees that the one who publishes the content in the catalog is also the author of the content
    require(msg.sender == _contentManagementContract.getAuthor());
    _;
  }

  modifier onlyCreator(){
    require(msg.sender == creator);
    _;
  }

  modifier onlyPremium(){
    require(block.number <= endPremium[msg.sender]);
    _;
  }

  modifier onlyStandard(){
    require(block.number > endPremium[msg.sender]);
    _;
  }

  modifier onlyAtLeast(uint _amount){
    require(msg.value >= _amount);
    _;
  }

  modifier isInCatalog(BaseContentManagement _actual){
   require(nameToContent[_actual.getContentName()] != address(0));
   _;
 }

 event premiumEvent(
   address indexed user
  );

 event grantedAccessEvent(
   address indexed user,
   bytes32 contentName
 );

  event payoutEvent(
    address indexed to
  );

  event newContentPubblication(
    address indexed author,
    bytes32 indexed genre
  );

  event catalogSelfDestructed();


  //Functions
  //**************//
  function getStatistics() external view returns (uint[]){
    uint[] memory results = new uint[](newest.length);
    for(uint i = 0; i < newest.length; i++)
      results[i] = newest[i].getViews();
    return results;
  }

  function getContentList() external view returns (bytes32[]){
    bytes32[] memory results = new bytes32[](newest.length);
    for(uint i = 0; i < newest.length; i++)
      results[i] = newest[i].getContentName();
    return results;
  }

  //return from the most_recent to the (most_recent - x) contents.
  function getNewContentList(uint _x) external view returns (bytes32[]){
    uint len = _x > newest.length ? newest.length : _x;
    bytes32[] memory results = new bytes32[](len);
    uint i = 1;
    while(i <= _x && int(newest.length - i) >= 0 ){  // Checks to not go below 0.
      results[i-1] = newest[newest.length - i].getContentName();
      i++;
    }
    return results;
  }

  function getLatestByGenre(string _genre) external view returns (bytes32){
    BaseContentManagement cmc = statsByGenre[stringToBytes(_genre)].latest; //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    return cmc.getContentName();
  }

  function getMostPopularByGenre(string _genre) external view returns (bytes32){
    BaseContentManagement cmc = statsByGenre[stringToBytes(_genre)].mostPopular;  //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    return cmc.getContentName();
  }

  function getMostRatedByGenre(string _genre, uint8 _cat) external view returns (bytes32){
    BaseContentManagement cmc = statsByGenre[stringToBytes(_genre)].mostRatedByCategory[_cat];  //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    return cmc.getContentName();
  }

  //*******************//

  function getLatestByAuthor(address _author) external view returns (bytes32){
    BaseContentManagement cmc = statsByAuthor[_author].latest;  //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    return cmc.getContentName();
  }

  function getMostPopularByAuthor(address _author) external view returns (bytes32){
    BaseContentManagement cmc = statsByAuthor[_author].mostPopular; //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    return cmc.getContentName();
  }

  function getMostRatedByAuthor(address _author, uint8 _cat) external view returns (bytes32){
    BaseContentManagement cmc = statsByAuthor[_author].mostRatedByCategory[_cat]; //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    return cmc.getContentName();
  }

  //************************//

  function getMostRated(uint8 _cat) external view returns (bytes32){
    BaseContentManagement cmc = overallMostRated[_cat];
    return cmc.getContentName();
  }

    //************************//

  function isPremium() external view returns (bool){
    if(block.number <= endPremium[msg.sender])
      return true;
    return false;
  }

  //**************//

  function getContent(string _contentName) onlyStandard onlyAtLeast(nameToContent[stringToBytes(_contentName)].getPrice()) external payable returns (BaseContentManagement){
    BaseContentManagement cmc = nameToContent[stringToBytes(_contentName)]; //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    RequestAccess(cmc, msg.sender);
    return cmc;
  }

  function getContentPremium(string _contentName) onlyPremium external returns (BaseContentManagement){
    BaseContentManagement cmc = nameToContent[stringToBytes(_contentName)]; //if the _contentName does not exists then the tx will be reverted. Implicit control over content existence
    RequestAccess(cmc, msg.sender);
    return cmc;
  }

  function giftContent(string _contentName, address _toUser) onlyAtLeast(nameToContent[stringToBytes(_contentName)].getPrice()) external payable{ //Both the Standard and Premium user can gift a content.
    BaseContentManagement cmc = nameToContent[stringToBytes(_contentName)];
    RequestAccess(cmc, _toUser);
  }

  function giftPremium(address _toUser) onlyAtLeast(premiumCost) external payable{
    require(block.number > endPremium[_toUser]); //Assumption: if _toUser is already premium, I cannot receive gifted premium Subscription
    endPremium[_toUser] = block.number + costPerBlock(msg.value);
    emit premiumEvent(_toUser);
  }

  function buyPremium() onlyStandard() onlyAtLeast(premiumCost) external payable{
    endPremium[msg.sender] = block.number + costPerBlock(msg.value);
    emit premiumEvent(msg.sender);
  }

  //**************//

  function getContentManagement(string _contentName) external view returns (BaseContentManagement){ //used by users who have been gifted a content
    return nameToContent[stringToBytes(_contentName)];
  }

  function updateMostPopularByAuthor() isInCatalog(BaseContentManagement(msg.sender)) external {
    BaseContentManagement _contentManagementActual = BaseContentManagement(msg.sender);
    if(statsByAuthor[_contentManagementActual.getAuthor()].mostPopular == address(0) || _contentManagementActual.getViews() > statsByAuthor[_contentManagementActual.getAuthor()].mostPopular.getViews()) //1° predicate: if there is not any content mapped on "mostPopular", then set _contentManagementActual as "mostPopular"
      statsByAuthor[_contentManagementActual.getAuthor()].mostPopular = _contentManagementActual;
  }

  function updateMostPopularByGenre() isInCatalog(BaseContentManagement(msg.sender)) external {
    BaseContentManagement _contentManagementActual = BaseContentManagement(msg.sender);
    if(statsByGenre[_contentManagementActual.getGenre()].mostPopular == address(0) || _contentManagementActual.getViews() > statsByGenre[_contentManagementActual.getGenre()].mostPopular.getViews())  //1° predicate: if there is not any content mapped on "mostPopular", then set _contentManagementActual as "mostPopular"
      statsByGenre[_contentManagementActual.getGenre()].mostPopular = _contentManagementActual;
  }

  //**********//

  function updateMostRated() isInCatalog(BaseContentManagement(msg.sender)) external {
    BaseContentManagement _contentManagementActual = BaseContentManagement(msg.sender);
    genre storage gen = statsByGenre[_contentManagementActual.getGenre()];
    author storage aut = statsByAuthor[_contentManagementActual.getAuthor()];
    uint catRateActual = 0;
    for(uint8 cat = 0; cat < overallMostRated.length; cat++){
      catRateActual = _contentManagementActual.getRate(cat);
      if(overallMostRated[cat] == address(0) || catRateActual > overallMostRated[cat].getRate(cat))
        overallMostRated[cat] = _contentManagementActual;
      if(gen.mostRatedByCategory[cat] == address(0) || catRateActual > gen.mostRatedByCategory[cat].getRate(cat))
        gen.mostRatedByCategory[cat] = _contentManagementActual;
      if(aut.mostRatedByCategory[cat] == address(0) ||  catRateActual > aut.mostRatedByCategory[cat].getRate(cat))
        aut.mostRatedByCategory[cat] = _contentManagementActual;
    }
  }


  //**************//

  function addContent(BaseContentManagement _contentManagementContract) isOriginalAuthor(_contentManagementContract) external {
    require(nameToContent[_contentManagementContract.getContentName()] == address(0)); //The content Name has to be not already mapped. -- Checks for Unique Content Name.
    nameToContent[_contentManagementContract.getContentName()] = _contentManagementContract; //map the contentName
    newest.push(_contentManagementContract); //Array sorted from oldest to newest
    statsByAuthor[_contentManagementContract.getAuthor()].latest = _contentManagementContract;
    statsByGenre[_contentManagementContract.getGenre()].latest = _contentManagementContract;
    emit newContentPubblication(_contentManagementContract.getAuthor(), _contentManagementContract.getGenre());
  }

  function RequestAccess(BaseContentManagement _cmc, address _user) private {
    _cmc.grantAccess(_user);
    emit grantedAccessEvent(_user, _cmc.getContentName());

  }

  function requestPayout() external{   //No Modifiers on the user type because both user and author can be malicius. --> Thus Catalog performs his own check on the content views
    BaseContentManagement _contentManagement = BaseContentManagement(msg.sender);  //non era così
    require(_contentManagement.getPayoutViews() >= payoutViews); //Double check because I cannot assume that this function is not invoked in a malicius way
    uint payoutReward = _contentManagement.getPrice()*_contentManagement.getRate(3)/_contentManagement.getMaxRate(); //In this way I Guarantees that author can behave maliciusly tampering the maxRate
    _contentManagement.resetPayoutViews();
    emit payoutEvent(_contentManagement.getAuthor());
    _contentManagement.getAuthor().transfer(payoutReward); // For construction (based on the amounts chosen to be paid), the smart contract has the needed ether to payout the author.
  }

  function getPayoutViews() external pure returns (uint) {
    return payoutViews;
  }


  function closeContract() onlyCreator external {
    uint totViews = 0;
    uint[] memory contentsViews = new uint[](newest.length);
    address[] memory contentsAuthors = new address[](newest.length);
    for(uint i = 0; i < newest.length; i++){
      uint views = newest[i].getViews();
      totViews+= views;
      contentsViews[i] = views;
      contentsAuthors[i] = newest[i].getAuthor();
      newest[i].closeContract();
    }
    for(uint k = 0; k < contentsAuthors.length; k++)
      contentsAuthors[k].transfer(howMuchToSend(totViews, contentsViews[k]));
    emit catalogSelfDestructed();
    selfdestruct(address(0));
  }

  function getEndPremium() public view returns (uint){
    return endPremium[msg.sender];
  }

  function howMuchToSend(uint _totViews, uint _contentViews) private view returns (uint){
    return address(this).balance*_contentViews/_totViews;
  }

  function costPerBlock(uint _valuePaid) private pure returns (uint){ // 40 finney : 240 blocks = _valuePaid : y blocks. Where 240 block = 1 hours
    return _valuePaid*240/premiumCost;
  }

  function stringToBytes(string _s) private pure returns (bytes32){
    bytes32 result;
    assembly {
        result := mload(add(_s, 32))
    }
    return result;
  }

}
