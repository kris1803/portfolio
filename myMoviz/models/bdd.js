let mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const mongoLink = ''

mongoose.connect(mongoLink,
    options,
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to MongoDB');
        }
    }
);


module.exports = mongoose;