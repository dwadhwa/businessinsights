/* Function used to fetch data and call appropriate js method*/
var _token
var gauge1

var fetchToken = function() {
  var clientId = 'Ay2Z4XGewvq7IWYsUzusV0RejU6U4L2z'
  var clientSecret = 'vjbFZVzxU5zPK54x'
  var accessTokenUri = 'https://api.yaas.io/hybris/oauth2/v1/token'
  var req = new XMLHttpRequest();
  if (!req) {
    throw 'Unable to create HTTP Request.';
  }
  var url = accessTokenUri
  var params = 'grant_type=client_credentials' + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&scope=hybris.order_read'
  req.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var _jsonObj = JSON.parse(this.responseText);
        _token = _jsonObj.access_token
        getOrders()
      } else {
        alert('There was a problem with the request');
      }
    }
  };
  req.open('POST', url, true);
  req.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
  req.send(params);
};

//Fetch data from the order datapoint
var getOrders = function() {
  var req = new XMLHttpRequest();
  if (!req) {
    throw 'Unable to create HTTP Request.';
  }
  var today = new Date();
  var month = today.getMonth() + 1
  var query = today.getFullYear() + '-' + month + '-' + today.getDate()
  var url = 'https://api.yaas.io/hybris/order/v1/businessinsights/salesorders?q=created:<' + query
  req.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var response = req.responseText;
        var pops = document.getElementById('pops');
        var dailysales = document.getElementById('sales');
        var _jsonObj = JSON.parse(response);
        var sales = 0
        var maxproduct = 0
        var maxproductname
        var maxproductimage
        var data = []
        var transactions = _jsonObj.length + 1
        var avgorderval
        var transDiv = document.getElementById('transactions');
        var avgDiv = document.getElementById('avg');
        
        for (i = 0; i < _jsonObj.length; i++) {
          sales = sales + parseInt(_jsonObj[i].totalPrice)

          for (j = 0; j < _jsonObj[i].entries.length; j++) {
          
            if(data[_jsonObj[i].entries[j].product.name] != null) {
              data[_jsonObj[i].entries[j].product.name] += _jsonObj[i].entries[j].amount
            } else {
              data[_jsonObj[i].entries[j].product.name] = _jsonObj[i].entries[j].amount
            }
            if (data[_jsonObj[i].entries[j].product.name] > maxproduct) {
                maxproductname = _jsonObj[i].entries[j].product.name
                maxproduct = data[_jsonObj[i].entries[j].product.name]
                maxproductimage = _jsonObj[i].entries[j].product.images[0].url
            }
          }
          pops.innerHTML = "<img width=70em src=" + maxproductimage + "\>" + "<p>" + maxproductname + " (" + maxproduct + " items)";
          dailysales.innerHTML = "<h4 style='color:green;'> Daily Sales $" + sales + "</h4>";
          transDiv.innerHTML = '<span class="label label-info" style="padding: 1em; margin: 4em; font-size: 1em;">' + transactions + "</span>"
        var target = sales / 6000 * 100
        gauge1.update(target)
        
        avgorderval = (sales / transactions).toFixed(2)
        
        avgDiv.innerHTML = '<span class="label label-info" style="padding: 1em; margin: 4em; font-size: 1em;">' 
        + '$ ' + avgorderval + "</span>"
        }

      } else {
        alert('There was a problem with the request');
      }
    }
  };
  req.open('GET', url, true);
  req.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
  req.setRequestHeader('Authorization', 'Bearer ' + _token)
  req.send();
};

window.onload = function () {
  if (_token == null)
    fetchToken();
  else 
    getOrders();
  gauge1 = loadLiquidFillGauge("fillgauge1", 0);

};