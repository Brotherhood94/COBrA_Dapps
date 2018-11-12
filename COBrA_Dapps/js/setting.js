var web3;
var catalog;
var catalogAddress = "0x3b59d17f8d91054ae0edbcdc189cdc756a503dae";
var contentManagement;
var contentManagementContract;
var GrantedAccessEvt;
var PremiumEvt;
var NewContentEvt;
var contentData = "0x608060405260006005556000600655600060075534801561001f57600080fd5b5060405161091d38038061091d833981016040908152815160208084015192840151606085015160018054600160a060020a0319908116331790915560008054600160a060020a039094169390911692909217909155918401810151600255919092010151600355600455610884806100996000396000f3006080604052600436106100ab5763ffffffff60e060020a6000350416630ae5e73981146100b0578063178ff556146100d357806320fe84f1146100e857806340f9f2351461010f5780634bef262814610124578063610be6541461014b5780636152987314610160578063855afeae1461017557806398d5fdca1461018a578063a5faa1251461019f578063b7ebae0b146101d0578063cca68b7714610201578063d2a6e00214610216575b600080fd5b3480156100bc57600080fd5b506100d1600160a060020a036004351661022b565b005b3480156100df57600080fd5b506100d1610266565b3480156100f457600080fd5b506100fd6102ff565b60408051918252519081900360200190f35b34801561011b57600080fd5b506100d1610305565b34801561013057600080fd5b506100d160ff600435811690602435811690604435166103af565b34801561015757600080fd5b506100d16105b2565b34801561016c57600080fd5b506100fd6105cd565b34801561018157600080fd5b506100fd6105d3565b34801561019657600080fd5b506100fd6105d9565b3480156101ab57600080fd5b506101b46105df565b60408051600160a060020a039092168252519081900360200190f35b3480156101dc57600080fd5b506101eb60ff600435166105ee565b6040805160ff9092168252519081900360200190f35b34801561020d57600080fd5b506100fd61061d565b34801561022257600080fd5b506100fd61063c565b600054600160a060020a0316331461024257600080fd5b600160a060020a03166000908152600960205260409020805460ff19166001179055565b3360009081526009602052604090205460ff16151561028457600080fd5b336000908152600960205260409020805460ff191690556005805460019081019091556006805490910190556102b8610641565b336000908152600a6020526040808220805460ff19166001179055600254905190917f2e526b9f861bdabb1d2e7825374548c154d3e4784b4710a841844d6cdaa6a06d91a2565b60035490565b600054600160a060020a0316331461031c57600080fd5b6000809054906101000a9004600160a060020a0316600160a060020a031663cca68b776040518163ffffffff1660e060020a028152600401602060405180830381600087803b15801561036e57600080fd5b505af1158015610382573d6000803e3d6000fd5b505050506040513d602081101561039857600080fd5b505160065410156103a857600080fd5b6000600655565b336000908152600a602052604090205460ff1615156103cd57600080fd5b82828260008360ff16101580156103e85750606460ff841611155b80156103f8575060008260ff1610155b80156104085750606460ff831611155b8015610418575060008160ff1610155b80156104285750606460ff821611155b151561043357600080fd5b336000908152600a60205260409020805460ff19169055600754600854600182019160ff8981169216020181151561046757fe5b6008805460ff19169290910460ff9081169290921790819055600754600181019288811661010090930416020181151561049d57fe5b6008805460ff9390920483166101000261ff001990921691909117908190556007546001810192878116620100009093041602018115156104da57fe5b6008805462ff00001916620100009390920460ff908116840292909217908190556003928183166101008304841601910482160116600880549290910460ff1663010000000263ff0000001990921691909117905560078054600101905560008054604080517f38e6ca750000000000000000000000000000000000000000000000000000000081529051600160a060020a03909216926338e6ca759260048084019382900301818387803b15801561059257600080fd5b505af11580156105a6573d6000803e3d6000fd5b50505050505050505050565b600054600160a060020a031633146105c957600080fd5b6000ff5b60055490565b60025490565b60045490565b600154600160a060020a031690565b6000600860ff83166004811061060057fe5b602081049091015460ff601f9092166101000a9004169050919050565b60008054600160a060020a0316331461063557600080fd5b5060065490565b606490565b6000809054906101000a9004600160a060020a0316600160a060020a031663cca68b776040518163ffffffff1660e060020a028152600401602060405180830381600087803b15801561069357600080fd5b505af11580156106a7573d6000803e3d6000fd5b505050506040513d60208110156106bd57600080fd5b5051600654106107705760008054604051600160a060020a03909116917f8670953310f0ae6bfab41303733bef0f2d918959e2eed130396bf67f8cb0490b91a260008054604080517f65058f4c0000000000000000000000000000000000000000000000000000000081529051600160a060020a03909216926365058f4c9260048084019382900301818387803b15801561075757600080fd5b505af115801561076b573d6000803e3d6000fd5b505050505b60008054604080517faa127cd90000000000000000000000000000000000000000000000000000000081529051600160a060020a039092169263aa127cd99260048084019382900301818387803b1580156107ca57600080fd5b505af11580156107de573d6000803e3d6000fd5b505060008054604080517f999e19a70000000000000000000000000000000000000000000000000000000081529051600160a060020a03909216945063999e19a79350600480820193929182900301818387803b15801561083e57600080fd5b505af1158015610852573d6000803e3d6000fd5b505050505600a165627a7a723058206b2b777943f97860f9ef9ea1ade2ed36a439faaf2e72a1b92116da41a2dbdae70029"

function settingUp(){
    if (typeof web3 !== 'undefined')
        web3 = new Web3(web3.currentProvider);
    else
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    if(!web3.isConnected())
      console.log("not connected");
    else
      console.log("connected");


    catalogContract = web3.eth.contract(
      [{"constant":true,"inputs":[{"name":"_x","type":"uint256"}],"name":"getNewContentList","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getStatistics","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"updateMostRated","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"buyPremium","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"getMostPopularByAuthor","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"},{"name":"_cat","type":"uint8"}],"name":"getMostRatedByAuthor","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contentManagementContract","type":"address"}],"name":"addContent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_genre","type":"string"},{"name":"_cat","type":"uint8"}],"name":"getMostRatedByGenre","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isPremium","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"closeContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"requestPayout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contentName","type":"string"}],"name":"getContentManagement","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getContentList","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_genre","type":"string"}],"name":"getMostPopularByGenre","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contentName","type":"string"}],"name":"getContent","outputs":[{"name":"","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"updateMostPopularByGenre","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contentName","type":"string"},{"name":"_toUser","type":"address"}],"name":"giftContent","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"updateMostPopularByAuthor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contentName","type":"string"}],"name":"getContentPremium","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_toUser","type":"address"}],"name":"giftPremium","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getPayoutViews","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"_author","type":"address"}],"name":"getLatestByAuthor","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getEndPremium","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_genre","type":"string"}],"name":"getLatestByGenre","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_cat","type":"uint8"}],"name":"getMostRated","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"}],"name":"premiumEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"contentName","type":"bytes32"}],"name":"grantedAccessEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"}],"name":"payoutEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"author","type":"address"},{"indexed":true,"name":"genre","type":"bytes32"}],"name":"newContentPubblication","type":"event"},{"anonymous":false,"inputs":[],"name":"catalogSelfDestructed","type":"event"}]
      );

    contentManagementContract = web3.eth.contract(
      [{"constant":false,"inputs":[{"name":"_user","type":"address"}],"name":"grantAccess","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"consumeContent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getGenre","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"resetPayoutViews","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_cat0Rate","type":"uint8"},{"name":"_cat1Rate","type":"uint8"},{"name":"_cat2Rate","type":"uint8"}],"name":"rateContent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"closeContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getViews","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getContentName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAuthor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint8"}],"name":"getRate","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPayoutViews","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMaxRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_contentName","type":"string"},{"name":"_genre","type":"string"},{"name":"_newCatalog","type":"address"},{"name":"_price","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"to","type":"address"}],"name":"requestPayoutEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"contentName","type":"bytes32"}],"name":"feedbackActivation","type":"event"}]
    );

    catalog = catalogContract.at(catalogAddress);
}


function deployContent(){
  var name = document.getElementById("name").value.trim();
  var genre = document.getElementById("genre").value.trim();
  var catAddr = catalogAddress;
  var price = document.getElementById("price").value.trim();

  if(!isAddressSelected() ) return;
  if(price < 0){
    setUpModal("Price must be greater or equal 0.", " fa-exclamation-triangle ","modal-danger");
    return;
  }
  if(!name || !genre || !price){
    setUpModal("One or more fields are empty.", " fa-exclamation-triangle ","modal-danger");
    return;
  }
  if(isInCatalog(name)){
    setUpModal("<strong>\""+name+"\"</strong> already exists in the catalog. <br> Please change content name.", " fa-exclamation-triangle ","modal-danger");
    return;
  }
  contentManagement = contentManagementContract.new(name,genre,catAddr,price,{
    data: contentData,
    from: web3.eth.defaultAccount,
    gas: 4700000
  },function (e, contract){
    if (typeof contract.address !== 'undefined') {
        setUpModal("Your content has been successfully deployed at address <strong>"+contract.address+"</strong><br> Wait for it to be inserted into the catalog.", " fa-exclamation-triangle ","modal-info");
        var tx = catalog.addContent(contract.address, { gas: 200000 });
        awaitBlock(tx, 0, 100, "Content inserted in Catalog!", "Transaction Reverted", true);
    }
 });
  $('#modalContactForm').modal('hide');
  setUpModal("Waiting a mined block to include your <strong>contract</strong>... ", " fa-exclamation-triangle ","modal-info");
}

function watchingEvents(){
  GrantedAccessEvt = catalog.grantedAccessEvent({user: web3.eth.defaultAccount}, {fromBlock: "latest"}).watch(function(error, result){
      if(!error){
          $('#myModal').modal('hide');
          notify("Access Granted!", "Enjoy <strong>\""+web3.toUtf8(result.args.contentName)+"\"</strong>", "success");
        }
  });

  PremiumEvt = catalog.premiumEvent({user: web3.eth.defaultAccount}, {fromBlock: "latest"}).watch(function(error, result){
      if(!error){
          $('#myModal').modal('hide');
          notify("Premium Subscription!", "Enjoy your new <strong>Premium Subs!</strong>\"", "success");
        }
  });
}

function stopWatchingEvents(){
  if(GrantedAccessEvt)
    GrantedAccessEvt.stopWatching();
  if(PremiumEvt)
    PremiumEvt.stopWatching();
  if(NewContentEvt)
    NewContentEvt.stopWatching();
}


function awaitBlock(tx, x, nBlock, goodAnswer, badAnswer, show){
  setTimeout(function(){
    var receipt = web3.eth.getTransactionReceipt(tx);
    if(receipt != null){
      console.log("mined "+receipt.status);
      if(receipt.status == '0x1' && show)
        setUpModal(goodAnswer," fa-check ","modal-success");
      else if(receipt.status == '0x0')
        setUpModal(badAnswer," fa-exclamation-triangle ","modal-danger");
      return;
    }
    if(x > nBlock){
      setUpModal("Transaction is taking time. Maybe due to congestion."," fa-exclamation-triangle ","modal-warning");
      return;
    }
    console.log("waiting...");
    awaitBlock(tx, x++, nBlock, goodAnswer, badAnswer, show);
  }, 5000);
}


function setPreferences(){
  if(!isAddressSelected()) return;
  var info = document.getElementById("genreAuthorInput").value.trim();
  if(!info){
    setUpModal("Genre/Author field is empty.", " fa-exclamation-triangle ","modal-danger");
    return;
  }
  var select = document.getElementById("genreAuthorSelect").value;
  NewContentEvt = catalog.newContentPubblication({select: info}, {fromBlock: "latest"}).watch(function(error, result){
      if(!error){
        $('#myModal').modal('hide');
        notify("New Content Publication!<br><br>", "Author: \"<strong>"+result.args.author+"</strong>\"<br>Genre: \"<strong>"+web3.toUtf8(result.args.genre)+"</strong>\"", "info");
      }
  });
}


function setUpModal(title, icon, color, inout){
  resetChilds("myList");
  document.getElementById("modalPos").setAttribute("class", inout+" modal-dialog modal-right modal-notify "+color);
  document.getElementById("headModal").innerHTML = title;
  document.getElementById("modalIcon").setAttribute("class", icon+"fa fa-4x mb-3 animated rotateIn");
  $('#myModal').modal('show');
  //setTimeout(function() {$('#myModal').modal('hide');}, 4000);
}

function resetChilds(id){
  var parent = document.getElementById(id);
  while (parent.firstChild)
      parent.removeChild(parent.firstChild);
}

function selectAccount(button){
  resetChilds("list");
  var ul = document.getElementById("list");
  for(var i = 0; i < web3.eth.accounts.length; i++){
    var li = document.createElement("LI");
    li.innerHTML = "<strong onclick=\"setSelectedAccount();\">"+web3.eth.accounts[i]+"</strong>";
    ul.appendChild(li);
  }
}

function setSelectedAccount(){
  var selected_index = null;
  stopWatchingEvents();
  $('.dropdown-menu li').on('click', function(){
    selected_index = $(this).closest('li').index();
    web3.eth.defaultAccount = web3.eth.accounts[selected_index];
    watchingEvents();
    document.getElementById("dropdownText").innerHTML = web3.eth.defaultAccount;
    setCostumerType(catalog.getEndPremium());
  });
}

function setCostumerType(endPremium){
  var costumerType = document.getElementById("addressINFO");
  costumerType.style.fontWeight = "900";
  costumerType.style.color = "white";
  if(catalog.isPremium())
    costumerType.innerHTML = "[PREMIUM] ends in "+(endPremium - web3.eth.blockNumber)+" blocks";
  else
    costumerType.innerHTML = "[STANDARD]";
}


function isInCatalog(name){   //regex: checks if (catalog.getContentName(name)) is == 0x0000000000000000000000000000000000000000 (i.e. does not exist in the catalog)
  if(/^0x0+$/.test(catalog.getContentManagement(name))){
    setUpModal("<strong>\""+name+"\"</strong> does not exists in the catalog.", " fa-exclamation-triangle ","modal-danger");
    return false;
  }
  return true;
}

function isValidAddress(address){
  if(!web3.isAddress(address)){
    setUpModal("<strong>\""+address+"\"</strong> is an invalid address.", " fa-exclamation-triangle ","modal-danger");
    return false;
  }
  return true;
}

function nullContentAddress(){
  if(contentManagement == null){   //Contract must be loaded.
    document.getElementById("addressInput").style.color = "red";
    setUpModal("Please, first search for a contract first."," fa-exclamation-triangle ","modal-danger");
    return true;
  }
  return false;
}


function enoughBalance(price){
  if(web3.fromWei(web3.eth.getBalance(web3.eth.defaultAccount).toNumber(), "finney")  < Number(price)){ //checks whether it has enough balance
    setUpModal("Insufficient balance"," fa-exclamation-triangle ","modal-danger");
    return false;
  }
  return true;
}

function isAddressSelected(){
  if(!web3.eth.defaultAccount){    //checks whether the address has been chosen.
    document.getElementById('dropdownText').click();
    setUpModal("Please, select an address. <br> Top-right of this page."," fa-exclamation-triangle ","modal-danger");
    return false;
  }
  return true;
}

function enoughValue(value, price){
  if(Number(value) < Number(price)){  //checks whether the value specified in input, is enough
    setUpModal("Purchase Failed!<br>At least "+price+" finney"," fa-exclamation-triangle ","modal-danger");
    return false;
  }
  return true;
}


function notify(title, text, type){
  $(function(){
    PNotify.prototype.options.history.maxonscreen = 3;
    PNotify.prototype.options.delay = 1500;
    new PNotify({
      title: title,
      text: text,
      styling: 'bootstrap3',
      icon: 'fa fa-bell-o fa-3x',
      type: type,
      width: '25%',
      animate: {
          animate: true,
          in_class: 'rotateInDownRight',
          out_class: 'zoomOutDown'
      },
    });
  });
}
