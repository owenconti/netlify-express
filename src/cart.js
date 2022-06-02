const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken')
const sumHasLitre = (perprice,guestno,litre) => {
    let unitPrice = perprice;
    let expectedGuest = guestno;
    let perlitre = litre;
    let totalLitre = expectedGuest* perlitre 
    let totalPrice = (unitPrice*totalLitre)/perlitre

    return totalPrice
}
const handler = {}
 handler.sumTotal = (arr) => {
    const totalPrice = arr.reduce(
        (sum, currentState, index) => {
          if (currentState.added) {
            if(currentState.litre){

                let  litreSum = sumHasLitre(currentState.price,currentState.value,currentState.litre)
                 return sum + litreSum;
              }else{
                return sum + (currentState.price*currentState.value);
              } 
           
          }
          return sum;
        },
        0
      );
      return totalPrice
}
handler.validateCart = (products,cartItems) =>{
    let productsID = {};
 let cartID = {};
 let newCartArray = [];
 console.log(cartItems,'kk')
 for(let i=0; i<products.length; i++){
     productsID[products[i].id] = products[i]
 };

 for(let i=0; i<cartItems.length; i++){
    cartID[cartItems[i].id] = {value:cartItems[i].value,price:cartItems[i].price}
};

  for (let key in cartID){
     if(key in productsID){
         if(productsID[key].price ===cartID[key].price  ){
            productsID[key].added = true
            productsID[key].value = Number(cartID[key].value)
           
          newCartArray.push(productsID[key]);
         }
        
     }
  };
  return newCartArray
}
handler.validCart = (products,cartItems,selectedPercent,res) => {
 let productsID = {};
 let cartID = {};
 let newCartArray = [];
 console.log(cartItems,'kk')
 for(let i=0; i<products.length; i++){
     productsID[products[i].id] = products[i]
 };

 for(let i=0; i<cartItems.length; i++){
    cartID[cartItems[i].id] = {value:cartItems[i].value,price:cartItems[i].price}
};

  for (let key in cartID){
    if(key in productsID){
        if(productsID[key].price ===cartID[key].price  ){
           productsID[key].added = true
           productsID[key].value = Number(cartID[key].value)
          
         newCartArray.push(productsID[key]);
        }
       
    }
  };
 
  const totalPrice = handler.sumTotal(newCartArray);
   console.log(totalPrice)
  if(totalPrice){
      const validOption = [25,50,100];
     selectedPercent = validOption.includes(selectedPercent) ?selectedPercent:100
    const amountToPay = totalPrice *(selectedPercent/100)
    let token = jwt.sign({
        data: amountToPay
      }, process.env.Secret_Key, { expiresIn: 60 * 3 });
      
    res.status(200).json({'price':amountToPay,'token':token})
}else{
    res.status(400).json({'Message':totalPrice})
}
  

};

module.exports = handler