document.addEventListener("DOMContentLoaded", () => {
    const counterContainer = document.getElementById("counterContainer");
    const addCounterButton = document.getElementById("addCounter");
    const resetButton = document.getElementById("resetButton");
    const totalValue = document.getElementById("totalValue");

    let counters = JSON.parse(localStorage.getItem("counters")) || [{ name: "New Counter", value: 0 }];

    function saveState() {
        localStorage.setItem("counters", JSON.stringify(counters));
    }

    function updateTotal() {
        const total = counters.reduce((sum, counter) => sum + counter.value, 0);
        totalValue.textContent = total;
    }

    function renderCounters() {
        counterContainer.innerHTML = "";
        counters.forEach((counter, index) => {
            const counterDiv = document.createElement("div");
            counterDiv.className = "counter";

            // Editable Name
            const nameInput = document.createElement("input");
            nameInput.className = "counter-name";
            nameInput.value = counter.name;
            nameInput.addEventListener("input", () => {
                counters[index].name = nameInput.value;
                saveState();
            });

            // Counter Controls
            const controls = document.createElement("div");
            controls.className = "counter-controls";

            // Decrease Button
            const decreaseBtn = document.createElement("button");
            decreaseBtn.className = "counter-btn";
            decreaseBtn.textContent = "-";
            decreaseBtn.onclick = () => {
                counters[index].value--;
                updateTotal();
                saveState();
                renderCounters();
            };

            // Counter Value (Editable)
            const valueInput = document.createElement("input");
            valueInput.className = "counter-value";
            valueInput.type = "number";
            valueInput.value = counter.value;
            valueInput.addEventListener("change", () => {
                counters[index].value = parseInt(valueInput.value) || 0;
                updateTotal();
                saveState();
            });

            // Increase Button
            const increaseBtn = document.createElement("button");
            increaseBtn.className = "counter-btn";
            increaseBtn.textContent = "+";
            increaseBtn.onclick = () => {
                counters[index].value++;
                updateTotal();
                saveState();
                renderCounters();
            };

            // Reset Counter Button
            const resetBtn = document.createElement("button");
            resetBtn.className = "reset-btn";
            resetBtn.textContent = "↺";
            resetBtn.onclick = () => {
                counters[index].value = 0;
                updateTotal();
                saveState();
                renderCounters();
            };

            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "X";
            deleteBtn.onclick = () => {
                counters.splice(index, 1);
                if (counters.length === 0) {
                    counters.push({ name: "New Counter", value: 0 });
                }
                updateTotal();
                saveState();
                renderCounters();
            };

            // Add Elements to Counter
            controls.append(decreaseBtn, valueInput, increaseBtn, resetBtn, deleteBtn);
            counterDiv.append(nameInput, controls);
            counterContainer.appendChild(counterDiv);
        });

        updateTotal();
    }

    // Add Counter
    addCounterButton.onclick = () => {
        counters.push({ name: "New Counter", value: 0 });
        saveState();
        renderCounters();
    };

    // Reset App (With Confirmation)
    resetButton.onclick = () => {
        if (confirm("Are you sure you want to reset everything?")) {
            counters = [{ name: "New Counter", value: 0 }];
            saveState();
            renderCounters();
        }
    };

    renderCounters();
});