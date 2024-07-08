
# Json2CSV
## Table of Contents

-   [Introduction](#introduction)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Usage](#usage)
-   [License](#license)

## Introduction

This project uses the OpenWeatherMap API to gather historical air quality data for a list of Italian cities. The data is then processed to calculate monthly averages for various air quality indicators and saved as CSV files.

## Prerequisites
- Node.js (v14 or higher)
- npm (Node package manager)
- OpenWeatherMap API key - [create one here](https://home.openweathermap.org/api_keys)

## Installation

1.  Clone the repository:       
`git clone https://github.com/SimoOgni/Json2CSV.git`\
`cd Json2CSV` 
    
2.  Install the required dependencies:\
`npm install`

## Usage

1.  Create a `.env` file in the root of the project and add your OpenWeatherMap API key:
`API_KEY=your_openweathermap_api_key` 
    
2.  Run the script:
`node index.js` 
    
This will fetch air quality data for the specified cities and save the processed data as CSV files in the **data** directory.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
