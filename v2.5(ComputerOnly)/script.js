document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const counterContainer = document.getElementById("counterContainer");
    const addCounterButton = document.getElementById("addCounter");
    const resetButton = document.getElementById("resetButton");
    const totalValue = document.getElementById("totalValue");
    const counterCount = document.getElementById("counterCount");
    const averageValue = document.getElementById("averageValue");
    const searchInput = document.getElementById("searchInput");
    const exportDataBtn = document.getElementById("exportData");
    const importDataBtn = document.getElementById("importData");

    // Counters State
    let counters = JSON.parse(localStorage.getItem("counters")) || [
        { id: generateId(), name: "New Counter", value: 0, color: getRandomColor() }
    ];
    
    // Color palette for counters
    const colorPalette = [
        "#4361ee", "#3a0ca3", "#7209b7", "#f72585", 
        "#4cc9f0", "#4895ef", "#560bad", "#f77f00", 
        "#2a9d8f", "#e9c46a", "#e76f51", "#2ec4b6"
    ];
    
    // Functions
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    function getRandomColor() {
        return colorPalette[Math.floor(Math.random() * colorPalette.length)];
    }

    function saveState() {
        localStorage.setItem("counters", JSON.stringify(counters));
    }

    function updateStats() {
        // Update total value
        const total = counters.reduce((sum, counter) => sum + counter.value, 0);
        totalValue.textContent = total.toLocaleString();
        
        // Update counter count
        counterCount.textContent = counters.length;
        
        // Update average value
        const average = counters.length > 0 ? Math.round((total / counters.length) * 100) / 100 : 0;
        averageValue.textContent = average.toLocaleString();
    }

    function renderCounters(filterTerm = "") {
        counterContainer.innerHTML = "";
        
        // Filter counters based on search term
        const filteredCounters = filterTerm ? 
            counters.filter(counter => counter.name.toLowerCase().includes(filterTerm.toLowerCase())) : 
            counters;
            
        if (filteredCounters.length === 0 && filterTerm) {
            const noResults = document.createElement("div");
            noResults.className = "no-results";
            noResults.textContent = `No counters found matching "${filterTerm}"`;
            counterContainer.appendChild(noResults);
            return;
        }
        
        filteredCounters.forEach(counter => {
            const counterDiv = document.createElement("div");
            counterDiv.className = "counter";
            counterDiv.id = `counter-${counter.id}`;
            
            // Editable Name
            const nameInput = document.createElement("input");
            nameInput.className = "counter-name";
            nameInput.value = counter.name;
            nameInput.addEventListener("input", () => {
                const targetCounter = counters.find(c => c.id === counter.id);
                if (targetCounter) {
                    targetCounter.name = nameInput.value;
                    saveState();
                }
            });
            
            // Counter Controls
            const controls = document.createElement("div");
            controls.className = "counter-controls";
            
            // Main Counter Controls (Decrease, Value, Increase)
            const mainControls = document.createElement("div");
            mainControls.className = "control-group";
            
            // Decrease Button
            const decreaseBtn = document.createElement("button");
            decreaseBtn.className = "counter-btn decrement tooltip";
            decreaseBtn.setAttribute("data-tooltip", "Decrease");
            decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
            decreaseBtn.onclick = () => {
                const targetCounter = counters.find(c => c.id === counter.id);
                if (targetCounter) {
                    targetCounter.value--;
                    valueInput.value = targetCounter.value;
                    counterDiv.classList.add("pulse");
                    setTimeout(() => counterDiv.classList.remove("pulse"), 300);
                    updateStats();
                    saveState();
                }
            };
            
            // Counter Value (Editable)
            const valueInput = document.createElement("input");
            valueInput.className = "counter-value";
            valueInput.type = "number";
            valueInput.value = counter.value;
            valueInput.addEventListener("change", () => {
                const targetCounter = counters.find(c => c.id === counter.id);
                if (targetCounter) {
                    targetCounter.value = parseInt(valueInput.value) || 0;
                    updateStats();
                    saveState();
                }
            });
            
            // Increase Button
            const increaseBtn = document.createElement("button");
            increaseBtn.className = "counter-btn tooltip";
            increaseBtn.setAttribute("data-tooltip", "Increase");
            increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
            increaseBtn.onclick = () => {
                const targetCounter = counters.find(c => c.id === counter.id);
                if (targetCounter) {
                    targetCounter.value++;
                    valueInput.value = targetCounter.value;
                    counterDiv.classList.add("pulse");
                    setTimeout(() => counterDiv.classList.remove("pulse"), 300);
                    updateStats();
                    saveState();
                }
            };
            
            // Action Controls (Reset, Delete)
            const actionControls = document.createElement("div");
            actionControls.className = "control-group";
            
            // Reset Counter Button
            const resetBtn = document.createElement("button");
            resetBtn.className = "reset-btn tooltip";
            resetBtn.setAttribute("data-tooltip", "Reset");
            resetBtn.innerHTML = '<i class="fas fa-undo"></i>';
            resetBtn.onclick = () => {
                const targetCounter = counters.find(c => c.id === counter.id);
                if (targetCounter) {
                    targetCounter.value = 0;
                    valueInput.value = 0;
                    updateStats();
                    saveState();
                }
            };
            
            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn tooltip";
            deleteBtn.setAttribute("data-tooltip", "Delete");
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.onclick = () => {
                if (confirm("Delete this counter?")) {
                    counters = counters.filter(c => c.id !== counter.id);
                    if (counters.length === 0) {
                        counters.push({ 
                            id: generateId(), 
                            name: "New Counter", 
                            value: 0,
                            color: getRandomColor()
                        });
                    }
                    updateStats();
                    saveState();
                    renderCounters(searchInput.value);
                }
            };
            
            // Add Elements to Controls
            mainControls.append(decreaseBtn, valueInput, increaseBtn);
            actionControls.append(resetBtn, deleteBtn);
            controls.append(mainControls, actionControls);
            
            // Add Elements to Counter
            counterDiv.append(nameInput, controls);
            counterContainer.appendChild(counterDiv);
        });
        
        updateStats();
    }

    // Add Counter Button
    addCounterButton.onclick = () => {
        counters.push({ 
            id: generateId(), 
            name: "New Counter", 
            value: 0,
            color: getRandomColor()
        });
        saveState();
        renderCounters(searchInput.value);
        
        // Scroll to the new counter
        setTimeout(() => {
            const newCounter = document.getElementById(`counter-${counters[counters.length-1].id}`);
            if (newCounter) {
                newCounter.scrollIntoView({ behavior: 'smooth' });
                newCounter.classList.add("pulse");
                setTimeout(() => newCounter.classList.remove("pulse"), 300);
            }
        }, 100);
    };

    // Reset All Counters
    resetButton.onclick = () => {
        if (confirm("Are you sure you want to reset all counters? This cannot be undone.")) {
            counters = [{ 
                id: generateId(), 
                name: "New Counter", 
                value: 0,
                color: getRandomColor()
            }];
            saveState();
            renderCounters();
        }
    };
    
    // Search functionality
    searchInput.addEventListener("input", (e) => {
        renderCounters(e.target.value);
    });
    
    // Export functionality
    exportDataBtn.addEventListener("click", () => {
        const dataStr = JSON.stringify(counters, null, 2);
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
        
        const exportFileName = `counter-data-${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileName);
        linkElement.click();
    });
    
    // Import functionality
    importDataBtn.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                if (Array.isArray(importedData)) {
                    if (confirm("Import this data? Current counters will be replaced.")) {
                        // Ensure all imported counters have IDs and colors
                        counters = importedData.map(counter => ({
                            id: counter.id || generateId(),
                            name: counter.name || "Imported Counter",
                            value: counter.value || 0,
                            color: counter.color || getRandomColor()
                        }));
                        
                        saveState();
                        renderCounters();
                    }
                } else {
                    alert("Invalid data format. Import failed.");
                }
            } catch (error) {
                alert("Error importing data: " + error.message);
            }
            
            // Reset the file input
            e.target.value = "";
        };
        reader.readAsText(file);
    });

    // Initial render
    renderCounters();
});