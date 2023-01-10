// Connect to a MongoDB server running on localhost and port 27017, and connects to the test database.
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//You can check if the connection is successful by adding an event listener for the connected or error events as such
const connection = mongoose.connection;
connection.on('connected', () => {
    console.log('Mongoose connected to the database.');
});
connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
});

// Create a schema for the data to be stored in the database.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        faker: 'internet.userName',
    },
    email: {
        type: String,
        required: true,
        faker: 'internet.email',
    },
    password: {
        type: String,
        required: true,
        faker: 'internet.password',
    },
    first_name: {
        type: String,
        required: true,
        faker: 'name.firstName',
    },
    last_name: {
        type: String,
        required: true,
        faker: 'name.lastName',
    },
}, {timestamps: true} );

const User = mongoose.model('User', userSchema);

// Schema for a projects collection
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        faker: 'company.companyName',
    },
    description: {
        type: String,
        required: true,
        faker: 'lorem.paragraph',
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            faker: {
                fk: 'User:_id',
            },
        },
    ],
})

// insert data in to the projects collection
const Project = mongoose.model('Project', projectSchema);

//create a tasks schema
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    created_at: {
        type: Date,
        required: true,
    },
    updated_at: {
        type: Date,
        required: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Task = mongoose.model('Task', taskSchema);

const TimeEntrySchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
    },
    duration: {
        type: Number,
        required: true,
        validate: {
            validator: function(value){
                return value >= 0;
            },
            message: 'Duration must be greater than or equal to 0'
        }
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const TimeEntry = mongoose.model('TimeEntry', TimeEntrySchema);

const { generate } = require('mongoose-data-faker');

// Generate 4 users
generate(User, {
    count: 4,
    uniqueFields: ['email'],
    log: true,
})



