const express = require('express');
const axios = require('axios');
const app = express();

const TIMEOUT = 500; // Timeout in milliseconds

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;
    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid URLs' });
    }

    const uniqueIntegers = new Set();

    const fetchData = async (url) => {
        try {
            const response = await axios.get(url, { timeout: TIMEOUT });
            if (response && response.data && Array.isArray(response.data.numbers)) {
                response.data.numbers.forEach(num => uniqueIntegers.add(num));
            }
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error.message);
        }
    };

    const dataPromises = urls.map(fetchData);

    try {
        await Promise.all(dataPromises);
    } catch (error) {
        console.error('Error processing URLs:', error.message);
    }

    const sortedUniqueIntegers = Array.from(uniqueIntegers).sort((a, b) => a - b);
    res.json({ numbers: sortedUniqueIntegers });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});