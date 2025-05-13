document.addEventListener('DOMContentLoaded', () => {
    // Check if SDK loaded
    if (typeof formsg_sdk === 'undefined') {
        showError("Error: FormSG SDK could not be loaded. Check the script tag in index.html or your internet connection.");
        // Disable inputs if SDK failed to load
        document.getElementById('secretKey').disabled = true;
        document.getElementById('encryptedContent').disabled = true;
        document.getElementById('addDataBtn').disabled = true;
        return;
    }

    const formsg = formsg_sdk(); // Instantiate SDK from global variable provided by CDN

    // DOM Elements
    const secretKeyInput = document.getElementById('secretKey');
    const encryptedContentInput = document.getElementById('encryptedContent');
    const addDataBtn = document.getElementById('addDataBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const tableHeaderRow = document.getElementById('table-header-row');
    const tableBody = document.getElementById('table-body');
    const errorMessage = document.getElementById('error-message');

    // State
    let allResponses = []; // Stores decrypted responses as { question: answer } objects
    let allHeaders = new Set(); // Stores unique questions (table headers)

    // Event Listeners
    addDataBtn.addEventListener('click', handleAddData);
    clearAllBtn.addEventListener('click', handleClearAll);
    exportCsvBtn.addEventListener('click', handleExportCsv);

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }

    function handleAddData() {
        hideError();
        const secretKey = secretKeyInput.value.trim();
        const encryptedContent = encryptedContentInput.value.trim();

        if (!secretKey || !encryptedContent) {
            showError('Please provide both the Form Secret Key and the Encrypted Response Payload.');
            return;
        }

        try {
            // The SDK expects an object like { encryptedContent: "..." }
            const submissionData = { encryptedContent };
            const submission = formsg.crypto.decrypt(secretKey, submissionData);

            if (submission && submission.responses) {
                // Process and add the decrypted data
                const formattedResponse = {};
                submission.responses.forEach(field => {
                    const question = field.question;
                    const answer = field.answerArray ? field.answerArray.join(', ') : field.answer; // Handle answerArray
                    formattedResponse[question] = answer;
                    allHeaders.add(question);
                });
                allResponses.push(formattedResponse);

                // Clear inputs after successful addition
                // secretKeyInput.value = ''; // Keep key for multiple additions
                encryptedContentInput.value = '';

                renderTable();
            } else {
                showError('Decryption failed. Please check your Secret Key and the Encrypted Payload.');
            }
        } catch (error) {
            console.error('Decryption error:', error);
            showError(`An unexpected error occurred during decryption: ${error.message}. Check console for details.`);
        }
    }

    function renderTable() {
        // Clear existing table
        tableHeaderRow.innerHTML = '';
        tableBody.innerHTML = '';

        if (allResponses.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="100%">No data added yet.</td></tr>';
            allHeaders.clear(); // Reset headers if no data
            return;
        }

        // Create headers
        const headers = Array.from(allHeaders);
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            tableHeaderRow.appendChild(th);
        });

        // Create rows
        allResponses.forEach(response => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = response[header] || ''; // Get value or empty string if question not in this response
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    function handleClearAll() {
        hideError();
        allResponses = [];
        allHeaders.clear();
        secretKeyInput.value = '';
        encryptedContentInput.value = '';
        renderTable();
    }

    function handleExportCsv() {
        if (allResponses.length === 0) {
            showError('No data to export.');
            return;
        }

        const headers = Array.from(allHeaders);
        const csvRows = [];

        // Add header row
        csvRows.push(headers.map(escapeCsvCell).join(','));

        // Add data rows
        allResponses.forEach(response => {
            const values = headers.map(header => {
                const value = response[header] || '';
                return escapeCsvCell(value);
            });
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        downloadCsv(csvString, 'formsg_combined_data.csv');
    }

    // Utility to escape cell content for CSV (handles commas, quotes, newlines)
    function escapeCsvCell(cellData) {
        let stringData = String(cellData);
        // If the data contains a comma, newline, or double quote, enclose it in double quotes.
        if (stringData.search(/([",\n])/g) >= 0) {
            // Escape existing double quotes by doubling them
            stringData = stringData.replace(/"/g, '""');
            // Enclose the entire string in double quotes
            stringData = `"${stringData}"`;
        }
        return stringData;
    }

    // Utility to trigger CSV download
    function downloadCsv(csvString, filename) {
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
           showError("CSV Download not supported by your browser.");
        }
    }

    // Initial render
    renderTable();
}); 