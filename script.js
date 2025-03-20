// Load counters from localStorage
document.addEventListener("DOMContentLoaded", function () {
    loadCounters();
});

// Function to add a new counter
function addNewCounter() {
    let counters = JSON.parse(localStorage.getItem("counters")) || [];

    const content = document.getElementById("content");

    // Create counter container
    const counterDiv = document.createElement("div");
    counterDiv.classList.add("counter");

    // Counter Name
    const counterName = document.createElement("input");
    counterName.classList.add("counter-name");
    counterName.type = "text";
    counterName.value = "New Counter";

    // Counter controls container
    const counterControls = document.createElement("div");
    counterControls.classList.add("counter-controls");

    // Counter value (Editable)
    const counterValue = document.createElement("input");
    counterValue.classList.add("counter-value");
    counterValue.type = "number";
    counterValue.value = "0";
    
    counterValue.onchange = saveCounters;

    // Increase button
    const increaseBtn = document.createElement("button");
    increaseBtn.textContent = "+";
    increaseBtn.onclick = function () {
        counterValue.value = parseInt(counterValue.value) + 1;
        saveCounters();
    };

    // Decrease button
    const decreaseBtn = document.createElement("button");
    decreaseBtn.textContent = "-";
    decreaseBtn.onclick = function () {
        let currentValue = parseInt(counterValue.value);
        if (currentValue > 0) {
            counterValue.value = currentValue - 1;
            saveCounters();
        }
    };

    // Reset button
    const resetBtn = document.createElement("button");
    resetBtn.textContent = "↺";
    resetBtn.classList.add("reset");
    resetBtn.onclick = function () {
        counterValue.value = "0";
        saveCounters();
    };

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.classList.add("remove");
    removeBtn.onclick = function () {
        content.removeChild(counterDiv);
        saveCounters();
    };

    // Append elements
    counterControls.appendChild(decreaseBtn);
    counterControls.appendChild(counterValue);
    counterControls.appendChild(increaseBtn);
    counterControls.appendChild(resetBtn);
    counterControls.appendChild(removeBtn);

    counterDiv.appendChild(counterName);
    counterDiv.appendChild(counterControls);

    content.appendChild(counterDiv);

    saveCounters();
}

// Save counters to localStorage
function saveCounters() {
    let counters = [];
    document.querySelectorAll(".counter").forEach(counter => {
        counters.push({
            name: counter.querySelector(".counter-name").value,
            value: counter.querySelector(".counter-value").value
        });
    });
    localStorage.setItem("counters", JSON.stringify(counters));
}

// Load counters from localStorage
function loadCounters() {
    let counters = JSON.parse(localStorage.getItem("counters")) || [];
    if (counters.length === 0) {
        addNewCounter();
    } else {
        counters.forEach(() => addNewCounter());
    }
}

// Hard Reset with Confirmation
function resetApp() {
    if (confirm("Are you sure you want to reset all counters?")) {
        localStorage.removeItem("counters");
        document.getElementById("content").innerHTML = "";
        addNewCounter();
    }
}