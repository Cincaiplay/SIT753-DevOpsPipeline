let express = require('express');
const path = require('path');
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const http = require('http'); // Required to create an HTTP server for socket.io
const socketIO = require('socket.io'); // Import socket.io
require('newrelic');  // Add this line to the top of your main file

const uri = "mongodb+srv://kcy96:PWh3CsXeGds5nML6@cluster0.ktpncav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const port = 3040;
let collection;

// Create an HTTP server for socket.io
const server = http.createServer(app);
const io = socketIO(server); // Bind socket.io to the HTTP server

app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function runDBConnection() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (ex) {
        console.error(ex);
    }
}
runDBConnection(); // Ensure this runs at the start

app.get('/', function (req, res) {
    res.send('Welcome to the Express and MongoDB App');
});

// Socket.io integration
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Emit a welcome message to the connected client
    socket.emit('welcome', 'Welcome to the real-time app!');

    // Handle incoming messages from the client
    socket.on('message', (message) => {
        console.log('Message from client:', message);
        socket.emit('serverResponse', `Server received your message: ${message}`);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Function to add two numbers
const addTwoNumber = (n1, n2) => {
    return n1 + n2;
}

// Endpoint to add two numbers
app.get("/addTwoNumber", (req, res) => {
    const n1 = parseInt(req.query.n1);
    const n2 = parseInt(req.query.n2);

    // Check if either n1 or n2 is not a number
    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({ statusCode: 400, data: null });
    }

    const result = n1 + n2;
    res.status(200).json({ statusCode: 200, data: result });
});

// Display a simple HTML message
app.get("/Display", (req, res) => {
    const n1 = "<html><body><H1>HELLO THERE </H1></body></html>";
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(n1));
})

// Create a new user
app.post('/api/users', async (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || isNaN(age)) {
        return res.json({ statusCode: 400, message: "Invalid input" });
    }

    try {
        const database = client.db('myAppDB');
        const users = database.collection('users');
        const result = await users.insertOne({ name, email, age });

        res.status(201).json({ data: result.insertedId, message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, message: 'Internal Server Error' });
    }
});

// Get a user by name
app.post("/getUserByName", async (req, res) => {
    const userName = req.body.name;

    if (!userName) {
        return res.json({ statusCode: 400, message: "Invalid Name" });
    }

    try {
        const database = client.db('myAppDB');
        const users = database.collection('users');
        const query = { name: userName };
        const user = await users.findOne(query);

        if (user) {
            res.json({ statusCode: 200, data: user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, message: "Internal Server Error" });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const database = client.db('myAppDB');
        const users = database.collection('users');
        const userList = await users.find({}).toArray();

        res.json({ statusCode: 200, data: userList });
    } catch (error) {
        console.error(error);
        res.json({ statusCode: 500, message: 'Internal Server Error' });
    }
});

// Listen on the HTTP server (instead of app.listen)
server.listen(port, () => {
    console.log("Server is listening on port " + port);
});

module.exports = app;
