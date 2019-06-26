
//Assigning all the html elements to variables
const retailMin = document.getElementById('retail_price_min')
const retailMax = document.getElementById('retail_price_max')

const buyMin = document.getElementById('buy_price_min')
const buyMax = document.getElementById('buy_price_max')

const stockMin = document.getElementById('stock_min')
const stockMax = document.getElementById('stock_max')

const minStockMin = document.getElementById('minStock_min')
const minStockMax = document.getElementById('minStock_max')


//Jquery listeners for the change of input on all the input boxes.
//All of these function are the same, just with different varaible names for the different
//input boxes


//The logic is that they compare if the min and maxs are actually min and max's,
//if they arent then it makes the max one above the current min


//The maxTyped variable, is because first we let the user have the min less than max
//when min is being entered and max is 0
//then afterwards we need to also check if they change the min again. 

$('#retail_price_min').change(function(){
    if(retailMax.value != 0){
        if(Number(retailMax.value) < Number(retailMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            retailMax.value = Number(retailMin.value) + 1;
        }
    }
});

$('#retail_price_max').change(function(){
        if(Number(retailMax.value) < Number(retailMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            retailMax.value = Number(retailMin.value) + 1;
        }
});

$('#buy_price_min').change(function(){
    if(buyMax.value != 0){
        if(Number(buyMax.value) < Number(buyMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            buyMax.value = Number(buyMin.value) + 1;
        }
    }
});

$('#buy_price_max').change(function(){
        if(Number(buyMax.value) < Number(buyMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            buyMax.value = Number(buyMin.value) + 1;
        }
});

$('#stock_min').change(function(){
    if(stockMax.value != 0){
        if(Number(stockMax.value) < Number(stockMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            stockMax.value = Number(stockMin.value) + 1;
        }
    }
});

$('#stock_max').change(function(){
        if(Number(stockMax.value) < Number(stockMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            stockMax.value = Number(stockMin.value) + 1;
        }
});

$('#minStock_min').change(function(){
    if(minStockMax.value != 0){
        if(Number(minStockMax.value) < Number(minStockMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            minStockMax.value = Number(minStockMin.value) + 1;
        }
    }
});

$('#minStock_max').change(function(){
        if(Number(minStockMax.value) < Number(minStockMin.value)){
            alert('Please keep the maximum value greater than or equal to the minimum value')
            minStockMax.value = Number(minStockMin.value) + 1;
        }
});

