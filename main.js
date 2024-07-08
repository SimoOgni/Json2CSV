const fetch = require('node-fetch');
const { Parser } = require('json2csv');
const moment = require('moment');
const fs = require('fs');

require("dotenv").config()

// Funzione per convertirli in CSV
async function jsonToCsv(fileName, data) {
    try {
        const list = data.list;

        // Raggruppa i dati per mese
        const monthlyData = {};
        list.forEach(entry => {
            const month = moment.unix(entry.dt).format('YYYY-MM');
            if (!monthlyData[month]) {
                monthlyData[month] = {
                    count: 0,
                    aqi: 0,
                    co: 0,
                    no: 0,
                    no2: 0,
                    o3: 0,
                    so2: 0,
                    pm2_5: 0,
                    pm10: 0,
                    nh3: 0
                };
            }

            monthlyData[month].count++;
            monthlyData[month].aqi += entry.main.aqi;
            monthlyData[month].co += entry.components.co;
            monthlyData[month].no += entry.components.no;
            monthlyData[month].no2 += entry.components.no2;
            monthlyData[month].o3 += entry.components.o3;
            monthlyData[month].so2 += entry.components.so2;
            monthlyData[month].pm2_5 += entry.components.pm2_5;
            monthlyData[month].pm10 += entry.components.pm10;
            monthlyData[month].nh3 += entry.components.nh3;
        });

        // Calcola la media mensile e arrotonda a tre cifre decimali
        const records = Object.keys(monthlyData).map(month => ({
            month,
            aqi: (monthlyData[month].aqi / monthlyData[month].count).toFixed(3),
            co: (monthlyData[month].co / monthlyData[month].count).toFixed(3),
            no: (monthlyData[month].no / monthlyData[month].count).toFixed(3),
            no2: (monthlyData[month].no2 / monthlyData[month].count).toFixed(3),
            o3: (monthlyData[month].o3 / monthlyData[month].count).toFixed(3),
            so2: (monthlyData[month].so2 / monthlyData[month].count).toFixed(3),
            pm2_5: (monthlyData[month].pm2_5 / monthlyData[month].count).toFixed(3),
            pm10: (monthlyData[month].pm10 / monthlyData[month].count).toFixed(3),
            nh3: (monthlyData[month].nh3 / monthlyData[month].count).toFixed(3)
        }));

        // Definisce il parser CSV
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(records);

        // Scrive il CSV su file
        fs.writeFileSync(`./data/${fileName}.csv`, csv);

        console.log('CSV file has been created successfully.');
    } catch (error) {
        console.error('Error fetching data or converting to CSV:', error);
    }
}

const citiesName = [
    "Torino",     // Piemonte
    "Aosta",      // Valle d'Aosta
    "Milano",     // Lombardia
    "Trento",     // Trentino-Alto Adige (Trentino)
    "Venezia",    // Veneto
    "Trieste",    // Friuli-Venezia Giulia
    "Genova",     // Liguria
    "Bologna",    // Emilia-Romagna
    "Firenze",    // Toscana
    "Ancona",     // Marche
    "Perugia",    // Umbria
    "Roma",       // Lazio
    "L'Aquila",   // Abruzzo
    "Campobasso", // Molise
    "Napoli",     // Campania
    "Bari",       // Puglia
    "Potenza",    // Basilicata
    "Catanzaro",  // Calabria
    "Palermo",    // Sicilia
    "Cagliari"    // Sardegna
]


const cities = async () => {
    let arr = []

    for (let city of citiesName) {
        console.log(`Fetching informartion about ${city}`)
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},IT,IT&limit=1&lang=it&appid=${process.env.API_KEY}`);
        const data = await response.json();

        console.log(data)

        arr.push({
            name: city,
            lat: data[0].lat,
            lon: data[0].lon,
            country: data[0].country,
        });

    }

    return arr;
}

const main = async () => {
    const start = 1609459200; // Friday 1 January 2021 01:00:00
    const end = 1719705600; // Sunday 30 June 2024 01:00:00

    let citiesData = await cities();
    for (let city of citiesData) {
        console.log(`Fetching data for ${city.name}`);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${city.lat}&lon=${city.lon}&start=${start}&end=${end}&appid=${process.env.API_KEY}`);
        const data = await response.json();

        await jsonToCsv(city.name, data);
    }
}

cities()
