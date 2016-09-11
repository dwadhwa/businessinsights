/* Function used to fetch data and call appropriate js method*/
var _token
 
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
        getSales()
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
var getSales = function() {
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
        var innerdiv = document.getElementById('responsediv');
        var _jsonObj = JSON.parse(response);
        var data = []
        for (i = 0; i < _jsonObj.length; i++) {
          for (j = 0; j < _jsonObj[i].entries.length; j++) {
          var item = {
          "Product":_jsonObj[i].entries[j].product.name, 
          "name": _jsonObj[i].entries[j].product.name,
          "Sales ($)": _jsonObj[i].entries[j].totalPrice
          }
          
          data.push(item)
          }
      
        }

  var visualization = d3plus.viz()
    .container("#viz")
    .data(data)
    .type("bar")
    .id("name")
    .x("Product")
    .y("Sales ($)")
    .draw()
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
  getSales();
};