const sBefore = document.getElementById('sBefore')
const sAfter = document.getElementById('sAfter')
const stocked = document.getElementById('hiddenStocked')


$("#sAfter").change(function(){
    sAfter.value = 'on'
    sBefore.value = 'off'
    stocked.value = 'after'
})

$("#sBefore").change(function(){
    sBefore.value = 'on'
    sAfter.value = 'off'
    stocked.value = 'before'
})