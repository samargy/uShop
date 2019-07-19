$(".qtyGroup")
        .find(".adder")
            .mousedown(function(){
                let qty = $(this).prev().html() //Getting the qty of the item
                let increasedQTY = Number(qty) + 1; //adding one to it
                $(this).prev().html(increasedQTY) //setting it

                //Going out to the parent, then going one column across, into that element.
                //and get the value of the actual number, not the dollar sign
                let totalPrice = $(this).parent().next().children().next().html()
                //Figuring out itemPrice
                let itemPrice = Number(totalPrice)/qty
                //New price to be displayed should be the product of itemPrice and the qty+1
                let newTotal = Math.floor(((itemPrice * (Number(qty)+1))*100))/100

                //if the number isn't a decimal add .00 on the end of it
                let splitString = String(newTotal).split('')
                let hasDot = false
                    for(i=0; i < splitString.length; i++){
                        if(splitString[i] == '.'){
                            hasDot = true;
                        }
                    }
                    if(hasDot == false){
                        newTotal = String(newTotal) + '.00'
                    }

                //Then setting this
                $(this).parent().next().children().next().html(String(newTotal))

                updateSubtotal()

            })
            .css('cursor', 'pointer') //doing css here instead of in style sheets
        .end()
        .find(".minus")
            .mousedown(function(){
                let qty = $(this).next().html() //Getting the qty of the item

                //This If statement makes sure we cannot divide by zero thus resulting in runtime error
                if(qty >= 2){
                    let decreasedQTY = Number(qty) - 1; //adding one to it
                    $(this).next().html(decreasedQTY) //setting it
    
                    //The rest is same as above on the adder button
                    let totalPrice = $(this).parent().next().children().next().html()
                    let itemPrice = Number(totalPrice)/qty
                    let newTotal = Math.floor(((itemPrice * (Number(qty)-1))*100))/100

                    let splitString = String(newTotal).split('')
                    let hasDot = false
                    for(i=0; i < splitString.length; i++){
                        if(splitString[i] == '.'){
                            hasDot = true;
                        }
                    }
                    if(hasDot == false){
                        newTotal = String(newTotal) + '.00'
                    }

                    $(this).parent().next().children().next().html(String(newTotal))

                    updateSubtotal()
                }
                
            })
            .css('cursor', 'pointer')  //doing basic css here instead of style sheets


function updateSubtotal() {

    let pricesArray = []
    $(".priceVal").each(function(){
        pricesArray.push($(this).html())
    })

    let subtotal = 0
    
    for(i=0; i < pricesArray.length; i++){
        subtotal = subtotal + Number(pricesArray[i])
        subtotal = Math.floor(subtotal*100) /100
    }
    $("#subtotal").html(subtotal)
}