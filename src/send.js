const dotenv = require('dotenv').config();
const qs = require('qs');
const axios = require('axios');
//const {sumTotal} = require('./cart'
 const sendMessage = (id,cartArray,userObject,paidAmount,selectedPercent,actualAmout) => {
    let  products  = [];
    cartArray.forEach(e=>{
      if(e){
        let guestno = `Number of Servings: ${e.value}`   
        products.push(e.name,guestno)
      }
    });
    const text  =`
 Hi, a purchase occured on the website
Name:${userObject.name}
Email:${userObject.email}
Phone Number : ${userObject.phone}
Event Date : ${userObject.eventDate}
Percentage paid:${selectedPercent}%
Amount Paid:${paidAmount}
Total food cost: ${actualAmout}
Amount remaining : ${actualAmout-paidAmount}
Type of Event:${userObject.event_type}
Time of Event: ${userObject.time}
Location of event: ${userObject.event_location}
Paystack Reference ID : ${id}
Products purchased:
${products.join('\n')}`

    var data = qs.stringify({
        'From': 'whatsapp:+14155238886',
        'Body': text,
        'To': 'whatsapp:+2349064037403' 
      });
    var config = {
        method: 'post',
        url: `https://api.twilio.com/2010-04-01/Accounts/${process.env.AccountSid }/Messages.json`,
        headers: { 
          'Authorization': 'Basic QUMyNDllZWVmMDcxYjkyMDFhYjg1MjU0MDBkZjU1ODZlNjpmNDkxMTFhYTdkNTJlMjM0MDY2ZDkxMThjMTFhZWYwMw==', 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };
      axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
}

module.exports = sendMessage;
// const t= {
//     "id": "T304348622115749",
//     "cart": [
//         {
//             "name": "JOLLOF RICE & FRIED RICE & PLANTAIN (DODO) WITH TWO PROTEIN",
//             "price": 3500,
//             "catergory": "NIGERIAN FOODS",
//             "id": "1g3tn21q804e85c4299488c",
//             "added": true,
//             "value": 10
//         }
//     ],
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjozNTAwMCwiaWF0IjoxNjU0MTM0OTc3LCJleHAiOjE2NTQxMzUxNTd9.DLzRCY-PirHh8MUq27v4kv64avpJW2bzI-p7da_fMM0",
//     "selectedPercent": "100",
//     "userObject": {
//         "name": "David",
//         "email": "ahuventures15@gmail.com",
//         "eventDate": "Friday, June 3, 2022",
//         "time": "08:49",
//         "phone": "0904424244522",
//         "event_type": "Family Enagagement"
//     }
// }
// sendMessage(t.cart,t.userObject,1000,20,2000)