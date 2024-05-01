// Variables to store filtered results
let filteredResults = [];

// Helper function to fetch data from a URI
async function fetchData(uri) {
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

// Function to process and combine objects from Part 1
async function processPart1() {
    const [drugProducts, statuses, schedules, routes] = await Promise.all([
        fetchData('https://health-products.canada.ca/api/drug/drugproduct/?status=1&lang=en&type=json'),
        fetchData('https://health-products.canada.ca/api/drug/status/?lang=en&type=json'),
        fetchData('https://health-products.canada.ca/api/drug/schedule/?lang=en&type=json'),
        fetchData('https://health-products.canada.ca/api/drug/route/?lang=en&type=json')
    ]);

    // Create a map to combine objects by drug_code
    const combinedObjects = {};

    // Merge drugProducts, statuses, schedules, routes based on drug_code
    [drugProducts, statuses, schedules, routes].forEach(dataList => {
        dataList.forEach(obj => {
            const drugCode = obj.drug_code;
            if (!combinedObjects[drugCode]) {
                combinedObjects[drugCode] = {};
            }
            Object.assign(combinedObjects[drugCode], obj);
        });
    });

    // Filter and sort combined objects based on the specified criteria
    const filteredObjects = Object.values(combinedObjects)
        .filter(obj => obj.last_update_date && obj.schedule_name === 'OTC')
        .sort((a, b) => new Date(b.last_update_date) - new Date(a.last_update_date));

    return filteredObjects;
}

// Function to process and combine objects from Part 2
async function processPart2() {
    const activeIngredients = await fetchData('https://health-products.canada.ca/api/drug/activeingredient/?lang=en&type=json');

    // Create a map to combine activeIngredients by drug_code
    const combinedIngredients = {};

    activeIngredients.forEach(ingredient => {
        const drugCode = ingredient.drug_code;
        if (!combinedIngredients[drugCode]) {
            combinedIngredients[drugCode] = [];
        }
        combinedIngredients[drugCode].push(ingredient);
    });

    // Concatenate key values for each drug_code
    Object.keys(combinedIngredients).forEach(drugCode => {
        combinedIngredients[drugCode] = combinedIngredients[drugCode].reduce((acc, ingredient) => {
            acc.ingredient_name = (acc.ingredient_name || "") + ", " + ingredient.ingredient_name;
            acc.dosage_unit = ingredient.dosage_unit;
            acc.dosage_value = ingredient.dosage_value;
            acc.strength = (acc.strength || "") + ", " + ingredient.strength;
            acc.strength_unit = ingredient.strength_unit;
            return acc;
        }, {});
    });

    return combinedIngredients;
}

// Main function to execute both parts and populate the table
async function main() {
    try {
        const part1Results = await processPart1();
        const part2Results = await processPart2();

        // Combine results from part1 and part2 based on drug_code
        const combinedResults = part1Results.map(obj => ({
            ...obj,
            ...part2Results[obj.drug_code]
        }));

        filteredResults = combinedResults; // Store in global variable for filtering

        // Display results in a table
        displayTable(filteredResults);

    } catch (error) {
        console.error('Error:', error);
        displayError();
    }
}

// Function to display the table with data
function displayTable(data) {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = ''; // Clear previous content

    if (data.length === 0) {
        tableContainer.textContent = 'No data available.';
        return;
    }

    const table = document.createElement('table');
    const headers = Object.keys(data[0]);

    // Create table headers
    const headerRow = table.createTHead().insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Create table rows
    data.forEach(obj => {
        const row = table.insertRow();
        headers.forEach(header => {
            const cell = row.insertCell();
            cell.textContent = obj[header];
        });
    });

    tableContainer.appendChild(table);
}

// Function to display error message
function displayError() {
    const tableContainer = document.getElementById('table-container');
    tableContainer.textContent = 'Error fetching or processing data.';
}

// Function to apply filters
function applyFilters() {
    const companyFilter = document.getElementById('companyFilter').value.trim().toLowerCase();
    const ingredientFilter = document.getElementById('ingredientFilter').value.trim().toLowerCase();

    filteredResults = filteredResults.filter(obj =>
        obj.company_name.toLowerCase().includes(companyFilter) &&
        obj.ingredient_name.toLowerCase().includes(ingredientFilter)
    );

    displayTable(filteredResults);
}

// Function to reset filters and display the original data
function resetFilters() {
    document.getElementById('companyFilter').value = '';
    document.getElementById('ingredientFilter').value = '';

    filteredResults = filteredResults; // Reset to original data
    displayTable(filteredResults);
}

// Run the main function when the page is loaded
document.addEventListener('DOMContentLoaded', main);
