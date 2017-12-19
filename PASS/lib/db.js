var mongoose = require('mongoose');
var Schema = mongoose.Schema;

 var userSchema = new Schema({
    name : { type : String, required : true },
    password : { type : String, required : true },
    email : { type : String, required : true },
    tel : { type : String },
    website : { type : String },
    classid : { type: Schema.Types.ObjectId, ref:'department' }
}, { collection: 'user' });

var departmentSchema = new Schema({
    name : { type : String, required : true }
},  { collection: 'department' });

mongoose.model('user', userSchema);
mongoose.model('department', departmentSchema);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://passadmin:1421@ds159737.mlab.com:59737/pass', {
    useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Conncet database fail.'));
db.once('open', function callback() {
    console.log("Connect database success.");
});