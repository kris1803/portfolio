let mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// put your mongodb link below: 
const mongooseLink = '';

mongoose.connect(mongooseLink,
    options,
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to mongodb');
        }
    }
);

module.exports = mongoose;