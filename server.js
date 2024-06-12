const express = require('express');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');
const app = express();
const results = [];


app.use(express.static('public'));
// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to access CSV data
app.get('/data', async (req, res) => {
    try {
        const results = [];
        const hashMap = {};
        await new Promise((resolve, reject) => {
            fs.createReadStream(__dirname + '/public/algorithms.csv')
              .pipe(csv())
              .on('data', (data) => results.push(data))
              .on('end', () => {
                // Convert array to hash map
                results.forEach(item => {
                    hashMap[item['Name']] = item['Algorithm'].trim(); // Adjust key and value to your CSV column names
                });
                resolve();
              })
              .on('error', (error) => {
                console.error('Error processing CSV file:', error);
                reject(error);
            })
        });
        res.json(hashMap);
    } catch (error) {
        console.error('Error caught in /data route:', error);
        res.status(500).send('Failed to load CSV data');
    }
});

// Use express.json() to parse JSON-encoded bodies
app.use(express.json());

app.post('/solve-cube', (req, res) => {
    const { cubeString } = req.body;

    if (!cubeString) {
        return res.status(400).json({ error: 'Cube string is required' });
    }

    const pythonProcess = spawn('python', ['/public/solve.py', cubeString]);

    let output = '';
    let errorOccurred = false;

    pythonProcess.stdout.on('data', (data) => {
        output += data;
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
        errorOccurred = true;
        if (!res.headersSent) {
            res.status(500).json({ error: data.toString() });
        }
    });

    pythonProcess.on('close', (code) => {
        if (!errorOccurred) {
            if (code === 0) {
                res.json({ solution: output.trim() });
            } else {
                res.status(500).json({ error: `Python script exited with code ${code}` });
            }
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});