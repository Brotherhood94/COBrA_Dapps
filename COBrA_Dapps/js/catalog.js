function appendToStatistics(){
  setUpModal("Statistics","fa-list-ol ","modal-success", "modal-full-height");
  var contentList = catalog.getContentList();
  var viewsContents = catalog.getStatistics();
  for(var i = 0; i < contentList.length; i++){
    li = appendToLi(contentList[i]);
    var span = document.createElement('span')
    span.setAttribute("class", "badge badge-warning badge-pill ml-2");
    span.innerHTML = viewsContents[i];
    li.appendChild(span);
  }
}

function appendToNewest(button){
  n = button.previousElementSibling.value.trim();
  var newContentList = catalog.getNewContentList(n);
  setUpModal("Last "+newContentList.length,"fa-sort-numeric-asc ","modal-success", "modal-full-height");
  for(var i = 0; i < newContentList.length; i++)
    appendToLi(newContentList[i]);
}


function appendLatestByGenre(button){
  var genre = button.previousElementSibling.value.trim();
  setUpModal("Latest "+genre,"fa-list-ol ","modal-success");
  appendToLi(catalog.getLatestByGenre(genre));
}

function appendLatestByAuthor(button){
  var author = button.previousElementSibling.value.trim();
  setUpModal("Latest "+author,"fa-list-ol ","modal-success");
  appendToLi(catalog.getLatestByAuthor(author));
}

function appendMostPopularByGenre(button){
  var genre = button.previousElementSibling.value.trim();
  setUpModal("Most Popular "+genre,"fa-list-ol ","modal-success");
  appendToLi(catalog.getMostPopularByGenre(genre));
}

function appendMostPopularByAuthor(button){
  var author = button.previousElementSibling.value.trim();
  setUpModal("Most Popular "+author,"fa-list-ol ","modal-success");
  appendToLi(catalog.getMostPopularByAuthor(author));
}

function appendMostRatedByGenre(button){
  var genre = button.previousElementSibling.value.trim();
  var category = button.nextElementSibling.selectedIndex;
  setUpModal("Most Rated "+genre,"fa-list-ol ","modal-success");
  appendToLi(catalog.getMostRatedByGenre(genre, category));
}

function appendMostRatedByAuthor(button){
  var author = button.previousElementSibling.value.trim();
  var category = button.nextElementSibling.selectedIndex;
  setUpModal("Most Rated "+author,"fa-list-ol ","modal-success");
  appendToLi(catalog.getMostRatedByAuthor(author, category));
}

function appendMostRated(button){
  var category = button.nextElementSibling.selectedIndex;
  setUpModal("Most Rated","fa-list-ol ","modal-success");
  appendToLi(catalog.getMostRated(category));
}


function getContentManagement(button){
  var name = button.previousElementSibling.value.trim();
  setUpModal("Address of "+name," fa-at ","modal-danger");
  var li = document.createElement("LI");
  li.setAttribute("class", "list-group-item justify-content-between");
  li.innerHTML = catalog.getContentManagement(name);    //the address of the content named "name"
  document.getElementById("myList").appendChild(li);
}


function appendToLi(child){
  var li = document.createElement("LI");
  li.setAttribute("class", "list-group-item justify-content-between");
  li.innerHTML = web3.toUtf8(child);
  document.getElementById("myList").appendChild(li);
  return li;
}


function getContent(button){
  var name = button.previousElementSibling.value.trim();
  if(!isAddressSelected()) return;
  contentManagement = contentManagementContract.at(catalog.getContentManagement(name));
  if(!enoughBalance(web3.fromWei(price,"finney")) | !isInCatalog(name)) return;
  var price = contentManagement.getPrice();
  try{
    var tx = catalog.getContent(name, {value: price});
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "", "Purchase Failed! <br> Only Standard users.", false);
  }catch(e){
    setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
    return
  }
}


function buyPremium(button){
  var value = button.previousElementSibling.value.trim();
  if(!isAddressSelected() | !enoughBalance(value) | !enoughValue(value, 40)) return;
  try{
    var tx = catalog.buyPremium({ value: web3.toWei(value, "finney")});
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "", "Purchase Failed! <br> Are you already Premium?", false);
  }catch(e){
    setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
    return;
  }
}

function getContentPremium(button){
  var name = button.previousElementSibling.value.trim();
  if(!isAddressSelected() | !isInCatalog(name)) return;
  try{
    var tx = catalog.getContentPremium(name);
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "", "Purchase Failed! <br> Are you a Premium user?", false);
  }catch(e){
    setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
    return;
  }
}

function giftContent(button){
  var name = button.previousElementSibling.value.trim();
  var address = button.previousElementSibling.previousElementSibling.value.trim();
  if(!isAddressSelected()) return;
  contentManagement = contentManagementContract.at(catalog.getContentManagement(name));
  if(!isValidAddress(address)| !enoughBalance(web3.fromWei(price,"finney")) | !isInCatalog(name)) return;
  var price = contentManagement.getPrice();
  try{
    var tx = catalog.giftContent(name, address,{ value: price });
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "Successfully Paid! <br>Content gifted to "+address, "Something went wrong.", true);
  }catch(e){
    setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
    return;
  }
}

function giftPremium(button){
  var value = button.previousElementSibling.value.trim();
  var address = button.previousElementSibling.previousElementSibling.value.trim();
  if(!isValidAddress(address) | !isAddressSelected() | !enoughBalance(value) | !enoughValue(value, 40)) return;
  try{
    var tx = catalog.giftPremium(address,{ value: web3.toWei(value, "finney") });
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "Successfully Paid! <br> Subscription gifted to "+address+"<br>", "Something went wrong. <br><strong>"+address+"</strong> is already Premium", true);
  }catch(e){
    setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
    return;
  }
}

function closeCatalog(){
  if(!isAddressSelected()) return;
  try{
    var tx = catalog.closeContract({ gas: 400000 });
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "Catalog Successfully closed", "ACCESS DENIED! <br> Only the owner can perform this action.", true);
  }catch(e){
    setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
  }
}
