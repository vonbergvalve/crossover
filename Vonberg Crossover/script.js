document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const suggestions = document.getElementById("suggestions");
  const resultsTable = document.getElementById("results-table");
  const resultsBody = document.getElementById("results-body");

  // Hide table headings initially
  resultsTable.style.display = "none";
  
  let allParts = [];

  fetch('parts.json')
    .then(response => response.json())
    .then(data => {
      allParts = data;
    });

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim().toLowerCase().replace(/[-\s]/g, "");
    
      if (query.length >= 3) {
        const filteredParts = allParts.filter((part) => {
          const cleanedPartNumber = part.partNumber.toLowerCase().replace(/[-\s]/g, "");
          const cleanedManufacturer = part.manufacturer.toLowerCase().replace(/[-\s]/g, "");
          return cleanedPartNumber.includes(query) || cleanedManufacturer.includes(query);
        });
    
        displaySuggestions(filteredParts);
      } else {
        suggestions.style.display = "none";
      }
    });
    

  function displaySuggestions(suggestionsList) {
    suggestions.innerHTML = "";
    suggestions.style.display = "block";

    if (suggestionsList.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No results found";
      suggestions.appendChild(p);
      return;
    }

    suggestionsList.slice(0, 10).forEach((suggestion) => {
      const p = document.createElement("p");
      p.textContent = `${suggestion.partNumber} - ${suggestion.manufacturer}`;
      p.addEventListener("click", () => {
        selectSuggestion(suggestion);
      });
      suggestions.appendChild(p);
    });
  }

  function selectSuggestion(suggestion) {
    suggestions.style.display = "none";
    searchInput.value = suggestion.partNumber;

    const fakeResults = [
      {
        partNumber: suggestion.partNumber,
        manufacturer: suggestion.manufacturer,
        alternativePartNumber: suggestion.alternativePartNumber,
        companyName: suggestion.companyName,
        catalogLink: suggestion.catalogLink,
      },
    ];

    displayResults(fakeResults);
  }

  function displayResults(results) {
    resultsBody.innerHTML = "";
    results.forEach((result) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${result.partNumber}</td>
        <td>${result.manufacturer}</td>
        <td>${result.alternativePartNumber}</td>
        <td>${result.companyName}</td>
        <td><a href="${result.catalogLink}" target="_blank">View Catalog</a></td>
      `;
      resultsBody.appendChild(tr);
    });

    // Show table headings when there are results
    if (results.length > 0) {
      resultsTable.style.display = "table";
    } else {
      resultsTable.style.display = "none";
    }
  }

  // Add the clear button event listener
  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    resultsBody.innerHTML = "";
    resultsTable.style.display = "none";
    suggestions.style.display = "none";
  });
});
