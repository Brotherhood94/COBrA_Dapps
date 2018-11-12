
function searchByContentAddress(button){
  try{
    document.getElementById("addressInput").style.color = "white";
    var address = document.getElementById("addressInput").value.trim();
    contentManagement = contentManagementContract.at(address);
    this.updateFields();
  }catch(e){
    contentManagement = null;
    setUpModal("Invalid address!"," fa-exclamation-triangle ","modal-danger");
    document.getElementById("addressInput").style.color = "red";
    return;
  }
  $('html,body').animate({scrollTop: document.body.scrollHeight},"slow");
  contentManagement.feedbackActivation({fromBlock: "latest"}).watch(function(error, result){
      if(!error){
          $('#myModal').modal('hide');
          notify("Leave a FeedBack!", "What's your opinion about \""+web3.toUtf8(result.args.contentName)+"\"", "info");
      }
  });
}


function consumeContent(){
  if(nullContentAddress() | !isAddressSelected()){
    $('html,body').animate({scrollTop: 0},"slow");
    return;
  }
  try{
    var tx = contentManagement.consumeContent({gas: 700000});
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "", "Consume Failed! <br> Have you properly paid this content?", false);
  }catch(e){
      setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
      return;
  }
}


function sendFeedback(){
  var rate1 = document.getElementById("cat1").value;
  var rate2 = document.getElementById("cat2").value;
  var rate3 = document.getElementById("cat3").value;
  try{
    var tx = contentManagement.rateContent(rate1, rate2, rate3, {gas: 500000});
    setUpModal("Waiting a mined block to include your transaction... ", " fa-exclamation-triangle ","modal-info");
    awaitBlock(tx, 0, 100, "Thanks for your feedback!", "FeedBack Failed! <br> You have to Consume the Content First.", true);
    $('#modalFeedback').modal('hide');
  }catch(e){
    setUpModal("Something went wrong. <br>"+e," fa-exclamation-triangle ","modal-danger");
    return;
  }
}

function openFeedback(){
  if(nullContentAddress() | !isAddressSelected()) return;
  this.resetFeedback();
  $('#modalFeedback').modal('show');
}

function resetFeedback(){
  for(var i = 1; i <= 3; i++){
    document.getElementById("cat"+i).value = 50;
    document.getElementById("cat"+i+"Value").textContent = 50;
  }
}

function updateFields(){
  document.getElementById("ContentName").innerHTML = web3.toUtf8(contentManagement.getContentName());
  document.getElementById("Genre").innerHTML = web3.toUtf8(contentManagement.getGenre());
  document.getElementById("Author").innerHTML = contentManagement.getAuthor();
  document.getElementById("Price").innerHTML = contentManagement.getPrice();
  document.getElementById("Views").innerHTML = contentManagement.getViews();

  document.getElementById("Category1").style.width = contentManagement.getRate(0)+"%";
  document.getElementById("Category2").style.width  = contentManagement.getRate(1)+"%";
  document.getElementById("Category3").style.width  = contentManagement.getRate(2)+"%";
  document.getElementById("Overall").style.width = contentManagement.getRate(3)+"%";

  document.getElementById("Category1").textContent = contentManagement.getRate(0);
  document.getElementById("Category2").textContent = contentManagement.getRate(1);
  document.getElementById("Category3").textContent = contentManagement.getRate(2);
  document.getElementById("Overall").textContent = contentManagement.getRate(3);
}


function valueSlider(elem){
  var id = elem.id+"Value";
  document.getElementById(id).textContent = elem.value;
}
