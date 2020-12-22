function modifyMenu(){
    var http = new XMLHttpRequest();
    var url = '/editMenu';

    http.open('GET', url, true);
    http.onreadystatechange = function(){
        document.open();
        document.write(this.responseText);
        document.close();
    }
    http.send();    
}

function displayOrders(){
    var http = new XMLHttpRequest();
    var url = '/orderDisplay';

    http.open('GET', url, true);
    http.onreadystatechange = function(){
        document.open();
        document.write(this.responseText);
        document.close();
    }
    http.send();
}