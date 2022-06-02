const express = require("express");
const serverless = require("serverless-http");
const cors = require('cors');
const app = express();
const router = express.Router();
const dotenv = require('dotenv').config()
const paystack = require('paystack')(process.env.PAYSTACK_KEY)
const products = require('./products');
const handler = require('./cart')
const sendMessage = require('./send');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cors({origin:true}));
router.get("/", (req, res) => {

  res.json({
    hello: "hi!"
  });
});

router.post('/cart', async(req,res)=>{
  try{
    handler.validCart(products,req.body.cart,req.body.selectedPercent,res);
  }catch(err){
    res.status(404).json({'message':'An error occured'});
  }

})
router.post('/verify', async(req,res)=>{
console.log(req.body,'body')
  if( req.body.userObject && req.body.id && req.body.cart && req.body.cart.length>0 && req.body.selectedPercent && req.body.token){
    
    try {
     // var decoded = jwt.verify(req.body.token, process.env.Secret_key);
     // console.log(decoded)
      paystack.transaction.verify(req.body.id)
      .then(function(response, error) {
          console.log(response.status)
        if(response.status){
          const userObject = req.body.userObject;
          const transactionAmount = Number(response.data.amount)/100;
          const validArray = handler.validateCart(products,req.body.cart);
          if(validArray){
            console.log(validArray,'array')
            let validPrice = handler.sumTotal(validArray)
            console.log(validPrice,'price')
            const validOption = [25,50,100];
      let choosedPercent = validOption.includes(Number(req.body.selectedPercent)) ?Number(req.body.selectedPercent):100
      const amountToPay = validPrice *(choosedPercent/100)
      console.log(amountToPay,'pay',transactionAmount)
             if(amountToPay === transactionAmount){
                
               sendMessage(req.body.id,validArray,req.body.userObject,amountToPay,req.body.selectedPercent,validPrice,);
               res.status(200).json({'message':'Transaction was successful'})
             }else{
              res.status(404).json({'message':'An error occured'});
             }
          }else{
            res.status(404).json({'message':'An error occured'});
          }
          
          
        }else{
          res.status(404).json({'message':'An error occured'});
        }
        
      });
    } catch(err) {
      console.log(err)
      res.status(404).json({'message':'An error occured'});
    }
   
  }else{
    res.status(404).json({'message':'An error occured'});
  }
  
})


app.use(`/.netlify/functions/api`, router);
app.listen(3001,()=>{console.log(`App is running `)})

// module.exports = app;
// module.exports.handler = serverless(app);
