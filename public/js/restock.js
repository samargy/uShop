


$(".stockgroup")
        .find(".adder")
            .mousedown(function(){
                let stockVal = $(this).next().html() //Getting the stock value
                console.log(stockVal)
                let increaseVal = Number(stockVal) + 1; //adding one to it
                $(this).next().html(increaseVal) //setting it
            })
            .css('cursor', 'pointer').css('color','red')
        .end()
        .find(".minus")
            .mousedown(function(){
                let stockVal = $(this).prev().html() //Getting the stock value
                console.log(stockVal)
                let increaseVal = Number(stockVal) - 1; //adding one to it
                $(this).prev().html(increaseVal) //setting it
            })
            .css('color', 'red').css('cursor', 'pointer')    


$("a[name*='CONFIRM']").css('cursor', 'pointer').click(function(){
    let id = $(this).attr('name').split("M")[1] //GETS THE ID OFF OF THE NAME which contains before the 'id' and the keywork CONFIRM so we can find it with the previous find method
    console.log(id)


    $.ajax({
        url: "/"+id+'/inventory/',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: [{test: 'why cant i see this on the server'}],
        success: function(){
            console.log('we did it')
        }
    })

})




