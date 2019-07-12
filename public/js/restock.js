

//EDITING THE STOCK FUNCTION
$(".stockgroup")
        .find(".adder")
            .mousedown(function(){
                let stockVal = $(this).next().html() //Getting the stock value
                let increaseVal = Number(stockVal) + 1; //adding one to it
                $(this).next().html(increaseVal) //setting it
            })
            .css('cursor', 'pointer').css('color','red') //doing css here instead of in style sheets
        .end()
        .find(".minus")
            .mousedown(function(){
                let stockVal = $(this).prev().html() //Getting the stock value
                let increaseVal = Number(stockVal) - 1; //adding one to it
                $(this).prev().html(increaseVal) //setting it
            })
            .css('color', 'red').css('cursor', 'pointer')  //doing basic css here instead of style sheets

//SENDING THE POST REQUEST DATA TO THE SERVER FUNCTION
$("a[name*='CONFIRM']").css('cursor', 'pointer').click(function(){

    //GETS THE ID OFF OF THE NAME which contains before the 'id' and the keywork CONFIRM so we can find it with the previous find method
    let id = $(this).attr('name').split("M")[1] 

    //This bit of code iterates through all the 'Stock values' and then pushes
    //their values into an array. 
    //We then send this array to the server to read those values and update each item record
    //with the new stock value
    let stock_values_array = []
    $('.stockval').each(function(){
        stock_values_array.push($(this).html())
    })

    //Creating a JSON to be sent in the post, only contains the array as the data associated with 
    //the property stockVals
    let data = {}
    data.stockVals = stock_values_array

    $.post('/'+id+'/restockInvManual', data, function(){
        window.location = '/'+id+'/inventory'
    })

    

})




