window.onload = initial;
function initial(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        myObj = JSON.parse(this.responseText);
        var table = "<table border='1' id='menu-table'>";
        table += "<tr><th>Item</th><th>Price</th><th></th></tr>";
        for(row in myObj){
            table += "<tr id='" + myObj[row].menuID + "'><td>" + myObj[row].item + "</td><td>" + myObj[row].price + "</td><td><button id='editMenu" + myObj[row].menuID  + "'>Change Price</button></td><td><button id='removeMenu" + myObj[row].menuID + "'>Remove</button></td></tr>";
        }
        table += "</table>";
        
        document.getElementById("editableMenu").innerHTML = table;
        var buttonarr = Array();
        for(row in myObj){
            let id = document.getElementById("editMenu" + myObj[row].menuID);
            buttonarr.push(id);
        }
        buttonarr.forEach(function(button, index){
            button.addEventListener("click", function(){changePrice(button.id.substring(8))});
            
        })
        var buttonarr = Array();
        for(row in myObj){
            let id = document.getElementById("removeMenu" + myObj[row].menuID);
            buttonarr.push(id);
        }
        buttonarr.forEach(function(button, index){
            button.addEventListener("click", function(){removeFromMenu(button.id.substring(10))});            
        })

    }  
    };

    xmlhttp.open("GET", "/selectMenu", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function changePrice(id){
    var newPrice = prompt("Enter new price: ");
    if(newPrice != null){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
               initial();
            }  
            };
        row = {menuID: id, price:newPrice};
        xmlhttp.open("PUT", "/updateItemInMenu/" + id + "/" + newPrice, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send();
    }
}

function removeFromMenu(id){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
           initial();
        }  
        };
    xmlhttp.open("POST", "/deleteItemInMenu/" + id, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function addItemToMenu(){
    var xmlhttp = new XMLHttpRequest();
    var params = "item=" + document.getElementById("newmenuitem").value + "&price=" + document.getElementById("newmenuitemprice").value;
    xmlhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
           initial();
        }  
        };
    xmlhttp.open("POST", "/insertMenu", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}   