// Function to load and process CSV
async function loadCSV() {
    try {
        const response = await fetch("assets/crop_data.csv"); // Make sure the path is correct
        if (!response.ok) throw new Error("Failed to load CSV file");

        const data = await response.text();
        let rows = data.trim().split("\n").map(row => row.split(",")); 

        // Extract headers (first row)
        let headers = rows.shift().map(h => h.trim());

        // Convert rows into an array of objects
        let jsonData = rows.map(row => {
            return Object.fromEntries(headers.map((h, i) => [h, row[i]?.trim() || ""]));
        });

        console.log("CSV Data Loaded:", jsonData); // Debugging: Check in console
        return jsonData;
    } catch (error) {
        console.error("Error loading CSV:", error);
    }
}

// Function to get user input and recommend a crop
async function recommendCrop() {
    let crops = await loadCSV(); // Load CSV data

    if (!crops) return;

    // Get user inputs from form fields
    let nitrogen = document.getElementById("nitrogen").value;
    let phosphorus = document.getElementById("phosphorus").value;
    let potassium = document.getElementById("potassium").value;
    let temperature = document.getElementById("temperature").value;
    let humidity = document.getElementById("humidity").value;
    let ph = document.getElementById("ph").value;
    let rainfall = document.getElementById("rainfall").value;

    // Convert inputs to numbers
    nitrogen = parseFloat(nitrogen);
    phosphorus = parseFloat(phosphorus);
    potassium = parseFloat(potassium);
    temperature = parseFloat(temperature);
    humidity = parseFloat(humidity);
    ph = parseFloat(ph);
    rainfall = parseFloat(rainfall);

    // Find the best crop based on input (simple matching logic)
    let recommendedCrops = crops.filter(crop => {
        return (
            Math.abs(nitrogen - crop["N"]) <= 10 &&
            Math.abs(phosphorus - crop["P"]) <= 10 &&
            Math.abs(potassium - crop["K"]) <= 10 &&
            Math.abs(temperature - crop["temperature"]) <= 5 &&
            Math.abs(humidity - crop["humidity"]) <= 5 &&
            Math.abs(ph - crop["ph"]) <= 1 &&
            Math.abs(rainfall - crop["rainfall"]) <= 20
        );
    });

    // Display the result
    let resultDiv = document.getElementById("result");
    if (recommendedCrops.length > 0) {
        resultDiv.innerHTML = `<h3>Recommended Crops:</h3><ul>` +
            recommendedCrops.map(crop => `<li>${crop["label"]}</li>`).join("") +
            `</ul>`;
    } else {
        resultDiv.innerHTML = `<h3>No matching crop found. Try adjusting the values.</h3>`;
    }
}

// Attach event listener to the button
document.getElementById("submitBtn").addEventListener("click", recommendCrop);
