
function validateForm() {
let email = document.getElementById('inputEmail').value;
let reEmail = document.getElementById('inputReEmail').value;

console.log('hello')
if(email !== reEmail) {
    alert("Your email doesn't match")
    return false;
}

}