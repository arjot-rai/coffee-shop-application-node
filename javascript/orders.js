function getOrderStatus(){
    http = new XMLHttpRequest();
    http.open('GET', '/getOrderStatus/' + document.getElementById("orderid").value, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200){
                var data = JSON.parse(http.responseText);
                console.log(data);
                if(data.length==1){
                    document.getElementById("displayOrderID").innerHTML = "Order number: " + document.getElementById("orderid").value;
                    var isCompleted = data[0].isCompleted == 0 ? "Not Completed" : "Completed"
                    document.getElementById("displayStatus").innerHTML = "Order Status: " + isCompleted;
                    document.getElementById("orderid").value = "";
                } else{
                    alert("No such order exist!");
                }

            }
        }
    http.send();
}

function deleteOrder(){
    http = new XMLHttpRequest();
    http.open('POST', '/deleteOrder/' + document.getElementById("orderid").value, true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.onreadystatechange = function(){
            if(http.readyState == 4 && http.status == 200){
                var data = http.responseText;

                if(data=="1"){
                    alert("Order cancelled!!");
                } else{
                    alert("Order cannot be cancelled!!")
                }
            }
        }
    http.send();   
}