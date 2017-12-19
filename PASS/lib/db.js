var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    account: {type: String, required: true},
    name : { type : String, required : true },
    password : { type : String, required : true },
    email : { type : String, required : true },
    tel : { type : String },
    website : { type : String },
    classid : { type: String, ref: 'department' },
    userType : { type: String, required: true },
    courses: { type: [String], ref: 'course' }
}, { collection: 'user' });

var departmentSchema = new Schema({
    id : { type : String, required : true }, 
    name : { type : String, required : true }
},  { collection: 'department' });

var courseSchema = new Schema({
    id : { type : String, required : true }, 
    name : { type : String, required : true },
    classid : {type : String, required : true },
    teacherAccount : {type : String, required : true },
    TA : {type : [String], ref: 'user' },
    studentAccount : {type : [String], ref: 'user' },
},  { collection: 'course' });

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