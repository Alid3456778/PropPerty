const express = require('express');
const path=require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { LocalStorage } = require('node-localstorage');

const BK_collection= require('./public/MongoDB/booking')
const collection = require('./public/MongoDB/Mongo')
const app = express();
const port = process.env.PORT || 3000;
const { required } = require('nodemon/lib/config');
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(session({
  secret: 'your_secret_key',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   
}));

app.get('/', (req, res) => {
            res.render('index'); 
});

app.get('/pack',(req,res)=>{
    let jsonData;
    fs.readFile('./public/dummy.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            jsonData = JSON.parse(data);
            
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            return res.status(500).send('Error parsing JSON data');
        }
    

        // res.render('pack', { packages: matchingPackages, message: null });
        // res.send(jsonData);
        const users = jsonData; 
        res.render('pack', { users: users });
    });
})

app.get('/admin',(req,res)=>{
    res.render('admin');
})

app.get('/package',(req,res)=>{
    // res.render('package');
    res.render('package', { session: req.session });
})

app.get('/fake',(req,res)=>{
    res.render("fake");
})

app.get('/login',(req,res)=>{
    res.render("login");
    
});

app.get('/customer_data', async (req, res) => {
    try {
        const users = await collection.find(); 
        res.render('customer_data', { users: users }); 
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching users");
    }
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

// app.post('/signup', async (req, res) => {
//     try {
        
//         const data = {
//             name: req.body.username,
//             email: req.body.email,
//             password: req.body.password
//         };

        
//         const existingUser = await collection.findOne({ email: data.email });
//         if (existingUser) {
        
//             return res.status(400).send("User already exists. Please log in.");
//         }

        
//         const saltRounds = 10;
//         const hashPassword = await bcrypt.hash(data.password, saltRounds);
//         data.password = hashPassword;

        
//         const userdata = await collection.insertMany(data);
//         console.log(userdata, "user data saved");

        
//         req.session.user = {
//             id: userdata[0]._id,
//             name: userdata[0].name,
//             email: userdata[0].email
//         };

        
//         res.redirect('/index');
//     } catch (error) {
//         console.error("Signup error:", error);
//         res.status(500).send("An error occurred during signup. Please try again.");
//     }
// });

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        
        return next();
    }
    
    res.redirect('/login');
}

app.post('/booking', isAuthenticated, async (req, res) => {
    try {
        
        const data = {
            name: req.body.username,
            email: req.body.email,
            number: req.body.number,
            people: req.body.people,
            childrens: req.body.childrens,
            packageName: req.body.packageName,
            packagePrice: req.body.packagePrice,
            packageDescription: req.body.packageDescription,
            transportType: req.body.transportType, 
            flight:req.body.flight,
        };

        
        if (req.body.transportType === 'bus') {
            data.transportDetails = {
                type: 'bus',
                busType: req.body.busType 
            };
        } else if (req.body.transportType === 'car') {
            data.transportDetails = {
                type: 'car',
                carType: req.body.carType 
            };
        }

    
        const userdata = await BK_collection.insertMany(data);

        
    //     res.render('index', { message: "Booking Successful" });
    // } catch (error) {
    //     console.error('Error processing booking:', error);
    //     res.status(500).send('Booking failed, please try again later.');
    // }
    return res.redirect(`/payment?packageName=${encodeURIComponent(req.body.packageName)}&packagePrice=${encodeURIComponent(req.body.packagePrice)}&people=${encodeURIComponent(req.body.people)}`);
    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).send('Booking failed, please try again later.');
    }
});

app.get('/booking_data', async (req, res) => {
    try {
        const users = await BK_collection.find(); 
        res.render('booking_data', { users: users }); 
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching users");
    }
});

// app.post('/login', async (req, res) => {
//     try {
//         const check = await collection.findOne({ email: req.body.email });
//         if (!check) {
            
//             return res.status(400).render("login", { error: "Invalid Email or Password" });
//         }


//         const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
//         if (!isPasswordMatch) {
           
//             return res.status(400).render("login", { error: "Invalid Password" });
//         }

        
//         req.session.user = {
//             id: check._id,
//             name: check.name,
//             email: check.email
//         };

//        // res.redirect('/packages');
//        res.render("index"); 
//     } catch (e) {
//         console.error(e);
//         return res.status(500).render("login", { error: "An error occurred during login" });
//     }
// });

app.post('/admin', (req, res) => {
    const { name, descp, price, pic, best_time_to_vist, top_attraction, activities, local_dishes, language, currency, numDays } = req.body;

    const newData = {
        name: name,
        description: descp,
        price: price,
        image: pic,
        best_time_to_vist: best_time_to_vist,
        top_attraction: top_attraction,
        activities: activities,
        local_dishes: local_dishes,
        language: language,
        currency: currency
    };


    for (let i = 1; i <= numDays; i++) {
        const dayTitle = req.body[`day${i}_title`];
        const dayDetails = req.body[`day${i}_details`];

        if (dayTitle && dayDetails) {
            newData[`day${i}_title`] = dayTitle;
            newData[`day${i}_details`] = dayDetails;
        }
    }

    fs.readFile(path.join(__dirname, './public/dummy.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error(parseError);
            return res.status(500).send('Error parsing JSON data');
        }

        jsonData.push(newData);

        fs.writeFile(path.join(__dirname, './public/dummy.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing file');
            }

            res.send(`
                <script>
                    alert('Your package is Successfully Added with Days details');
                    window.location.href = '/admin';
                </script>
            `);
        });
    });
});

app.get('/search', (req, res) => {
    res.render('search', { packages: [], message: null });
});

app.post('/search', (req, res) => {
    const { packageName } = req.body;

    if (!packageName) {
        return res.status(400).send('Package name is required');
    }

    fs.readFile('./public/dummy.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            return res.status(500).send('Error parsing JSON data');
        }

        
        const matchingPackages = jsonData.filter(item =>
            item.name.toLowerCase().startsWith(packageName.toLowerCase())
        );

        
        if (matchingPackages.length === 0) {
            return res.send('<p>No matching packages found.</p>');
        }
       res.render('search', { packages: matchingPackages, message: null });
    });
});


app.post('/delete', (req, res) => {
    const { packagePrice } = req.body;

    if (!packagePrice) {
        return res.status(400).send('Package price is required');
    }

    console.log('Received packagePrice for deletion:', packagePrice);

    fs.readFile('./public/dummy.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            return res.status(500).send('Error parsing JSON data');
        }

        // Filter out the objects with the given price
        const filteredData = jsonData.filter(item => item.price !== packagePrice );

        if (filteredData.length === jsonData.length) {
            // No matching package found, redirecting without alert
            return res.redirect('/admin');
        }

        fs.writeFile('./public/dummy.json', JSON.stringify(filteredData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Error writing file');
            }
            // Send a response that includes the alert script and redirection
            res.send(`
                <script>
                    alert('Your package is Successfully Deleted');
                    window.location.href = '/admin';
                </script>
            `);
        });
    });
});

//------------------------------------------------
app.get('/payment', (req, res) => {
    const { packageName, packagePrice, people } = req.query;

    if (!packageName || !packagePrice || !people) {
        return res.status(400).send("Invalid payment details");
    }

    const totalPrice = packagePrice * people;
    
    res.render('payment', {
        packageName: packageName,
        packagePrice: packagePrice,
        peopleCount: people,
        totalAmount: totalPrice
    });
});

app.post('/submitPayment', (req, res) => {
    const { cardNumber, expiryDate, cvv, totalAmount } = req.body;

    if (!cardNumber || !expiryDate || !cvv || !totalAmount) {
        return res.status(400).send("Missing payment details");
    }

    // Simulate successful payment processing
   // res.send(`Payment of $${totalAmount} for your package was successful! Thank you for your booking.`);
   res.render("index");
   
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
