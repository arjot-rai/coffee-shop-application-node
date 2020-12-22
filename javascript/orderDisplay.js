var myObj;

function generateOrderTable(xmlhttp){
    myObj = JSON.parse(xmlhttp.responseText);
    var table = "<table border='1' id='order-table'>";
    table += "<tr><th>Order Number</th><th>Order Detail</th><th>Total Price</th><th></th></tr>";

    for(row in myObj){
        table += "<tr id='" + myObj[row].orderID + "'><td>" + myObj[row].orderID + "</td><td>" + myObj[row].orderDetail + "</td><td>" + myObj[row].totalPrice + "</td><td><button id='complete" + myObj[row].orderID  + "'>Complete</button></td></tr>";
    }
    table += "</table>";
    
    document.getElementById("updatedOrders").innerHTML = table;
    var buttonArr = Array();
    for(row in myObj){
        var id = document.getElementById("complete" + myObj[row].orderID);
        buttonArr.push(id);
    }
    buttonArr.forEach(function(button, index){
        button.addEventListener("click",  function(){orderCompleted(button.id.substring(8))});
    })
}

function initial(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        generateOrderTable(xmlhttp);
    }  
    };

    xmlhttp.open("GET", "/selectOrdersNotComplete", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function orderCompleted(rowID){
    // order to be removed from the table by simply calling the same path as above
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
       initial();
    }  
    };

    xmlhttp.open("PUT", "/updateOrdersCompleted/" + rowID, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
    
}

setTimeout(initial, 10000);
window.onload = initial;