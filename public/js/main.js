
let addButton = document.getElementById('addButton');
const optionsArray = ["Baby and Nursery", "Beauty","Books, Stationary and Gifts","Clothing and accessories","Designer and Boutqiue","Discount and variety","Electronics and technology","Entertainment","Fresh food and groceries","Health and Fitness","Home","Luggage and travel accessories","Luxury and premium","Sporting goods","Toys and Hobbies"]
let index = 3;

addButton.style.cursor = 'pointer'
addButton.onclick = function() {
    createDropdown();
    index++;
}


function createDropdown() {

    //Getting the row to put the item in.
    let row = document.getElementById("row3");

    //Making the div
    let containerDiv = document.createElement("div");

    //Making the label
    let label = document.createElement("label");
    let labelText = document.createTextNode("Shop Category");
    label.appendChild(labelText);
    label.htmlFor = "inputCategory" + String(index-1);
    containerDiv.appendChild(label);
    
    //Making the input box
    let selBox = document.createElement("select");
    selBox.id = "inputCategory" + String(index-1);
    for(i=0; i < optionsArray.length; i++) {
        let option = document.createElement('option');
        option.appendChild(document.createTextNode(optionsArray[i]));
        option.value = optionsArray[i];
        selBox.appendChild(option)
    }
    containerDiv.appendChild(selBox);

    //Putting everything in the row
    row.appendChild(containerDiv)

}
