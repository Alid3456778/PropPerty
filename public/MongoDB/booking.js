const mongoose = require("mongoose");

const connect = mongoose.connect('mongodb://localhost:27017/Login-tut', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Connection error', err);
});

connect.then(() => {
    console.log("Connected to Booking database successfully");
}).catch((e) => {
    console.log("Error: ", e);
});


const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Path `username` is required.']
    },
    email: {
        type: String,
        required: [true, 'Path `email` is required.']
    },
    number: {
        type: Number,
        required: [true, 'Path `number` is required.']
    },
    people: {
        type: Number,
        required: [true, 'Path `people` is required.']
    },
    childrens: {
        type: Number,
        required: false
    },
    packageName: {
        type: String,
        required: [true, 'Path `packageName` is required.']
    },
    packagePrice: {
        type: Number,
        required: [true, 'Path `packagePrice` is required.']
    },
    packageDescription: {
        type: String,
        required: [true, 'Path `packageDescription` is required.']
    },
    flight:{
        type: String,
        required: [true, 'Path `Fight` is required.']
    },
    transportType: {
        type: String,
        enum: ['bus', 'car'], 
        required: [true, 'Path `transportType` is required.']
    },
    transportDetails: {
        type: Object,
        required: [true, 'Path `transportDetails` is required.'],
        validate: {
            validator: function(v) {
               
                if (this.transportType === 'bus') {
                    return v && v.busType;
                } else if (this.transportType === 'car') {
                    return v && v.carType;
                }
                return false;
            },
            message: 'Invalid transport details'
        }
    }
});


const BK_collection = mongoose.model("booking", BookingSchema);

module.exports = BK_collection;
