var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id : { type : String, required : true }, 
    account: {type: String, required: true},
    name : { type : String, required : true },
    password : { type : String, required : true },
    email : { type : String, required : true },
    tel : { type : String },
    website : { type : String },
    classid : { type: String, ref: 'department' },
    userType : { type: String, required: true },
    courses: [{ type: String, ref: 'course' }]
}, { collection: 'user' });

var departmentSchema = new Schema({
    _id : { type : String, required : true }, 
    name : { type : String, required : true }
},  { collection: 'department' });

var courseSchema = new Schema({
    _id : { type : String, required : true }, 
    name : { type : String, required : true },
    classid : {type : String, ref: 'department' },
    teacherAccount : {type : String, required : true },
    TA : [{type : String, ref: 'user' }],
    studentAccount : [{type : String, ref: 'user' }],
    assignment: [{ type : Schema.Types.ObjectId, required : true , ref: 'assignment'}]
},  { collection: 'course' });

var assignmentSchema = new Schema({
    _id : { type : Schema.Types.ObjectId, required : true }, 
    name : { type : String, required : true },
    description : {type : String },
    courseid : {type : String, required : true, ref: 'course' },
    start : {type : Date, required : true},
    end : {type : Date, required : true},
    status : {type : String, required : true },
    hanginCount : {type : Number, required : true, default: 0}
},  { collection: 'assignment' , timestamps: true});

mongoose.model('user', userSchema);
mongoose.model('department', departmentSchema);
mongoose.model('course', courseSchema);
mongoose.model('assignment', assignmentSchema);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://passadmin:1421@ds159737.mlab.com:59737/pass', {
    useMongoClient: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Conncet database fail.'));
db.once('open', function callback() {
    console.log("Connect database success.");
});