//List of options to loop through
const optionsArray = ["Baby and Nursery", "Beauty","Books, Stationary and Gifts","Clothing and accessories","Designer and Boutqiue","Discount and variety","Electronics and technology","Entertainment","Fresh food and groceries","Health and Fitness","Home","Luggage and travel accessories","Luxury and premium","Sporting goods","Toys and Hobbies"]


let addButton = document.getElementById('addButton');
let categoryCount = document.getElementById('categoryCount')

//Ammount of categories/row number
let index = Number(categoryCount.value) + 2;


if(index < 5) {
addButton.style.cursor = 'pointer'
addButton.onclick = function() {
    
   
    createDropdown();
    //Only allowing 3 different categories
    if(index == 4) {
        addButton.parentNode.removeChild(addButton)
    }
    //Fixup with bootstrap grid system
    if(index == 3) {
        let reEnterPassword = document.getElementById("passwordGroup2")
        reEnterPassword.classList.remove('offset-md-4');
    }
    index+=1;

    //a hidden value that the server can read when the form is posted
    categoryCount.value = Number(categoryCount.value + 1);
}
}



function createDropdown() {

    //Getting the row to put the item in.
    let row = document.getElementById("row"+String(index));
 
    //Getting row below
    let nextRow = document.getElementById("row"+(Number(index)+1));


    //Getting the add button to move to a row below
    let divRemove = document.getElementById("addButton")
    console.log(document.getElementById('passwordGroup' + (index-2)))
    console.log(index)
    nextRow.insertBefore(divRemove, document.getElementById('passwordGroup'+(index-1)));

    
    //Making the div
    let containerDiv = document.createElement("div");

    //Making the label
    let label = document.createElement("label");
    let labelText = document.createTextNode("Shop Category "+String(Number(index)-1));
    label.appendChild(labelText);
    label.htmlFor = "inputCategory" + String(Number(index+1));
    containerDiv.appendChild(label);
    
    //Making the input box
    let selBox = document.createElement("select");
    selBox.id = "inputCategory" + String(Number(index+1));
    for(i=0; i < optionsArray.length; i++) {
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(optionsArray[i]));
        option.value = optionsArray[i];
        selBox.appendChild(option)
    }

    containerDiv.classList.add('form-group')
    containerDiv.classList.add('col-lg-4')
    containerDiv.style.width = 85%
    selBox.classList.add('form-control')
    selBox.classList.add('short-box')
    selBox.style.width = "85%"
    selBox.name = "category" + String(Number(index)-1);
    //Putting select box in the div
    containerDiv.appendChild(selBox);


    //Getting the element to put the div before
    let boxOnRight = document.getElementById('passwordGroup'+(index-2));
    //Putting everything in the row
    row.insertBefore(containerDiv, boxOnRight)

}
