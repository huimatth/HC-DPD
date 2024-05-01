// Variables to store filtered results and current page
let filteredResults = [];
let currentPage = 1;
const resultsPerPage = 10; // Adjust this value as needed

// Helper function to fetch data from a URI
async function fetchData(uri) {
    const response = await fetch(uri);
    const data = await response.json();
    return data;
}

// Function to process and combine objects from Part 1
async function processPart1() {
    // Existing code for fetching and processing Part 1 data...
}

// Function to process and combine objects from Part 2
async function processPart2() {
    // Existing code for fetching and processing Part 2 data...
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

// Function to display the table with paginated data
function displayTable(data) {
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = ''; // Clear previous content

    if (data.length === 0) {
        tableContainer.textContent = 'No data available.';
        return;
    }

    // Calculate start and end indices for the current page
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, data.length);
    const paginatedData = data.slice(startIndex, endIndex);

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
    paginatedData.forEach(obj => {
        const row = table.insertRow();
        headers.forEach(header => {
            const cell = row.insertCell();
            cell.textContent = obj[header];
        });
    });

    tableContainer.appendChild(table);

    // Display pagination controls
    displayPaginationControls(data.length);
}

// Function to display pagination controls
function displayPaginationControls(totalResults) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    // Clear previous pagination controls
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    // Create "Previous" button
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayTable(filteredResults);
        }
    });
    paginationContainer.appendChild(previousButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayTable(filteredResults);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Create "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayTable(filteredResults);
        }
    });
    paginationContainer.appendChild(nextButton);
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

    // Reset current page to 1 when applying filters
    currentPage = 1;
    displayTable(filteredResults);
}

// Function to reset filters and display the original data
function resetFilters() {
    document.getElementById('companyFilter').value = '';
    document.getElementById('ingredientFilter').value = '';

    filteredResults = filteredResults; // Reset to original data
    currentPage = 1; // Reset current page to 1
    displayTable(filteredResults);
}

// Run the main function when the page is loaded
document.addEventListener('DOMContentLoaded', main);
