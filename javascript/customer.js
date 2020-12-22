var order = {};
var itemName = {};
var itemPrice = {};
var myObj;

function initial(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        myObj = JSON.parse(this.responseText);
        var table = "<table border='1' id='menu-table'>";
        table += "<tr><th>Item</th><th>Price</th><th></th><th></th></tr>";
        for(row in myObj){
            table += "<tr id='" + myObj[row].menuID + "'><td>" + myObj[row].item + "</td><td>" + myObj[row].price + "</td><td><button id='add" + myObj[row].menuID  + "'>Add</button></td><td><button id='remove" + myObj[row].menuID + "'>Remove</button></tr>";
        }
        table += "</table>";
        
        document.getElementById("menu").innerHTML = table;
        var buttonarr = Array();
        for(row in myObj){
            let id = document.getElementById("add" + myObj[row].menuID);
            buttonarr.push(id);
        }
        buttonarr.forEach(function(button, index){
            button.addEventListener("click", function(){addToOrder(button.id.substring(3))});
            
        })
        var buttonarr = Array();
        for(row in myObj){
            let id = document.getElementById("remove" + myObj[row].menuID);
            buttonarr.push(id);
        }
        buttonarr.forEach(function(button, index){
            button.addEventListener("click", function(){removeFromOrder(button.id.substring(6))});            
        })

    }  
    };

    xmlhttp.open("GET", "/selectMenu", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function showOrders(){
    var table = "<table border='1' id='order-table'>";
    table += "<tr><th>Item</th><th>Price</th><th>Quantity</th>";
    for(i in order){
        table += "<tr><td>" + itemName[i] + "</td><td>" + itemPrice[i] + "</td><td>" + order[i] + "</td>";
    }

    table += "<tr><td>SubTotal</td><td></td><td>" + calculateTotalPrice() + "</td>";
    table += "</table>";
    document.getElementById("selected").innerHTML = table;    

}

function addToOrder(itemID){
    if(!(itemID in order)){
        order[itemID] = 1;
        for(row in myObj){
            if(itemID == myObj[row].menuID){
                itemName[itemID] = myObj[row].item;
                itemPrice[itemID] = myObj[row].price;
            }
        }

    } else{
        order[itemID] += 1;
    }
    
    showOrders();
}

function removeFromOrder(itemID){
    if(itemID in order){
        order[itemID] -= 1;
        if(order[itemID] == 0){
            delete order[itemID];
            delete itemName[itemID];
            delete itemPrice[itemID];
        }
    }
    
    showOrders();
}
//submits oders to be stored in the in the orders table 
function submitOrder(){
    if(Object.keys(order).length == 0){
        alert("order cannot be empty!");
    }else{
        var totalPrice = calculateTotalPrice();
        var params = 'detail=' + JSON.stringify(order) + '&total=' + totalPrice + '&isCompleted=0';
        var http = new XMLHttpRequest();
        http.open('POST', '/insertOrders', true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200){
                var data = http.responseText;
                alert("Your order number is: " + data);
                document.getElementById("selected").innerHTML = "";
                order = {}
            }
        }
        http.send(params);
    }
}

function checkOrder(){
    var http = new XMLHttpRequest();
    var url = '/orders';

    http.open('GET', url, true);
    http.onreadystatechange = function(){
        document.open();
        document.write(this.responseText);
        document.close();
    }
    http.send();
}

function calculateTotalPrice(){
    var total = 0.0;
    for(row in myObj){
        if(myObj[row].menuID in order){
            total += myObj[row].price * order[myObj[row].menuID];
        }
    }
    
    return total;
}

window.onload = initial;