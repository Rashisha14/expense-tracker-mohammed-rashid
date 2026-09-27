let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let editingId = null;


// Elements

const form = document.getElementById("transactionForm");

const typeInput = document.getElementById("type");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const transactionList =
    document.getElementById("transactionList");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const balance =
    document.getElementById("balance");

const filterType =
    document.getElementById("filterType");

const filterCategory =
    document.getElementById("filterCategory");

const submitButton =
    document.getElementById("submitButton");

const cancelButton =
    document.getElementById("cancelButton");

const formTitle =
    document.getElementById("formTitle");

const monthlySummary =
    document.getElementById("monthlySummary");

const formMessage =
    document.getElementById("formMessage");


// Set today's date

dateInput.value =
    new Date().toISOString().split("T")[0];


// Save data

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Add / Edit transaction

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const amount = Number(amountInput.value);

    if (!Number.isFinite(amount) || amount <= 0) {
        showValidationError(amountInput, "Enter an amount greater than zero.");
        return;
    }

    if (!categoryInput.value) {
        showValidationError(categoryInput, "Choose a category for this transaction.");
        return;
    }

    if (!dateInput.value || Number.isNaN(Date.parse(dateInput.value))) {
        showValidationError(dateInput, "Choose a valid transaction date.");
        return;
    }

    if (!descriptionInput.value.trim()) {
        showValidationError(descriptionInput, "Add a short description for this transaction.");
        return;
    }

    clearValidation();

    const transactionData = {

        type: typeInput.value,

        amount: amount,

        category: categoryInput.value,

        date: dateInput.value,

        description: descriptionInput.value.trim()

    };


    // Edit

    if (editingId !== null) {

        transactions = transactions.map(transaction => {

            if (transaction.id === editingId) {

                return {
                    ...transaction,
                    ...transactionData
                };

            }

            return transaction;

        });

        editingId = null;

        submitButton.textContent = "Add Transaction";

        formTitle.textContent = "Add Transaction";

        cancelButton.classList.add("hidden");

    }

    // Add

    else {

        transactions.push({

            id: Date.now(),

            ...transactionData

        });

    }


    saveTransactions();

    form.reset();

    dateInput.value =
        new Date().toISOString().split("T")[0];

    render();

});


// Display transactions

function render() {

    updateSummary();

    renderTransactions();

    renderMonthlySummary();

}


// Update income, expense and balance

function updateSummary() {

    let income = 0;
    let expense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });


    const currentBalance = income - expense;


    totalIncome.textContent =
        formatCurrency(income);

    totalExpense.textContent =
        formatCurrency(expense);

    balance.textContent =
        formatCurrency(currentBalance);

}


// Format money

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-IN", {

        style: "currency",

        currency: "INR"

    }).format(amount);

}


// Render transaction list

function renderTransactions() {

    const typeFilter = filterType.value;

    const categoryFilter = filterCategory.value;


    let filteredTransactions =
        transactions.filter(transaction => {

            const typeMatch =
                typeFilter === "all" ||
                transaction.type === typeFilter;

            const categoryMatch =
                categoryFilter === "all" ||
                transaction.category === categoryFilter;

            return typeMatch && categoryMatch;

        });


    // Latest first

    filteredTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );


    if (filteredTransactions.length === 0) {

        transactionList.innerHTML = `
            <div class="empty">
                No transactions found.
            </div>
        `;

        return;

    }


    transactionList.innerHTML =
        filteredTransactions.map(transaction => {

            const sign =
                transaction.type === "income" ? "+" : "-";

            return `

                <div class="transaction">

                    <div class="transaction-info">

                        <h3>
                            ${escapeHTML(transaction.description)}
                        </h3>

                        <p>
                            ${transaction.category}
                            •
                            ${transaction.date}
                        </p>

                    </div>


                    <div class="transaction-right">

                        <div class="transaction-amount ${transaction.type}">
                            ${sign}${formatCurrency(transaction.amount)}
                        </div>


                        <div class="actions">

                            <button
                                class="edit-btn"
                                onclick="editTransaction(${transaction.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-btn"
                                onclick="deleteTransaction(${transaction.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

}


// Edit transaction

function editTransaction(id) {

    const transaction =
        transactions.find(item => item.id === id);

    if (!transaction) return;

    clearValidation();


    typeInput.value = transaction.type;

    amountInput.value = transaction.amount;

    categoryInput.value = transaction.category;

    dateInput.value = transaction.date;

    descriptionInput.value = transaction.description;


    editingId = id;


    formTitle.textContent = "Edit Transaction";

    submitButton.textContent = "Update Transaction";

    cancelButton.classList.remove("hidden");


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// Cancel edit

cancelButton.addEventListener("click", function () {

    editingId = null;

    clearValidation();

    form.reset();

    dateInput.value =
        new Date().toISOString().split("T")[0];

    formTitle.textContent = "Add Transaction";

    submitButton.textContent = "Add Transaction";

    cancelButton.classList.add("hidden");

});


// Delete

function deleteTransaction(id) {

    const confirmed =
        confirm("Are you sure you want to delete this transaction?");

    if (!confirmed) return;


    transactions =
        transactions.filter(transaction =>
            transaction.id !== id
        );


    saveTransactions();

    render();

}


// Filters

filterType.addEventListener(
    "change",
    renderTransactions
);

filterCategory.addEventListener(
    "change",
    renderTransactions
);


// Monthly summary

function renderMonthlySummary() {

    const monthlyData = {};


    transactions.forEach(transaction => {

        if (transaction.type !== "expense" || !/^\d{4}-\d{2}/.test(transaction.date)) {
            return;
        }

        const month = transaction.date.substring(0, 7);


        if (!monthlyData[month]) {

            monthlyData[month] = {

                expense: 0,

                categories: {}

            };

        }
        monthlyData[month].expense += transaction.amount;
        monthlyData[month].categories[transaction.category] =
            (monthlyData[month].categories[transaction.category] || 0) + transaction.amount;

    });


    const months =
        Object.keys(monthlyData).sort().reverse();


    if (months.length === 0) {

        monthlySummary.innerHTML =
            `<p class="empty">No expense data available yet.</p>`;

        return;

    }


    monthlySummary.innerHTML =
        months.map(month => {

            const data =
                monthlyData[month];

            const categoryRows = Object.entries(data.categories)
                .sort((first, second) => second[1] - first[1])
                .map(([category, amount]) => {
                    const percentage = amount / data.expense * 100;

                    return `
                        <div class="category-row">
                            <span class="category-name">${escapeHTML(category)}</span>
                            <div class="category-track" role="img" aria-label="${percentage.toFixed(1)}% of monthly expenses">
                                <span style="width: ${percentage}%"></span>
                            </div>
                            <span class="category-amount">${formatCurrency(amount)}</span>
                        </div>
                    `;
                }).join("");


            return `

                <div class="month-row">

                    <div class="month-heading">
                        <strong>${escapeHTML(month)}</strong>
                        <strong>${formatCurrency(data.expense)}</strong>
                    </div>
                    <div class="category-chart">
                        ${categoryRows}
                    </div>

                </div>

            `;

        }).join("");

}


// Basic HTML escaping

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


function showValidationError(input, message) {

    clearValidation();
    input.classList.add("validation-error");
    input.setAttribute("aria-invalid", "true");
    formMessage.textContent = message;
    input.focus();

}


function clearValidation() {

    form.querySelectorAll(".validation-error").forEach(input => {
        input.classList.remove("validation-error");
        input.removeAttribute("aria-invalid");
    });

    formMessage.textContent = "";

}


form.addEventListener("input", function (event) {

    if (event.target.classList.contains("validation-error")) {
        event.target.classList.remove("validation-error");
        event.target.removeAttribute("aria-invalid");
        formMessage.textContent = "";
    }

});


// Initial render

render();