
/*
=============================
      START OF APP SETUP
=============================
*/

//Getting the dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const port = 3000 || process.env.PORT;
const moment = require('moment')

//Getting the models/schemas for Mongooose. 
const User = require('./models/userModel')
const Shop = require('./models/shopModel')
const Item = require('./models/itemModel')
const Transaction = require('./models/transactionModel')

//file Upload middleware
app.use(fileUpload())

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// allows parse application/json
app.use(bodyParser.json())

//connect to db (connects to either the heroku DB or the local)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uShop',{useNewUrlParser: true})
let db = mongoose.connection;

//check db connection 
db.once('open', function() {
    console.log('Connected to ' + db.name)
})

//check for db error
db.on('error', function(err) {
    console.log(err);
})


//Starting App on port 3000 or the dynamic port assigned by heroku (depends where the app is running)
app.listen(process.env.PORT || 3000, function() {
    console.log('Server started on port ' + port);
});

//Setting the public directory
app.use(express.static('public'));


//Setting up view engine (Pug)
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/*
=============================
       END OF APP SETUP
=============================
*/



/*
=============================
 START OF PRE-SIGN IN ROUTES
=============================
*/

//Rendering Home Page
app.get('/', function(req, res) {
    res.render('home');
});

//Rendering User Create Acc Page
app.get('/userCreateAcc/', function(req, res) {
    res.render('userCreateAcc')
});

//Rendering User Acc Page with errors
app.get('/userCreateAcc/noMatch/:field', function(req, res) {
    res.render('userCreateAcc', {
        field: req.params.field
    })
});

//Rendering Page if email already exists
app.get('/userCreateAcc/alreadyExist', function(req, res) {
    res.render('userCreateAcc', {
        exist: true
    })
});

//Rendering Shop Create Acc Page
app.get('/shopCreateAcc', function(req, res) {
    res.render('shopCreateAcc')
});


//Rendering the page when emails/password don't match
app.get('/shopCreateAcc/noMatch/:field', function(req, res) {
    res.render('shopCreateAcc', {
        field: req.params.field
    })
});

//Rendering the page when email or shop name already exist
app.get('/shopCreateAcc/alreadyExist/:resultType', function(req, res){
    res.render('shopCreateAcc', {
        resultType: req.params.resultType
    })
})

//Proccessing a Create User Acc Post Request
app.post('/userCreateAcc', function(req, res){
    createUserAccount(req, res)
});

//Proccessing a Create Shop Acc Post Request
app.post('/shopCreateAcc', function(req, res){
    createShopAccount(req, res)
});

//Rendering Signin Page
app.get('/signin', function(req, res) {
    res.render('signin', {
        err: false,
    })
});

//Rendering Signin Page with err
app.get('/signin/err', function(req, res) {
    res.render('signin',{
        err: true,
    })
});

//Sign in post route - submit/enter clicked
app.post('/signin', function(req, res) {
    signIn(req, res);
});


/*
=================================
    END OF PRE-SIGN IN ROUTES
=================================
*/



/*
=============================
    START OF SHOP ROUTES
=============================
*/

//Render the Shop Account page
app.get('/:id/shophome', async function(req, res) {
    shopHome(req, res);
});

//Receiving Shop Page changes - redirects to shopHomeErr or shopHomeUpdated
app.post('/:id/shopEditAcc', async function(req, res) {
    editShopAcc(req, res);
});

//Render the shop account page but with error messages
app.get('/:id/shopHome/:err/:code', async function(req, res) {
    shopHomeErr(req, res);
})

//Rendering the page with a popup for update confirmation
app.get('/:id/shopHome/updated', async function(req, res) {
    shopHomeUpdated(req, res);
})

//When the logout button is pressed, redirect to signin 
app.get('/logout', function(req, res) {
    res.redirect('/signin')
})

//Inventory route
app.get('/:id/inventory', async function(req, res) {
    inventory(req, res);
});

//Add Item route
app.get('/:id/addItem', async function(req, res) {
    renderAddItem(req, res);
})

//When a user creates the item, by pressing create on the create item page
app.post('/:id/addItem', async function(req, res) {
    addItemtoInv(req, res);
});

//Route for when the shop wants to view edit cats page
app.get('/:id/editCats', async function(req, res) {
    renderEditCats(req, res);
});

//Route for when an item cat is added
app.post('/:id/editCats', async function(req, res) {
    addItemCat(req, res);
});

//Route for when an item cat is deleted
app.get('/:id/editCats/deletecategory/:index', async function(req, res) {
    deleteItemCat(req, res);
})

//Route for when the shop wants to view the edit manufacturers page
app.get('/:id/editManus', async function(req, res) {
    renderEditManus(req, res);
});

//Route for when the shop wants to add a new manufacturer
app.post('/:id/editManus', async function(req, res){
    addItemManu(req, res);
});

//Route for when item manufacturer is   
app.get('/:id/editManus/deletemanufacturer/:index', async function(req, res) {
    deleteItemManu(req, res);
});

//Removing an item page
app.get('/:id/inventory/:pageType', async function(req, res) {
    renderRemoveItemPage(req, res);
});

//Delete an item route
app.get('/:itemId/removeItem', async function(req, res) {
    deleteItem(req, res);
});

//Edit an item route
app.get('/:id/editItem', async function(req, res) {
    renderEditItem(req, res);
});

//When an items details have been edited and the apply changes button is pressed
app.post('/:id/editItem', async function(req, res) {
    editItem(req, res);
});

//Render find items page
app.get('/:id/findItems', async function(req, res) {
    renderFindItems(req, res);
});

//Finding the items then returning result to user
app.post('/:id/findItems', async function(req, res) {
    findItems(req, res);
});


//Restocking route
app.get('/:id/restockItems/:mode', async function(req, res){
    restockItems(req, res);
});

//Recieving ajax data from client side jquery and saving it to db
app.post("/:id/restockInvManual", async function(req, res){
    restockManual(req, res);   
})


//Sales page route 
app.get('/:id/sales', async function(req, res){
    sales(req, res);
})

/*
=============================
    END OF SHOP ROUTES
=============================
*/



/*
=============================
    START OF USER ROUTES
=============================
*/

//render edit user profile route
app.get('/:id/userProfile', async function(req, res){
    renderUserProfile(req, res);
})

//route for when a user account is edited
app.post('/:id/editUserAcc', async function(req, res){
    editUser(req, res);
})

//User profile, validation route. So displaying the err messages.
app.get('/:id/userProfile/:err/:code', async function(req, res){
    renderUserProfileErr(req, res);
})

//Delete the account
app.get('/:id/deleteAcc', async function(req, res){
    deleteUser(req, res);
})

//user home route and also if there is a search bar request (from client side ajax)
app.get('/:id/userhome', async function(req, res){
    userHomeWithQuery(req, res);
})

//user home route for if there is a certain category needed after an option in sidebar is pressed
app.get('/:id/userhome/category/:category', async function(req, res){
    userHomeWithParams(req, res);
})

//Route for the display of a shop page. 
app.get('/:userID/shopPage/:shopID', async function(req, res){
    renderShopPage(req, res);
})

//When the user clicks on one of the sidebar options
//Each sidebar anchor tag, has both a searchType either 'cat' or 'manu' and then what the actual
//category or manufacturer was, e.g for 'cat' something like 'PCs' or 'Laptops'
app.get('/:userID/shopPage/:shopID/:searchType/:field', async function(req, res){
    shopSideBarOption(req, res);
})

//Added to cart route
app.get('/:userID/shopPage/:shopID/addedtoCart/:qty/:itemID', async function(req, res){
    renderAddedItemToCart(req, res);
})

//Adding an item to cart route
app.post('/:userID/addtoCart/:itemID/shop/:shopID', async function(req, res){
    addItemToCart(req, res);
})


//User cart route, the :code bit is for the back button and whether or not it is rendered
//as 'Back to Shops' which is default. Or if we just came from a shop then the back button is just
// 'Back' and takes the user back to the previous shop
// the 'code' parameter is either an id of a shop, or the keyword 'noBack'
app.get('/:userid/cart/:code', async function(req, res){
    renderCart(req, res); 
})

//Remove item from cart route.
app.get('/:id/removeItem/:itemIndex', async function(req, res){
    removeItemFromCart(req, res);
})

//Render Bookmarks route
app.get('/:id/bookmarks', async function(req,res){
    renderBookmarks(req, res);
})

//Adding a bookmark using a get route
app.get('/:id/bookmarks/addShop/:shopid', async function(req, res){
    addBookmark(req, res);
})

//Deleting the bookmark
app.get('/:id/deleteBookmark/:index', async function(req, res){
    deleteBookmark(req, res);
})

//The checkout route
app.post('/:id/checkout', async function(req, res){
    checkout(req, res);
});

/*
=============================
    END OF USER ROUTES
=============================
*/






/*
=============================
    GLOBAL USER FUNCTIONS
=============================
*/

//The create user function 
async function createUserAccount (req,res) {

    const data = req.body;
    //Searches if user with email already exists
    const userResult = await User.findOne({email: data.email})
    //Data validation
    if(data.email !== data.reEmail) {
        if(data.password !== data.rePassword) {
            //Tell user they need to have matching email and password
            return res.redirect('userCreateAcc/noMatch/email+password')
        }
    //Tell user they need to have matching email
    return res.redirect('userCreateAcc/noMatch/email')
    }
    //Tell the user they need to have matching password
    else if(data.password !== data.rePassword) {
        return res.redirect('userCreateAcc/noMatch/password')
    }
    //Tell the user the account already exits
    else if(userResult){
        return res.redirect('userCreateAcc/alreadyExist')
    }


    else {
    //Creating the User
    let user = new User();

    //Assigning each field from the form to the property in the newly created user object
    user.givenName = data.givenName;
    user.lastName = data.lastName;
    user.address = data.address;
    user.state = data.state;
    user.postcode = data.postcode;
    user.dob = data.dob;
    user.mobileNumber = data.mobileNumber;
    user.email = data.email;
    user.password = data.password;

    //Both cart and bookmarks do not come from the form, but are created here now
    user.cart = {
        subtotal: 0
    }
    user.bookmarks = [];

    //Adding user to db (an object id is generated by mongo)
    user.save(function(err) {
        if(err) {
            console.log(err)
        } else {
            //Log the user has been created and direct to sign in page
            console.log("User created ---> "+user.givenName+" "+user.lastName)
            res.redirect('/signin')
        }
        
    })
    }
}

//This function is called when either someone hits enter in the searchbar, or the default userHome page
//is requested
async function userHomeWithQuery(req, res) {

    const id = req.params.id;
    const user = await User.findById(id);

    //variable for search params
    let searchParams;

    //Search params is actually passed through as a query which is a url then "?" then the search text
    //To get the search params out of the object it is sent in we have to use the for in loop
    //This loop only does 1 loop, but from what I know is the only way of getting the name of 
    //the key as a variable
    for (var search in req.query) {
        searchParams = search;
    }

    //If there is parameters then find all shops with name matching a regex function
    //The regex function looks for all shops where the name contains somewhere in there name
    //the searchParams. if search params is 'dog', 'adaDOGsaddsa' would come true. 
    //The $options bit makes sure it isn't case sensitive
    let shops;
    if (searchParams) {
        shops = await Shop.find({ name: { $regex: "\w*" + searchParams, $options: 'i' } });
    }

    //If there isn't any searchParams then just return all shops
    else {
        shops = await Shop.find();
    }

    //This algorithm here puts the shops into rows with 4 in each row. So we can parse this to
    //the pug file and pug can loop through the grouped array easily, and then have a smaller
    //loop for each row. 
    let shopsGroupedArray = groupShops(shops);

    //Render the page
    res.render('userHome', {
        user: user,
        shopGroups: shopsGroupedArray
    });
}

//This function is called only when the user clicks on one of the options in the sidebar
//on the shops screen
async function userHomeWithParams(req, res) {
    
    const id = req.params.id;
    const user = await User.findById(id);

    //Getting all shops where the category matches the category sent in params
    const shops = await Shop.find({ categories: req.params.category });

    //This is exactly the same as explained above.
    let shopsGroupedArray = groupShops(shops);

    res.render('userHome', {
        user: user,
        shopGroups: shopsGroupedArray
    });
}

//Checking out the user function
//First gets all the qtys from a req.body sent from client side jquery then
//updates all those values in the cart
//Creates a transaction in the db
//then deducts the right ammount of stock from each item in the db
async function checkout(req, res) {
    
    const id = req.params.id;

    //qtys is an array, that is recieved from client side js that posts all the qtys
    const qtys = req.body['qtys[]'];

    //getting the user from the db
    const user = await User.findById(id);

    //making the cart = the users cart
    let cart = user.cart;

    //making an array for shopIDs
    let shopIDs = [];

    //Starting i at 0 so we can add to in inside the for in loop,
    //as well as use it to get the corresponding qty from the qtys array
    //we use it as an index since the for in loop doesn't have a built in counter
    let i = 0;

    for (var key in cart) {

        //Looping through the cart object excluding the subtotal field
        if (key != 'subtotal') {

            //This if statement here prevents the code from stripping a number
            //from the end of the number when there is only 1 item in the cart
            if (typeof qtys == 'string') {
                cart[key].qty = Number(qtys);
            }
            else {
                //if qtys isnt a string and is an array, then set the qty in the cart
                //to the qty that was posted, since the user could of changed the qty's between
                //when the cart was loaded and when the checkout button was pressed.
                cart[key].qty = Number(qtys[i]);
            }
            //Pushing the item's id on the shopIDs array for later
            shopIDs.push(cart[key].shopID);
            //incrementing i only if key != subtotal
            i++;
        }
    }

    //Now we create the transaction
    let transaction = new Transaction();

    //Set the userID of the transaction to the id in params
    transaction.userID = id;

    //Set the cart of the transaction to the cart
    transaction.cart = cart;

    //Shop IDs is an array because we can purchase differnt items from different shops in the same
    //checkout
    transaction.shopIDs = shopIDs;

    //Setting the Date of Checkout to todays date, this is useful because when we want to query
    //on the sales page by something like top sales of this week, we have the .doc for reference
    transaction.doc = Date(Date.now());

    //Making an empty user object
    let updatedUser = {};

    //Emptying the cart
    updatedUser.cart = {
        subtotal: 0
    };

    //Updating the User's cart so its now empty on the db
    await User.findByIdAndUpdate(id, updatedUser, { useFindAndModify: false });

    //Deducting the right ammount of stock for each item depending on how much was sold
    //Looping through all items in the transactions cart
    for (var key in transaction.cart) {

        //Skip the subtotal key
        if (key != 'subtotal') {

            //Getting qty of the item 
            let qty = transaction.cart[key].qty;

            //Getting the item object from the db
            let item = await Item.findById(key);

            //Subtracting the number of items sold from the current stock and setting that 
            //as the new updated stock
            let updatedItem = {
                stock: Number(item.stock) - Number(qty)
            };

            //Updating this in the db for each item - we can use key because the item's key in cart is it's id
            Item.findByIdAndUpdate(key, updatedItem);
        }
    }

    //Saving the transaction to the db
    transaction.save(function (err, transaction) {
        if (err) {
            console.log(err);
        }
        else {
            //Logging the transaction in console
            console.log("---------- TRANSACTION MADE ---------");
            console.log(transaction);
            //Upon completion redirect to the shops page
            return res.redirect("/" + id + "/userHome");
        }
    });
}

//Deletes the bookmark
async function deleteBookmark(req, res) {

    const id = req.params.id;
    const user = await User.findById(id);

    let updatedUser = {};

    //Makes the updated user have the bookmarks array from the user we just got form the db
    updatedUser.bookmarks = user.bookmarks;

    //Removes bookmark from the array
    updatedUser.bookmarks.splice(req.params.index, 1); 

    //Updating in the db then refreshing the page
    await User.findByIdAndUpdate(id, updatedUser, { useFindAndModify: false });
    return res.redirect('back');
}

//Adds a bookmark to the users bookmark object
async function addBookmark(req, res) {
    
    const id = req.params.id;

    //Getting the user object from the db
    const user = await User.findById(id);

    //Creating an empty user object
    let updatedUser = {};

    //Setting the .bookmarks property of the empty object to the bookmarks from the user in the db
    updatedUser.bookmarks = user.bookmarks;

    //getting the shop id from the params
    const shopID = req.params.shopid;

    //Searching for the shop in the db
    const shop = await Shop.findById(shopID);

    //adding this shop to the updater object's bookmarks 
    updatedUser.bookmarks.push(shop);

    //Updating this in the db
    await User.findByIdAndUpdate(id, updatedUser, { useFindAndModify: false });

    //Going back to the previous page (this looks like a refresh to the user)
    return res.redirect('back');
}

//Renders the bookmarks page
async function renderBookmarks(req, res) {
    
    const id = req.params.id;

    //getting the user from the db via the id
    const user = await User.findById(id);

    //Exact same grouping process for the pug file as we have done in the shopPage route, and 
    //the userHome route. 
    let shops = user.bookmarks;
    let shopsGroupedArray = groupShops(shops);

    //Render the page
    res.render('bookmarks', {
        user: user,
        shops: shopsGroupedArray
    });
}

//Removes an item from the users cart object
async function removeItemFromCart(req, res) {

    const id = req.params.id;
    const user = await User.findById(id);
    const cart = user.cart;

    //Creating an empty object for the user and setting the empty objects cart
    //to the user's current up to date cart
    let updatedUser = {};

    updatedUser.cart = user.cart;

    //Creating an array of itemIDs
    let itemsIDs = [];

    //Looping through the cart object
    for (var key in cart) {

        //As we loop through the cart we want to skip the 'subtotal' property as it is the only property
        //of the cart that isn't an item id
        if (key != 'subtotal') {

            //Pushing the item Id into an array. 
            itemsIDs.push(key);
        }
    }

    //Making the itemID (of the item to delete), this is from the itemID array at the index given
    //from the url, this index comes from Pug as it loops through generating the page it can 
    //assign each items delete button with the index of the item in the array.
    const itemID = itemsIDs[req.params.itemIndex];

    //Deleting the item from the updatedUser cart
    delete updatedUser.cart[itemID];

    //Now sending the cart to the update function with the item just having been deleted
    await User.findByIdAndUpdate(id, updatedUser, { useFindAndModify: false });

    //Going back to the cart - to the user this will just appear like a refresh
    return res.redirect('back');
}

//Renders the users cart page
async function renderCart(req, res) {
    
    const id = req.params.userid;

    //getting the current user object
    const oldUser = await User.findById(id);

    //creating empty array to be filled
    let items = [];

    //getting the cart object from the user object
    const oldCart = oldUser.cart;

    //pushing the items into an array, using a for each loop.
    //this loop excudles the key of the object we don't want - subtotal
    for (var key in oldCart) {
        if ((key != 'subtotal')) {
            items.push(oldCart[key]);
        }
    };

    //This recalculation of the subtotal makes sure that no bugs can occur.
    let subtotal = 0;
    for (i=0; i < items.length; i++) {
        subtotal = Number(subtotal) + (items[i].price * items[i].qty);
        subtotal = Number(subtotal).toFixed(2); //making it to 2dp
    }

    //creating empty object so we can update the document in our DB
    let updatedUser = {};

    //setting the cart property of the empty object to the same cart object from our old user
    updatedUser.cart = oldUser.cart;

    //set the subtotal value of the cart object to the subtotal we just calculated previously
    updatedUser.cart.subtotal = subtotal;

    //update the document in the DB, so we can retrieve an updated version of the document,
    //with the newly calculated subtotal, and pass that onto the Pug file
    await User.findByIdAndUpdate(id, updatedUser, { useFindAndModify: false });

    //retrieving the user and the cart
    const newUser = await User.findById(id);
    const cart = newUser.cart;

    //Use the for in loop to push only the items into an array
    //this is so the pug file can just iterate through the array and display the items in cart
    items = [];
    for (var key in cart) {
        if ((key != 'subtotal')) {
            items.push(cart[key]);
        }
    }

    //This if statement here renders the page differently depending on where the cart page was 
    //requested from. If the cart button is clicked from a shop page then it renders the cart page
    //with a back button going to the shops actual page.
    //In any other scenario the back button becomes a 'Back to Shops' button and takes the user
    //back to the userHome route
    // the 'code' parameter is either an id of a shop, or the keyword 'noBack'
    if (req.params.code != 'noBack') {
        res.render('userCart', {
            user: newUser,
            cart: cart,
            items: items,
            prevPage: '/' + id + '/shopPage/' + req.params.code
        });
    }
    else {
        res.render('userCart', {
            user: newUser,
            cart: cart,
            items: items,
            prevPage: '/' + id + '/userHome/',
            noBack: true
        });
    }
}

//Adds an item to the users cart object
async function addItemToCart(req, res) {

    const userID = req.params.userID;
    const shopID = req.params.shopID;
    const itemID = req.params.itemID;

    //Getting the user, shop, item from the db
    const user = await User.findById(userID);
    const item = await Item.findById(itemID);
    const shop = await Shop.findById(shopID);

    //Getting the itemQTY from the body sent through in the POST
    const itemQTY = Number(req.body.qty);

    //Creating an empty object to be filled and fed to the .updateOne function
    let updatedUser = {};

    //Making the cart of the empty object = the cart of the user stored in the db
    updatedUser.cart = user.cart;

    //Adding the correct ammount to the current subtotal.
    updatedUser.cart.subtotal = (user.cart.subtotal) + (item.retail_price * itemQTY);

    //Creating a cart item object to be added to the cart
    let cartItem = {
        name: item.name,
        price: item.retail_price,
        qty: itemQTY,
        img: item.img,
        shopName: shop.name,
        shopID: shopID,
        _id: item._id
    };

    //If the item clicked about to be added is already in the cart, then 
    //we just edit the .qty property of the cart item already in the cart
    if (updatedUser.cart[itemID]) {
        updatedUser.cart[itemID].qty = updatedUser.cart[itemID].qty + cartItem.qty;
    }

    //If the item isn't there already then we add the item object to the cart object
    //The id of the item is the item objects key. So say the object id is 1254543453
    //To access that item from the cart we go cart[1254543453]
    //In retrospect this should be an array of objects, not an object of objects. As it just makes
    //getting the ID of the item harder because it is stored as a key in the object itself 
    else {
        updatedUser.cart[itemID] = cartItem;
    }

    //updating the user with the updatedUser object
    await User.findByIdAndUpdate(userID, updatedUser);

    //Redirecting to the addedToCart route, sencding userID, shopID, itemQTY & itemID
    return res.redirect('/' + userID + '/shopPage/' + shopID + '/addedtoCart/' + itemQTY + '/' + itemID);
}

//Render the shop page, but with added item to cart modal
async function renderAddedItemToCart(req, res) {

    //Basically the same as a normal shop page, apart from the fact
    //that it sends the qty, and the item that was just added to the Pug file.
    //It also sends a varaible called addedtoCart set as true. This is so the Pug file can
    //know whether to render the added to cart modal or not

    //Exactly the same as the renderShopPage function apart from the fact it sends the
    //item added, qty and making the addedtoCart bool equal true
    const userID = req.params.userID;
    const shopID = req.params.shopID;
    const user = await User.findById(userID);
    const shop = await Shop.findById(shopID);
    const items = await Item.find({ shopId: shopID });
    const item = await Item.findById(req.params.itemID);
    const itemsGroupedArray = groupItems(items);

    //Rendering the page
    res.render('shopPage', {
        shop: shop,
        user: user,
        items: itemsGroupedArray,
        addedtoCart: true,
        itemAdded: item,
        qty: req.params.qty
    });
}

//Rendering the shop page but only with the item's meeting the specified criteria
async function shopSideBarOption(req, res) {

    //Making userID and shopID a variable and then also setting user and shop as results from
    //mongoose queries
    const userID = req.params.userID;
    const shopID = req.params.shopID;
    const user = await User.findById(userID);
    const shop = await Shop.findById(shopID);

    //Creating the array outside the if statements because otherwise res.render cannot access
    // itemsGroupedArray as it wouldn't be in its scope
    let itemsGroupedArray = [];

    //Depending on if the searchType is either looking for category or manufacturer
    //then peform a different mongo query using the corresponding field that was asked for
    if (req.params.searchType == 'cat') {
        const items = await Item.find({ shopId: shopID, category: req.params.field });
        itemsGroupedArray = groupItems(items);
    }  
    if (req.params.searchType == 'manu') {
        const items = await Item.find({ shopId: shopID, manufacturer: req.params.field });
        itemsGroupedArray = groupItems(items);
    }

    //Render the page
    res.render('shopPage', {
        shop: shop,
        user: user,
        items: itemsGroupedArray
    });
}

//Rendering the shop page
async function renderShopPage(req, res) {

    //We get userID and shopID from the url.
    //Because PUG has to render the nav bar with the user's data 
    //but the page has to display the content of the shop
    //so we need to load the user, shop and shop's items from the DB which is done below
    const userID = req.params.userID;
    const shopID = req.params.shopID;
    const user = await User.findById(userID);
    const shop = await Shop.findById(shopID);
    const items = await Item.find({ shopId: shopID });

    //Items grouped array, is the same thing as the shops groups array for the user home page
    const itemsGroupedArray = groupItems(items); //formats an array so pug can process it

    //Render with pug
    res.render('shopPage', {
        shop: shop,
        user: user,
        items: itemsGroupedArray
    });
}

async function deleteUser(req, res) {

    const id = req.params.id;

    //Deletes with the very simple .findByIdAndDelete() function
    User.findByIdAndDelete(id, function () {
        console.log('User id: ' + id + " has been deleted");
    });

    //Direct to the landing page
    res.redirect('/');
}

async function renderUserProfileErr(req, res) {

    const id = req.params.id;
    const user = await User.findById(id);

    //Err can be either 'noMatch' or 'alreadyExist'
    const err = req.params.err;

    //The following if statements determine sending varying
    //variables to the Pug file, which renders the page
    //differently depending on the errs recieved
    if (err == 'noMatch') {
        res.render('userProfile', {
            user: user,
            field: req.params.code,
            moment: require('moment')
        });
    }
    if (err == 'alreadyExist') {
        res.render('userProfile', {
            user: user,
            exist: true,
            moment: require('moment')
        });
    }
}

async function editUser(req, res){

    //Setting these as variables for easy access
    const id = req.params.id
    const data = req.body

     //Searching for User with same email and storing in variable, 
     //thats not its current id. The $ne paramater makes sure
     //it isn't also searching for the current shops name.
    const userEmailResult = await User.findOne({email: data.email, _id: { $ne: id}});

    //If email and re-email dont match
    if(data.email !== data.reEmail) {
        //password and re-password don't match THEN
        if(data.password !== data.rePassword) {
            //Tell user they need to have matching email and password
            return res.redirect('userProfile/noMatch/email+password')
        }
    //Tell user they need to have matching email
    return res.redirect('userProfile/noMatch/email')
    }
    else if(data.password !== data.rePassword) {
        //Tell the user they need to have matching password
        return res.redirect('userProfile/noMatch/password')
    }
    else if (userEmailResult) {
        //Tell the user a shop with that email already exists
        return res.redirect('userProfile/alreadyExist/email')
    }

    //If all validation succeeds - THEN
    else {

        //Create an empty user object to fill
        let updatedUser = {}

        //Data from the form is filled into the object
        updatedUser.givenName = data.givenName;
        updatedUser.lastName = data.lastName;
        updatedUser.address = data.address;
        updatedUser.state = data.state;
        updatedUser.postcode = data.postcode;
        updatedUser.dob = data.dob;
        updatedUser.email = data.email;
        updatedUser.mobileNumber = data.mobileNumber;

        //Update the user in the database.
        User.findByIdAndUpdate(id, updatedUser, async function(err) {
            if(err){
                console.log(err)
            }
            else{
                console.log('User updated -----> id: '+id)

                //On completion then refresh the page
                return res.redirect('/'+id+'/userProfile')
            }
        })
    }
}

//Loads the user and sends to pug.
async function renderUserProfile(req, res) {

    //Also sends the moment libary to the pug, so pug can use moment functions to format dates.
    const id = req.params.id;
    const user = await User.findById(id);

    res.render('userProfile', {
        user: user,
        moment: require('moment')
    });
}





/*
=========================
  GLOBAL SHOP FUNCTIONS
=========================
*/

//Creates the shop
async function createShopAccount(req, res){

    //making req.body a single variable - ease of use
    const data = req.body

    //Searching for Shop with same name and storing in variable
    const shopNameResult = await Shop.findOne({name: data.name});
    //Searching for Shop with same email and storing in variable
    const shopEmailResult = await Shop.findOne({email: data.email})
    //Searching for a User with same email and storing in a variable
    const userEmailResult = await Shop.findOne({email: data.email})

    
    //Data Validation
    if(data.email !== data.reEmail) {
        if(data.password !== data.rePassword) {
            //Tell user they need to have matching email and password
            return res.redirect('shopCreateAcc/noMatch/email+password')
        }
    //Tell user they need to have matching email
    return res.redirect('shopCreateAcc/noMatch/email')
    }
    else if(data.password !== data.rePassword) {
        //Tell the user they need to have matching password
        return res.redirect('shopCreateAcc/noMatch/password')
    }
    else if (shopNameResult) {
        //Tell the user a shop with that name already exists
        return res.redirect('shopCreateAcc/alreadyExist/name')
    }
    else if (shopEmailResult) {
        //Tell the user a shop with that email already exists
        return res.redirect('shopCreateAcc/alreadyExist/email')
    }
    else if (userEmailResult) {
        //Tell the user a shop with that email already exists
        return res.redirect('shopCreateAcc/alreadyExist/email')
    }

    //If all data validation succeeds then 
    else {

    //Creating the User
    let shop = new Shop();

    //Adding the categories to the categories array.
    switch(Number(data.categoryCount)){
        case 1:
            shop.categories.push(data.category1)
            break;
        case 2:
            shop.categories.push(data.category1)
            shop.categories.push(data.category2)
            break;
        case 3:
            shop.categories.push(data.category1)
            shop.categories.push(data.category2)
            shop.categories.push(data.category3)
            break;
    }

    //Adding the fields to the shop object
    shop.name = data.name;
    shop.email = data.email;
    shop.password = data.password;
    shop.sales = {
        items_sold: 0,
        orders: 0,
        revenue: 0,
        profit: 0,
        item_ranks: [],
    }
    shop.inventory = [];
    shop.img = 'placeholderimage-icon.png';
    shop.itemCategories = [];
    shop.manufacturers = [];
    shop.balance = 0;


    //Adding user to db (an object id is generated by mongo)
    shop.save(function(err) {
        if(err) {
            console.log(err)
            return;
        } else {
            //If there isn't an error, log a shop has been created and then direct to sign in
            console.log("Shop created ---> "+shop.name)
            res.redirect('/signin')
        }
        
    })
}
};

//Shop Home function Renders the Page
async function shopHome(req, res) {

    //Setting the id as a variable
    const id = req.params.id;

    //Searching for the shop and setting it as a variable
    const shops = await Shop.find();

    //Binary search function finds the shop
    const binaryShop = binarySearch(shops, id);

    //Sending the shop and the ammount of categories to pug
    res.render('shopHome', {
        shop: binaryShop,
        categoryCount: binaryShop.categories.length
    });
}

//Renders the shophome but with an err
async function shopHomeErr(req, res) {

    const id = req.params.id;

    //Searching for the shop and setting it as a variable
    const shop = await Shop.findById(id);

    //Setting err to the err sent in the url
    const err = req.params.err;
    
    //The following if statements determine sending varying
    //variables to the Pug file, which renders the page
    //differently depending on the errs recieved
    if (err == 'noMatch') {
        res.render('shopHome', {
            shop: shop,
            categoryCount: shop.categories.length,
            field: req.params.code
        });
    }
    if (err == 'alreadyExist') {
        res.render('shopHome', {
            shop: shop,
            categoryCount: shop.categories.length,
            resultType: req.params.code
        });
    }
}

//Renders the shophome but with an updated message
async function shopHomeUpdated(req, res) {
    const id = req.params.id;
    //Searching for the shop and setting it as a variable 
    const shop = await Shop.findById(id);

    //Setting updated to true, so PUG displays a updated modal
    res.render('shopHome', {
        shop: shop,
        categoryCount: shop.categories.length,
        updated: true
    });
}

//Edits a shop account
async function editShopAcc(req, res){

    //making req.body a single variable - ease of use
    const data = req.body

    //getting the shops id
    const shopId = req.params.id

    //getting the shop object
    const shop = await Shop.findOne({_id: shopId})

    //Searching for Shop with same name and storing in variable, 
    //thats not its current id. The $ne paramater makes sure
    //it isn't also searching for the current shops name.
    const shopNameResult = await Shop.findOne({name: data.name, _id: { $ne: shopId}});

    //Searching for Shop with same email and storing in variable.
    //Also applying the same $ne logic described above
    const shopEmailResult = await Shop.findOne({email: data.email, _id: { $ne: shopId}})

    //Start of Data Validation
    if(data.email !== data.reEmail) {
        if(data.password !== data.rePassword) {
            //Tell user they need to have matching email and password
            return res.redirect('shopHome/noMatch/email+password')
        }
    //Tell user they need to have matching email
    return res.redirect('shopHome/noMatch/email')
    }
    else if(data.password !== data.rePassword) {
        //Tell the user they need to have matching password
        return res.redirect('shopHome/noMatch/password')
    }
    else if (shopNameResult) {
        //Tell the user a shop with that name already exists
        return res.redirect('shopHome/alreadyExist/name')
    }
    else if (shopEmailResult) {
        //Tell the user a shop with that email already exists
        return res.redirect('shopHome/alreadyExist/email')
    }
    //end of data validation

    //IF ALL DATA VALIDATION SUCCEEDS 
    else {

        
        //creating a new object for fields that are to be updated
        let updatedShop = {};

        //setting the fields
        updatedShop.email = data.email
        updatedShop.password = data.password
        updatedShop.name = data.name
        updatedShop.categories = []
        
        
        //Adding the categories on depending on the how many categories there are
        switch(Number(data.categoryCount)){
            case 1:
                updatedShop.categories.push(data.category1)
                break;
            case 2:
                updatedShop.categories.push(data.category1)
                updatedShop.categories.push(data.category2)
                break;
            case 3:
                updatedShop.categories.push(data.category1)
                updatedShop.categories.push(data.category2)
                updatedShop.categories.push(data.category3)
                break;
        }
        
        //Making sure there is an image to be saved
        if(!((req.files) == null)){
            //Saving the image
            let shopImg = req.files.imageFile
            //getting the extension of it
            const ext = getFileExt(shopImg.mimetype);

            //Moving the file from the data sent file to the local storage
            shopImg.mv(path.join(__dirname,'public/photo-storage/'+ shop._id + 'logo' + '.' + ext), function(err){
                if(err) {
                    console.log(err)
                }
        })
        //Setting the img field in the db to be the filepath, this is so pug can just easily
        //have the src=shop.img in a html img tag
        updatedShop.img = shop._id + 'logo' + '.' + ext
    }

        //Making the query for the update function
        const updateQuery = {_id: shopId}

        //Updating it in the db.
        Shop.updateOne(updateQuery, updatedShop, async function(err) {
            if(err) {
                console.log(err)
            }
            else {
                console.log('Updated Shop --> id: '+shop._id)

                //return to shop home, with updated results
                return res.redirect('/'+shopId+'/shopHome'+'/updated')
            }
        })

    }
}

async function inventory(req, res) {
    const id = req.params.id;
    //Searching for the shop and setting it as a variable 
    const shop = await Shop.findById(id);
    //Getting the items
    const itemsFound = await Item.find({ shopId: id });
    res.render('inventory', {
        shop: shop,
        items: itemsFound
    });
}

async function renderAddItem(req, res) {
    const id = req.params.id;
    //Searching for the shop and setting it as a variable
    const shop = await Shop.findById(id);
    res.render('addItem', {
        shop: shop
    });
}

async function addItemtoInv(req, res) {
    
    const id = req.params.id;
    const data = req.body;

    //Making a new 'Item' object, this is generated from mongoose schema 
    let item = new Item();

    //Setting the shop id to the id sent through params
    item.shopId = id;

    //Setting all the variables to their corresponding components
    item.name = data.name;
    item.category = data.category;
    item.manufacturer = data.manufacturer;
    item.retail_price = data.retail_price;
    item.buy_price = data.buy_price;

    //Setting stock to the intial stock
    item.stock = data.initialStock;

    //Setting the intial stock date to today
    item.stock_date = Date(Date.now());

    //Assigning to whatever came through in the form
    item.minStock = data.minStock;
    item.eoq = data.eoq;
    item.desc = data.desc;

    //First checking a file was submitted
    if (!((req.files) == null)) {

        //Saving the image
        let itemImg = req.files.imageFile;

        //getting the extension of it - THIS IS A STRING MANIPULATION FUNCTION. LOCATED
        // AT THE BOTTOM OF THIS FILE.
        //Note: "itemImg.mimetype" is something like 'image/jpeg' , so the string manipulation
        // splits the two 
        const ext = getFileExt(itemImg.mimetype);

        //Moving the file to the photostorage folder
        //The .mv function is part of the file-upload dependecy and takes in, location
        //It is named as the items id and ending with itemImg + ext
        itemImg.mv(path.join(__dirname, 'public/photo-storage/' + item._id + 'itemImg' + '.' + ext), function (err) {
            if (err) {
                console.log(err);
            }
        });

        //Setting the file name as a field in the item object
        item.img = item._id + 'itemImg' + '.' + ext;
    }

    //Saving the item to the db
    item.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        else {

            //Log the user has been created and direct to sign in page
            console.log("Item created ---> " + item.name + " id:" + item._id);
            res.redirect('/' + id + '/inventory');
        }
    });
}

async function renderEditCats(req, res) {

    const id = req.params.id;

    //Searching for the shop and setting it as a variable 
    const shop = await Shop.findById(id);

    //Rendering the page
    res.render('addCats', {
        shop: shop,
    });
}

async function addItemCat(req, res) {

    const id = req.params.id;

    //making the query 
    const updateQuery = { _id: id };

    //getting the shop
    const shop = await Shop.findById(id);

    //Creating empty object to put into the mongoose updateOne function
    let updatedShop = {};

    //Setting the .itemCategories field to the shop.itemCategories, so we do not
    //overwrite what the shop already has as categories
    updatedShop.itemCategories = shop.itemCategories;

    //pushing the new category onto the array
    updatedShop.itemCategories.push(req.body.category);

    // .updateOne takes in a query "{_id: id}", and the object to update, then also has a 
    // callback function, on completion/error
    Shop.updateOne(updateQuery, updatedShop, async function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Updated Shop Categories--> catName: ' + req.body.category);
            //return to edit category page, with updated results
            return res.redirect('/' + id + '/editCats');
        }
    });
}

//Nearly identical to above function however, we are removing the item category hence we splice
async function deleteItemCat(req, res) {

    const id = req.params.id;
    const catIndex = req.params.index;
    const shop = await Shop.findById({ _id: id });
    const updateQuery = { _id: id };
    
    //Same process as above route
    updatedShop = {};
    updatedShop.itemCategories = shop.itemCategories;

    //Removing the manufacturer out of the array using splice, catIndex comes through
    //client side js
    updatedShop.itemCategories.splice(catIndex, 1);
    Shop.updateOne(updateQuery, updatedShop, async function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Removed Item Category from Shop');
            //return to edit manufacturers page, with updated results
            return res.redirect('/' + id + '/editCats');
        }
    });
}

async function renderEditManus(req, res) {
    
    const id = req.params.id;

    //Searching for the shop and setting it as a variable 
    const shop = await Shop.findById(id);
    
    res.render('addManus', {
        shop: shop,
    });
}

//same as addItemCat although for manufacturers
async function addItemManu(req, res) {

    const id = req.params.id;

    //making a query
    const updateQuery = { _id: id };

    //getting the shop
    const shop = await Shop.findById(id);

    //making an empty object
    updatedShop = {};

    //Setting the manufacturers array to the current array stored in mongo
    updatedShop.manufacturers = shop.manufacturers;

    //pushing the new manufacturer onto array
    updatedShop.manufacturers.push(req.body.manufacturer);
    
    //Updating the shop in the DB
    Shop.updateOne(updateQuery, updatedShop, async function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Updated Shop Manufacturers--> id: ' + id);
            //return to edit manufacturers page, with updated results
            return res.redirect('/' + id + '/editManus');
        }
    });
}

//as above although we delete
async function deleteItemManu(req, res) {

    const id = req.params.id;
    const manuIndex = req.params.index;
    const shop = await Shop.findById({ _id: id });
    const updateQuery = { _id: id };
    updatedShop = {};
    updatedShop.manufacturers = shop.manufacturers;

    //Removing the manufacturer out of the array
    updatedShop.manufacturers.splice(manuIndex, 1);
    
    //Updating the object with the manufacturers array now without the deleted
    //manufacturer
    Shop.updateOne(updateQuery, updatedShop, async function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Removed Manufacturer from Shop');
            //return to edit manufacturers page, with updated results
            return res.redirect('/' + id + '/editManus');
        }
    });
}

async function renderRemoveItemPage(req, res) {

    const id = req.params.id;

    //Searching for the shop and setting it as a variable 
    const shop = await Shop.findById(id);

    //Getting the items
    const itemsFound = await Item.find({ shopId: id });
    
    //Setting the page type from the params as a variable
    const pType = req.params.pageType;
    if (pType === 'removeItems') {
        res.render('inventory-removeItems', {
            shop: shop,
            items: itemsFound
        });
    }
}

async function deleteItem(req, res) {
    
    const itemId = req.params.itemId;

    //searching for the item and looking what shop its from, this is used to
    //load the page later. NOTE: the .shopId bit is because it returns the item id as well
    const shopId = await (await Item.findById({ _id: itemId }, 'shopId')).shopId;

    //Deleting the item
    Item.findByIdAndDelete({ _id: itemId }, async function (err) {
        if (err) {
            console.log(err);
        }
        else {
            //if successful load the remove items page, the code that follows is
            //in the renderRemoveItemPage function 
            res.redirect('/' + shopId + '/inventory/removeItems');
        }
    });
}

async function renderEditItem(req, res) {

    const itemId = req.params.id;

    //Getting the item with corresponding id
    const item = await Item.findById(itemId);

    //Getting the shop id from the item object
    const shopId = item.shopId;
    
    //Searching for the shop and setting it as a variable 
    const shop = await Shop.findById(shopId);
    res.render('editItem', {
        shop: shop,
        item: item
    });
}

async function editItem(req, res) {

    const itemId = req.params.id;

    //searches for an item with the id, and then returns the
    //shop id associated with it. 
    //For more info read this same procedure
    //in the get route for removing an item
    const shopId = await (await Item.findById({ _id: itemId }, 'shopId')).shopId;

    //making an empty item object to put all the fields in.
    let updatedItem = {};

    //setting all the data recieved to a simple variable called data
    const data = req.body;

    //setting the fields
    updatedItem.name = data.name;
    updatedItem.category = data.category;
    updatedItem.manufacturer = data.manufacturer;
    updatedItem.desc = data.desc;
    updatedItem.retail_price = data.retail_price;
    updatedItem.buy_price = data.buy_price;
    updatedItem.eoq = data.eoq;
    updatedItem.stock = data.stock;
    updatedItem.minStock = data.minStock;

    //updating the image (if there is one posted)
    if ((req.files) != null) {

        //Saving the image 
        //making the image a variable
        let itemImg = req.files.imageFile;

        //getting the extension of the image
        const ext = getFileExt(itemImg.mimetype);

        //saving it over the current image
        itemImg.mv(path.join(__dirname, 'public/photo-storage/' + itemId + 'itemImg.' + ext), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    
    //Updating the item in the database
    Item.updateOne({ _id: itemId }, updatedItem, async function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Updated Item ---> id: ' + itemId);
            //return to inventory page
            return res.redirect('/' + shopId + '/inventory');
        }
    });
}

async function renderFindItems(req, res) {

    const id = req.params.id;

    //finding the shop
    const shop = await Shop.findById(id);
    
    //rendering find item page
    res.render('findItem', {
        shop: shop
    });
}

async function findItems(req, res) {

    const id = req.params.id;

    //finding the shop
    const shop = await Shop.findById(id);

    //Getting the data from the form and making conditions for the
    //search function
    const data = req.body;

    //making an empty conditions object
    let conditions = {};

    //Date stocked condition
    //if the date field isn't empty, then set it as a date object
    if (!(data.stock_date == '')) {
        //Making a date object so we can compare in the search function
        conditions.stock_date = new Date(data.stock_date);
    }

    //Setting the stocked condition to either before or after,
    //depending on the field sent through from the client
    if (data.stocked == 'before') {
        conditions.stocked = 'before';
    }
    if (data.stocked == 'after') {
        conditions.stocked = 'after';
    }
    

    //Checking if the min and max are actually min and max for ALL the number fields.
    await minMaxValidation()


    //Return all items in the shops inventory as an Array
    // const itemsFound = await Item.find({shopId: id})
    const itemsFound = await findItems();



    //Figuring out how many items were found
    //so we can send the infomation to PUG
    //If the .find() doesn't return anything, then itemsFound is undefined.
    //So if itemsFound is undefined then we have 0 items, else we have the length of the array
    //worth of items
    let itemCount;
    if (itemsFound == undefined) {
        itemCount = 0;
    }
    else {
        itemCount = itemsFound.length;
    }
    res.render('foundItems', {
        shop: shop,
        items: itemsFound,
        itemCount: itemCount
    });


/*
        =========================
            INTERNAL FUNCTIONS
        =========================
 */


function findItems() {

    //Checking that all fields have been filled out -> this is a known feature
    if ((conditions.stocked == 'before') && (data.name != '') && (data.category != '') && (data.manufacturer != '') && (data.stock_date != '') && (conditions.retail_price_range != ['', '']) && (conditions.buy_price_range != ['', '']) && (conditions.stock_range != ['', '']) && (conditions.minStock_range != ['', '']) && (conditions.eoq_range != ['', ''])) {
        return Item.find({
            shopId: id,
            name: data.name,
            category: data.category,
            manufacturer: data.manufacturer,

            //Here we query for 'Less than or equal to the date query'd since we are asking
            //for before
            stock_date: { $lte: conditions.stock_date },

            // Here we query for both greater than or equal too AND less than and equal to
            // this is so we can have a range. 
            // retail_price_range[0] is the min and [1] is the max
            // We do the same for all the other ranges
            retail_price: {
            $gte: conditions.retail_price_range[0],
                $lte: conditions.retail_price_range[1]
            },
            buy_price: {
            $gte: conditions.buy_price_range[0],
                $lte: conditions.buy_price_range[1]
            },
            stock: {
            $gte: conditions.buy_price_range[0],
                $lte: conditions.buy_price_range[1]
            },
            minStock: {
            $gte: conditions.minStock_range[0],
                $lte: conditions.minStock_range[1]
            },
            eoq: {
            $gte: conditions.eoq_range[0],
                $lte: conditions.eoq_range[1]
            }
        });
    }
}

function minMaxValidation(){

//First checks if the min and max are actually min and max
if ((Number(data.retail_price_min) <= Number(data.retail_price_max))) {
    console.log('range has been set');
    //Setting the 'range' as an array when element 0 is the min and element 1 is the max
    conditions.retail_price_range = [data.retail_price_min, data.retail_price_max];
}
//Do the same as above
if (Number(data.buy_price_min) <= Number(data.buy_price_max)) {
    //Setting the 'range' as an array when element 0 is the min and element 1 is the max
    conditions.buy_price_range = [data.buy_price_min, data.buy_price_max];
}
//Do the same as above
if (Number(data.stock_min) <= Number(data.stock_max)) {
    //Setting the 'range' as an array when element 0 is the min and element 1 is the max
    conditions.stock_range = [data.stock_min, data.stock_max];
}
//Do the same as above
if (Number(data.minStock_min) <= Number(data.minStock_max)) {
    //Setting the 'range' as an array when element 0 is the min and element 1 is the max
    conditions.minStock_range = [data.minStock_min, data.minStock_max];
}
//Do the same as above
if (Number(data.eoq_min) <= Number(data.eoq_max)) {
    //Setting the 'range' as an array when element 0 is the min and element 1 is the max
    conditions.eoq_range = [data.eoq_min, data.eoq_max];
}
}
}


async function restockItems(req, res) {

    const id = req.params.id;
    const shop = await Shop.findById(id);

    //Mode is either 'option', 'all' or 'auto'
    const mode = req.params.mode;

    //Looks at what mode the page requested then performs said operations for the mode
    //RESTOCK OPTIONAL MODE
    if (mode == 'option') {
        const items = await Item.find({ shopId: id });
        res.render('inventory-restockItems', {
            shop: shop,
            items: items,
            mode: 'manual'
        });
    }

    //Restock All
    if (mode == 'all') {
        restockAll();
    }

    //Autostock All
    if (mode == 'auto') {
        restockAuto();
    }


/*
=========================
    INTERNAL FUNCTIONS
=========================
*/

    async function restockAll() {

        //Making a variable items = all items with the same shopID from the params
        const items = await Item.find({ shopId: id });

        //Looping through the array of items, restocking each one
        for (i = 0; i < items.length; i++) {

            //Making variables for the eoq and stock to peform calculations
            let eoq = items[i].eoq;
            let stock = items[i].stock;

            //Creating an empty object to send to the .updateOne() function
            let updatedItem = {};

            //Setting the stock to its current stock, plus what its eoq was
            updatedItem.stock = stock + eoq;

            //Setting the date to now.
            updatedItem.stock_date = Date(Date.now());
            console.log(Date(Date.now()))

            //Updating the item in the database. Once again .updateOne takes in an id, an object
            //and a callback
            Item.updateOne({ _id: items[i]._id }, updatedItem, function (err) {
                //Log the error if there is one
                if (err) {
                    console.log(err);
                }
            });
        }
        //Assign a new variable to an updated version of the items so we send the updated
        //version to the PUG not the old version before they were restocked
        const updatedItems = await Item.find({ shopId: id });
        //Render the page. Also telling it what the mode is aswell
        res.render('inventory-restockItems', {
            shop: shop,
            items: updatedItems,
            mode: 'all'
        });
    }
    async function restockAuto() {
        const items = await Item.find({ shopId: id });
        //DOING THE EXACT SAME AS ABOVE MODE (restock all) 
        //However, in this case we only stock the item if it is below its associated min stock
        for (i = 0; i < items.length; i++) {
            let eoq = items[i].eoq;
            let stock = items[i].stock;
            let minStock = items[i].minStock;
            //Only stocking the item if it is below the minimum stock
            if (stock <= minStock) {
                let updatedItem = {};
                updatedItem.stock = stock + eoq;
                //Setting the date to now.
                updatedItem.stock_date = Date(Date.now());
                Item.updateOne({ _id: items[i]._id }, updatedItem, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
        //Retrieving items again because we just edited their stock values
        const updatedItems = await Item.find({ shopId: id });
        res.render('inventory-restockItems', {
            shop: shop,
            items: updatedItems,
            mode: 'auto'
        });
    }
}


async function restockManual(req, res) {

    //Really weird formating from body-parser or maybe ajax. Just gotta do it this way
    //as the object comes through like this:
    /*
                        {"stockVals[]": [32, 88, 77, 99]}
    */
    
    let stockVals;
    stockVals = req.body['stockVals[]']

    //getting id from params
    const id = req.params.id;

    //Getting the items from the db
    const items = await Item.find({ shopId: id });

    //Putting all the item id's in an array so we can update their stocks
    let itemIDs = [];
    for (i = 0; i < items.length; i++) {
        itemIDs.push(items[i]._id);
    }
    for (i = 0; i < itemIDs.length; i++) {

        //Creating empty updateObj to be parsed into update function
        let updateObj = {};

        //This if is for when there is only one item in the inventory,
        //the post to the server doesn't recieve the stockvals as an array.
        //rather just a single string, so if we went stockVals[0][i], it would only save
        //the first character of the string. So we have to check for this with the typeof operator
        if (typeof stockVals == 'string') {
            updateObj.stock = stockVals;
            
            //If the item's stock was changed then update last stocked to today's date
            const item = await Item.findById(itemIDs[i])
            if(item.stock != stockVals){
                updateObj.stock_date = Date(Date.now())
            }
        }

        //Letting the stock of the update Object = the value at the index in stockVals array
        //index is i
        else {
            updateObj.stock = stockVals[i];

            //If the item's stock was changed then update last stocked to today's date
            const item = await Item.findById(itemIDs[i])
            if(item.stock != stockVals[i]){
                updateObj.stock_date = Date(Date.now())
            }
        }

        //Updating the item in the database, using the id from the itemIDs array, because the id we are
        //up to in the array corresponds to the stockval we were at in stockvals array
        //Note: useFindAndModify is on all update functions. This means that the app just uses
        //a newer version of the findByIdAndUpdate function
        await Item.findByIdAndUpdate(itemIDs[i], updateObj, { useFindAndModify: false });
    }

    //for some unknown reason, this redirect needs to be here, as well as on the client side code
    res.redirect('/' + id + '/inventory');
}

async function sales(req, res) {

    const id = req.params.id;
    const shop = await Shop.findById(id);

    //Instantiating transactions out here so we can use it in other parts of the route
    let transactions;

    //Gets all transactions for the shop within a timeframe
    await getTransactions();

    //Instantiating some variables outside the findItemsSold function 
    //by other parts of the route
    let itemsSold = [];
    let revenue = 0;
    let ordersMade = 0;
    let totalBuyPrice = 0;

    //Searches through transactions linked to the shop and pushes any item object 
    //made in those transactions onto the array itemsSold
    await findItemsSold();

    //Searching for all items where their shopId is equal to the id of the shop
    const items = await Item.find({ shopId: id });

    //Making a rankings array so we can determine best sellers
    let rankings = [];

    //Calculating how many times each item in the shops inventory has appeared in the transactions
    await calculateAppearCounts();

    //Sorting the rankings array so the top ranked items appear at the start
    await selectionSort();

    //Calculating products sold
    let productsSold = 0;
    for (i = 0; i < rankings.length; i++) {
        //Adding the ammount of items to products sold (rankings[i][1] is a qty, we don't care what item it is, just want to know the qty sold)
        productsSold = productsSold + rankings[i][1];
    }
    renderSales();
    //end of route



    /*
    ==================================
            INTERNAL FUNCTIONS
    ==================================
    */


    async function getTransactions() {

        //Letting timeframe
        let timeFrame;
        
        //This is to extract the phrase 'All Time' or 'This Week' from the query object
        //As the phrase is stored as a key name.
        //Even though it is a loop, it only loops once.
        for (var key in req.query) {
            timeFrame = key;
        }
        console.log(timeFrame)
        //This is a switch statement that changes what it does depending on 'timeFrame'
        switch (timeFrame) {
            case 'This Week':
                {
                    //Using moment to assign a variable as an ISO date a week ago
                    let aWeekAgo = moment(Date.now()).subtract(7, 'd');
                    //Using the aWeekAgo variable just made, we can now query for all transactions
                    //where their doc field is greater than or equal to a week ago
                    transactions = await Transaction.find({ doc: { $gte: aWeekAgo } });
                }
                break;
            case 'This Month':
                {
                    //Using moment to assign a variable as an ISO date a month ago
                    let aMonthAgo = moment(Date.now()).subtract(1, 'M');
                    //Using the aMonthAgo variable just made, we can now query for all transactions
                    //where their doc field is greater than or equal to a month ago
                    transactions = await Transaction.find({ doc: { $gte: aMonthAgo } });
                }
                break;
            case 'This Year':
                {
                    //Using moment to assign a variable as a ISO date a year ago
                    let aYearAgo = moment(Date.now()).subtract(1, 'y');
                    //Using the aYearAgo variable just made, we can now query for all transactions
                    //where their doc field is greater than or equal to a year ago
                    transactions = await Transaction.find({ doc: { $gte: aYearAgo } });
                }
                break;
            //This case runs if no query's are present - equivilant to 'All time' 
            default:
                {
                    //Just returns all transactions in the db
                    transactions = await Transaction.find();
                        
                }
                break;
        }   
    }

    async function findItemsSold() {
        
        //Linear Search through all transactions - this is my linear search function.
        //Has a few nested linear searches if that gets me bonus points. 
        for (i = 0; i < transactions.length; i++) {
            //Looping through the 3 element array of shopIDs
            for (j = 0; j < transactions[i].shopIDs.length; j++) {
                /*
                //if the transaction object .shopIDs property (which is an array)
                contains the id of the shop, then do the following
                */
                if (transactions[i].shopIDs[j] === id) {
                    //loops through the .cart object of the transaction
                    for (var key in transactions[i].cart) {
                        //if the item has a matching shop id
                        if (transactions[i].cart[key].shopID === id) {
                            //adding that item sold to the array
                            itemsSold.push(transactions[i].cart[key]);
                            //Adding the price of the item to revenue
                            revenue = revenue + (transactions[i].cart[key].price * transactions[i].cart[key].qty);
                            //Accessing the db so we can get the buy price of the item
                            const item = await Item.findById(key);
                            //Adding the buy price to the total buy price
                            totalBuyPrice = totalBuyPrice + (item.buy_price * transactions[i].cart[key].qty);
                        }
                    }
                    //Incrementing the orders made
                    ordersMade++;
                    /*breaking out of the loop to avoid running the process mutiple times, if the
                    shopIDs array contained the same ID twice, which would cause the loop to run twice.
                    */
                    break;
                }
            }
        }
    }

    async function calculateAppearCounts() {

        //Looping through the shops inventory
        for (i = 0; i < items.length; i++) {

            //Resetting appearCount after each secondary loop has run. Also is set at 0 on first time
            let appearCount = 0;

            //Looping through the itemsSold array, which was constructed from the linear search above
            for (x = 0; x < itemsSold.length; x++) {

                //If the item we are looking for appears in the items sold array
                //then add one to how many times we see it appear.
                //Doing the let id1 and id2 makes sure both of them are both a String, as for some reason String() wasn't doing the job
                let id1 = "" + itemsSold[x]._id;
                let id2 = "" + items[i]._id;
                if (id1 == id2) {
                    appearCount = appearCount + itemsSold[x].qty;
                }
            }
            //Creates an array that looks like this ['items id', appearCount]
            let rankItem = [items[i]._id, appearCount, items[i].name];
            //pushes rank item onto the rankings array
            rankings.push(rankItem);
        }
    }

    async function selectionSort() {
        //Making length a variable for easy access
        let n = rankings.length;
        //Moving the boundary of the unsorted array
        for (i = 0; i < n; i++) {
            //Setting the current index of the max value to i.
            let maxIndex = i;
            //Find the greatest element in the unsorted array
            for (j = i + 1; j < n; j++) {
                //If the current element is greater than the max element then set the current element
                //as the new max
                if (rankings[j][1] > rankings[maxIndex][1]) {
                    maxIndex = j;
                }
            }
            //Swap current index with greatest element
            let temp = rankings[i];
            rankings[i] = rankings[maxIndex];
            rankings[maxIndex] = temp;
        }
    }
    async function renderSales() {
        /*
         THIS SWITCH STATEMENT IS SO IF THE SHOP HASN'T SOLD MORE THAN 2 DIFFERENT ITEMS,
         THEN THE PAGE OBVIOUSLY CANT RENDER 3 TOP ITEMS, so it has to render it accordingly.
         In all cases, you make an item object for each of the top 3 items, which gets
         sent to the PUG file along with all the other data the pug file needs.
        */
        switch (rankings.length) {
            //IF THE SHOP HASN'T SOLD A SINGLE ITEM 
            case 0:
                {
                    res.render('sales', {
                        shop: shop,
                        ordersMade: ordersMade,
                        revenue: revenue.toFixed(2),
                        profit: ((revenue - totalBuyPrice).toFixed(2)),
                        productsSold: productsSold
                    });
                }
                break;
            //IF THE SHOP HAS SOLD 1 ITEM
            case 1:
                //note the use of brackets with each case, this is because when 'letting' inside 
                //each case they actually conflict with each other without the brackets
                {
                    //Making firstBestSeller equal the first element in the rankings array
                    //due to the fact that it has just been sorted. 
                    let firstBestSeller = await Item.findById(rankings[0][0]);
                    res.render('sales', {
                        //Sending in a bunch of data to the pug file
                        shop: shop,
                        ordersMade: ordersMade,
                        revenue: revenue.toFixed(2),
                        profit: ((revenue - totalBuyPrice).toFixed(2)),
                        productsSold: productsSold,
                        firstBestSeller: firstBestSeller,
                        firstBestSellerCount: rankings[0][1],
                        NumTopItems: 1
                    });
                }
                break;
            //IF THE SHOP HAS SOLD 2 ITEMS
            case 2:
                //exact same as above just with a secondBestSeller now
                //also the same principle applies, becuase we have sorted rankings array
                //the second element in it will be the second best seller
                {
                    let firstBestSeller = await Item.findById(rankings[0][0]);
                    let secondBestSeller = await Item.findById(rankings[1][0]);
                    res.render('sales', {
                        shop: shop,
                        ordersMade: ordersMade,
                        revenue: revenue.toFixed(2),
                        profit: ((revenue - totalBuyPrice).toFixed(2)),
                        productsSold: productsSold,
                        firstBestSeller: firstBestSeller,
                        firstBestSellerCount: rankings[0][1],
                        secondBestSeller: secondBestSeller,
                        secondBestSellerCount: rankings[1][1],
                        NumTopItems: 2
                    });
                }
                break;
            //IF THE SHOP HAS SOLD 3 OR MORE ITEMS
            default:
                {
                    //exact same as above just with a third seller now
                    let firstBestSeller = await Item.findById(rankings[0][0]);
                    let secondBestSeller = await Item.findById(rankings[1][0]);
                    let thirdBestSeller = await Item.findById(rankings[2][0]);
                    res.render('sales', {
                        shop: shop,
                        ordersMade: ordersMade,
                        revenue: revenue.toFixed(2),
                        profit: ((revenue - totalBuyPrice).toFixed(2)),
                        productsSold: productsSold,
                        firstBestSeller: firstBestSeller,
                        firstBestSellerCount: rankings[0][1],
                        secondBestSeller: secondBestSeller,
                        secondBestSellerCount: rankings[1][1],
                        thirdBestSeller: thirdBestSeller,
                        thirdBestSellerCount: rankings[2][1],
                        NumTopItems: '3 or more'
                    });
                }
                break;
        }
    }
}


/*
=========================
    OTHER FUNCTIONS
=========================
*/

//sign in function
async function signIn(req, res){
    //Assigning a variable to data so I dont have to type req.body each time
    const data = req.body

    //Searches the shop db and the user db for a matching email + password
    const userResult = await User.findOne({ email: data.email, password: data.password }, '_id email password');
    const shopResult = await Shop.findOne({ email: data.email, password: data.password }, '_id email password');


    //If both dbs return nothing, then err
    if(!userResult && !shopResult) {
        return res.redirect('/signin/err');
      }
    
    //If db returns a user, send to user page
    if(userResult) {
        return res.redirect('/'+userResult._id + '/userhome')
      }
    
    //If db returns a shop, send to shop page
    if(shopResult) {
        return res.redirect('/'+shopResult._id + '/shophome')
      }

}

//THIS IS A STRING MANIPULATION FUNCTION TO GET THE FILE EXTENSION
/**
 * This string manipulation function's goal is to get the file extension off of the mimetype.
 * The mimetype comes in the format 'image/ext' if it is an image. So it will come as a string.
 * It will usually either be 'image/jpg' or image/jpeg' or 'image/png'. But because file extensions
 * aren't a fixed length, this makes it a bit harder to actually extract the file extension.
 * 
 */

function getFileExt(mimetype){

    //Setting the String length as a variable, so we can use it in our pre-test loop
    const StringLength = mimetype.length;

    //Starting the character index at 0
    let CharacterIndex = 0;

    //Starting the extension string as nothing
    let extensionString = ''

    //Starting off the variable lookAtFileExt as false
    let lookingAtFileExt = false;

    //Keep looping through the String whilst characterIndex is less than StringLength
    while(CharacterIndex < StringLength){
        //If we are lookingAtFileExt then add the current character we are looking at
        //to the extension string variable
        if(lookingAtFileExt == true){
             extensionString = extensionString + mimetype[CharacterIndex]
        }
        //Once we hit the slash, we know next character is going to be the start of the file ext
        //so now we set the looking at fileExt variable to true
        if(mimetype[CharacterIndex] == '/'){
            lookingAtFileExt = true;
        }
        //Incrementing the index
        CharacterIndex++;
    }

    //Return the file ext
    return extensionString;
}

function binarySearch(arr, id){

    
    //Pushing all the id's of the sorted array into a seperate array. This means 
    // idsArray[0] === arr[0]._id
    let idsArray = []
    for(i=0; i < arr.length; i++){
        idsArray.push(arr[i]._id)
    }

    //Sorting the whole array, this is important so we can return the element at an index in this
    //array after we do a binary search in an array of id's, to find the index in the idsArray
    idsArray.sort(function(a,b){return a-b})
    
    //==============================
    //    START OF BINARY SEARCH
    //==============================
    
    let start=0, end=idsArray.length
    let foundIndex = 0;

    //Iterate whilst start does not meet end
    while(start<=end){
        
        
        //Find the middle index of the array
        let mid=Math.floor((start+end)/2)

        //If we find the id at mid
        if(idsArray[mid] == id) {
            //returning the index so we can return the object from the shops array
            foundIndex = mid 
            break;
        }
        //Else we look in left or right half accordingly
        else if (idsArray[mid] < id){
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
            
    }
    
    //Returning the actual shop object
    return arr[foundIndex];
    
}

//This is the groupItems function. It basically groups the items into rows to allow for easy access in pug
function groupItems(items){

    //The group array means each element of it is a row
    let itemsGroupedArray = []

    //Each element of the row is an item
    let itemrow = []

    //Loop through all items parsed into the function
    for(i = 0; i < items.length; i++){

        //push an item onto the itemrow
        itemrow.push(items[i]);

        //Once we hit 4 items in the row, then push the row onto the group array
        if(i%4 == 3) {
            //push the row onto the group array
            itemsGroupedArray.push(itemrow)
            //clear the row
            itemrow = [];
        }
    }
    //If the the loop finishes without being a multiple of 4, which means it still has some items left over
    //then just push the final unfinished row onto the group array
    if (items.length%4 != 0){
        itemsGroupedArray.push(itemrow)
    }
    //return the array
    return itemsGroupedArray;
}

//Does the exact same as the above function, although just for shops
function groupShops(shops) {
    let shopsGroupedArray = [];
    let shoprow = [];
    //Loop thourgh all shops
    for (i = 0; i < shops.length; i++) {
        //Push onto shoprow
        shoprow.push(shops[i]);
        //If we are at the end of our row, push the row onto group array, then clear the row variable
        if (i % 4 == 3) {
            shopsGroupedArray.push(shoprow);
            shoprow = [];
        }
    }
    //This bit here is if we don't get to the end of our row, but we run out of items.
    //So we have to push the row onto the grouped array without it being full
    if (shops.length % 4 != 0) {
        shopsGroupedArray.push(shoprow);
    }
    return shopsGroupedArray;
}







