
async function getToken() {
 
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Basic UUYwSHNkYXZZcjVZWjR6am1zb1d0REtsNUQ2ZDJhZjE6Nko0RzBKOWRxcDVNZ0h3bw==");
 
  var urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("scope", "https://api.equifax.ca/inquiry/1.0/sts");
 
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
 
  const response = await fetch("https://api.uat.equifax.ca/v2/oauth/token", requestOptions);
  const data = await response.json();
  var accessToken = data.access_token;
  //console.log(accessToken);
  
  // returned and stored Equifax access token in variable
 
  // get customer info from form 
  var fname = document.getElementById('fname').value;
  var lname = document.getElementById('lname').value;
  var dob = document.getElementById('dob').value;
  var civic = document.getElementById('civic').value;
  var street = document.getElementById('street').value;
  var city = document.getElementById('city').value;
  var province = document.getElementById('province').value;
  var postal = document.getElementById('postal').value;
  var full = fname.concat(lname, dob, civic, street, city, province, postal);
  var length = full.length + 957;

  // using submitted info generate xml code
  var xml = "EFX10000000801A01PKSS 00" + length + "          <?xml version=\"1.0\" encoding=\"UTF-8\"?><CNCustTransmitToEfx xmlns=\"http://www.equifax.ca/XMLSchemas/UAT\"><CNCustomerInfo><CustomerCode>O655</CustomerCode><CustomerInfo><CustomerNumber>999RE00115</CustomerNumber><SecurityCode>15</SecurityCode></CustomerInfo><CustomerId></CustomerId></CNCustomerInfo><CNRequests><CNConsumerRequests><CNConsumerRequest><Subjects><Subject subjectType=\"SUBJ\"><SubjectName><LastName>" + lname + "</LastName><FirstName>" + fname + "</FirstName></SubjectName><SocialInsuranceNumber></SocialInsuranceNumber><DateOfBirth>" + dob + "</DateOfBirth><Occupation></Occupation></Subject><Addresses><Address addressType=\"CURR\"><CivicNumber>" + civic + "</CivicNumber><StreetName>" + street + "</StreetName><City>" + city + "</City><Province code=\"" + province + "\"/><PostalCode>" + postal + "</PostalCode></Address></Addresses></Subjects><CustomerReferenceNumber></CustomerReferenceNumber><ECOAInquiryType>I</ECOAInquiryType><JointAccessIndicator>N</JointAccessIndicator></CNConsumerRequest></CNConsumerRequests></CNRequests></CNCustTransmitToEfx>";

  //console.log(xml);
  //window.alert(xml);

  var myHeaders1 = new Headers();
  myHeaders1.append("Authorization", "Bearer " + accessToken);
  myHeaders1.append("Content-Type", "application/x-www-form-urlencoded");
 
  var urlencoded1 = new URLSearchParams();
  urlencoded1.append("InputSegments", xml);
 
  var requestOptions1 = {
    method: 'POST',
    headers: myHeaders1,
    body: urlencoded1,
    redirect: 'follow'
  };

  
  //var cors = "https://cors-anywhere.herokuapp.com/";
  //var url = "https://calm-sierra-17359.herokuapp.com/https://api.uat.equifax.ca/inquiry/1.0/sts";
  
  //fetch(url, requestOptions1)
  //.then(response => response.text())
  
  const response1 = await fetch("https://api.uat.equifax.ca/inquiry/1.0/sts", requestOptions1);
  const data1 = await response1.text();
  //console.log(data1);
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(data1, "text/html");

  var scoreArray = doc.getElementsByTagName("Value");
  var score = (scoreArray[0].innerHTML.slice(2));
  window.alert("Your ERS credit score is " + score);
  
}


