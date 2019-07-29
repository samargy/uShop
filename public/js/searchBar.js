var searchBar = document.getElementById('searchBar')

//If any button is released whilst clicking on the search bar
searchBar.addEventListener("keyup", function(event){
    //If enter button is preseed
    if(event.keyCode === 13){
        event.preventDefault();


       
        let userID  = document.getElementById('userID').innerHTML
        let searchParams = searchBar.value

            
        $.get("/" + userID + "/userHome?"+ searchParams , function(){
                window.location = "/" + userID + "/userHome?"+ searchParams

    })
}
})