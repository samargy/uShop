

/*

I am extremely sorry to anyone who has to read this code. It is an absolute attrocity, albiet it works

I've tried commenting it but its pretty hard to understand as, I sort of built it as I went.
Was also my first time playing around with fully editing html with javascript and learning about
parents and childs and .insertBefore and what not. 

Apologies,
Sincerly,
Samuel R Argy
*/



//List of options to loop through
const optionsArray = ["Baby and Nursery", "Beauty","Books, Stationary and Gifts","Clothing and accessories","Designer and Boutqiue","Discount and variety","Electronics and technology","Entertainment","Fresh food and groceries","Health and Fitness","Home","Luggage and travel accessories","Luxury and premium","Sporting goods","Toys and Hobbies"]


let addButton = document.getElementById('addButton');
let categoryCount = document.getElementById('categoryCount')

//Ammount of categories/row number
let rowNum = Number(categoryCount.value) + 2;

//If there is no more than 3 (because we start at two and then increase one each time)
if(rowNum < 5) {
addButton.style.cursor = 'pointer'
addButton.onclick = function() {
    
    
    createDropdown();
    //Only allowing 3 different categories
    if(rowNum == 4) {
        addButton.parentNode.removeChild(addButton)
    }
    //Fixup with bootstrap grid system
    if(rowNum == 3) {
        let reEnterPassword = document.getElementById("passwordGroup2")
        reEnterPassword.classList.remove('offset-md-4');
    }
    rowNum+=1;

    //a hidden value that the server can read when the form is posted
    categoryCount.value = Number(categoryCount.value) + 1;
}
}



function createDropdown() {

    //Getting the row to put the item in.
    let row = document.getElementById("row"+String(rowNum));
 
    //Getting row below
    let nextRow = document.getElementById("row"+(Number(rowNum)+1));


    //Getting the add button to move to a row below
    let divRemove = document.getElementById("addButton")

    //Insert the button above the next row
    nextRow.insertBefore(divRemove, document.getElementById('passwordGroup'+(rowNum-1)));

    
    //Making the div
    let containerDiv = document.createElement("div");

    //Making the label
    let label = document.createElement("label");
    let labelText = document.createTextNode("Shop Category "+String(Number(rowNum)-1));
    label.appendChild(labelText);
    label.htmlFor = "inputCategory" + String(Number(rowNum+1));
    containerDiv.appendChild(label);
    
    //Making the input box
    let selBox = document.createElement("select");
    selBox.id = "inputCategory" + String(Number(rowNum+1));
    for(i=0; i < optionsArray.length; i++) {
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(optionsArray[i]));
        option.value = optionsArray[i];
        selBox.appendChild(option)
    }


    //Applying styles to all the created elements
    containerDiv.classList.add('form-group')
    containerDiv.classList.add('col-lg-4')
    containerDiv.style.width = 85%
    selBox.classList.add('form-control')
    selBox.classList.add('short-box')
    selBox.style.width = "85%"
    selBox.name = "category" + String(Number(rowNum)-1);


    //Putting select box in the div
    containerDiv.appendChild(selBox);


    //Getting the element to put the div before
    let boxOnRight = document.getElementById('passwordGroup'+(rowNum-2));
    //Putting everything in the row
    row.insertBefore(containerDiv, boxOnRight)

}
