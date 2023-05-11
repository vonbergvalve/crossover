document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const suggestions = document.getElementById("suggestions");
  const resultsTable = document.getElementById("results-table");
  const resultsBody = document.getElementById("results-body");

  // Hide table headings initially
  resultsTable.style.display = "none";

  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim().toLowerCase().replace(/-/g, '').replace(/ /g, '');
    suggestions.style.display = "none";

    if (query.length >= 1) {
      const response = await fetch('parts.json');
      const allParts = await response.json();

      const filteredParts = allParts.filter((part) => {
        const partNumber = part.partNumber.toLowerCase().replace(/-/g, '').replace(/ /g, '');
        const manufacturer = part.manufacturer.toLowerCase().replace(/-/g, '').replace(/ /g, '');
        return partNumber.includes(query) || manufacturer.includes(query);
      }).slice(0, 25);

      displaySuggestions(filteredParts);
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

    suggestionsList.forEach((suggestion) => {
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
        <td><a href="${result.catalogLink}" target="_blank">View Catalog</a></td>
        <td><button class="inquiry-button">Inquire</button></td>
      `;
      const inquiryButton = tr.querySelector(".inquiry-button");
      inquiryButton.addEventListener('click', () => {
        const quantity = prompt("Please enter the quantity you wish to inquire about:");
        const timeNeeded = prompt("Please enter the number of days or weeks by which you need the parts (e.g., 5 days or 2 weeks):");

        if (quantity !== null && timeNeeded !== null) {
    const emailLink = `mailto:info@vonberg.com?subject=Price%20and%20Availability%20Inquiry%20for%20${result.alternativePartNumber}&body=To%3A%20Vonberg%20Valve%2C%0D%0A%0D%0AI'm%20interested%20in%20your%20part%20number%20${result.alternativePartNumber}.%20I%20am%20looking%20for%20a%20replacement%20for%20the%20Parker%20valve%20${result.partNumber}.%20I%20need%20${quantity}%20units%20within%20${timeNeeded}.%20Could%20you%20please%20provide%20the%20price%20and%20availability?`;
    window.location.href = emailLink;
  }
});

      

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

