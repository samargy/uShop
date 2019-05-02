
// function validateCreateForm() {

// //Setting the input fields as variables
// let emailBox = document.getElementById("inputEmail");
// let reEmailBox = document.getElementById('inputReEmail');
// let passwordBox = document.getElementById('inputPassword');
// let rePasswordBox = document.getElementById('inputRePassword');

// //Setting the groups as variables
// let emailGroup = document.getElementById("emailGroup1")
// let reEmailGroup = document.getElementById("emailGroup2")
// let passwordGroup = document.getElementById("passwordGroup1")
// let rePasswordGroup = document.getElementById("passwordGroup2")


// //Getting the Values of the inputs
// let email = emailBox.value;
// let reEmail = reEmailBox.value;
// let password = passwordBox.value;
// let rePassword = rePasswordBox.value;
// let emailsMatch = true;
// let passwordsMatch = true;

// //Checking if emails match
// if(email !== reEmail) {
//     //Creating the <div> for both labels
//     let label1 = document.createElement("DIV");
//     let label2 = document.createElement("DIV");

//     //Creating the text to go in the label
//     let message1 = document.createTextNode("Please enter a matching email");
//     let message2 = document.createTextNode("Please enter a matching email");

//     //Combining the text and the actual div
//     label1.appendChild(message1);
//     label2.appendChild(message2);

//     //Adding the custom css class to the divs
//     label1.classList.add('customValidation')
//     label2.classList.add('customValidation')

//     //Putting the div underneath the input boxes
//     emailGroup.appendChild(label1);
//     reEmailGroup.appendChild(label2);

//     //Changing the inputbox color to red
//     emailBox.style.borderColor = '#FF0000'
//     reEmailBox.style.borderColor = '#FF0000'
//     emailsMatch = false;
//     return false;
// }
// //Doing the same but for password field.
// else if(password !== rePassword) {
//     //Preventing duplicate text to be added
//     if(!passwordsMatch) {
//         passwordBox.style.borderColor = '#FFFFFF';
//         reEmailBox.style.borderColor = '#FFFFFF';
//     }
//     let label1 = document.createElement("DIV");
//     let label2 = document.createElement("DIV");
//     let message1 = document.createTextNode("Please enter a matching password");
//     let message2 = document.createTextNode("Please enter a matching password");
//     label1.appendChild(message1);
//     label2.appendChild(message2);
//     label1.classList.add('customValidation')
//     label2.classList.add('customValidation')
//     passwordGroup.appendChild(label1);
//     rePasswordGroup.appendChild(label2);
//     passwordBox.style.borderColor='#FF0000'
//     rePasswordBox.style.borderColor='#FF0000'    
//     passwordsMatch = false;
//     return false;
// }
// //Returning true
// else {
//     return true;
// }

// }