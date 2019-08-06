var searchBar = document.getElementById('searchBar')

//If any button is released whilst clicking on the search bar
searchBar.addEventListener("keyup", function(event){
    //If enter button is preseed
    if(event.keyCode === 13){
        event.preventDefault();


        //Getting the userID from a hidden htlm element
        let userID  = document.getElementById('userID').innerHTML
        let searchParams = searchBar.value

        //Performing an ajax get request, and sending the search terms as a query
        $.get("/" + userID + "/userHome?"+ searchParams , function(){
                //Sending the 
                window.location = "/" + userID + "/userHome?"+ searchParams

    })
}
})