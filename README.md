# Expense Tracker

A simple and responsive **Expense Tracker web application** built using **HTML, CSS, and JavaScript**.

It allows users to manage income and expenses, view their balance, filter transactions, and see a monthly expense summary. Transaction data is stored locally in the browser using **Local Storage**.

## Features

* Add income and expense transactions
* Enter amount, category, date, and description
* Edit existing transactions
* Delete transactions
* View:

  * Total Income
  * Total Expenses
  * Current Balance
* Filter transactions by type and category
* Monthly expense summary by category
* Indian Rupee (₹) currency formatting
* Form validation
* Responsive design for mobile and desktop
* Data persistence using browser Local Storage

## Technologies Used

* **HTML5**
* **CSS3**
* **JavaScript (ES6)**
* **Local Storage API**

## Project Structure

```text
expense-tracker/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to Run

### Option 1: Open Directly

1. Download or clone this repository.
2. Make sure `index.html`, `style.css`, and `script.js` are in the same folder.
3. Open `index.html` in any modern web browser.

### Option 2: Using VS Code

1. Open the project folder in **Visual Studio Code**.
2. Open `index.html`.
3. Use the **Live Server** extension to launch the application.
4. The Expense Tracker will open in your browser.

No backend or database setup is required.

## Data Storage

Transactions are saved in the browser's **Local Storage**, so your data remains available after refreshing or reopening the page in the same browser.

Clearing the browser's site data/local storage will remove the saved transactions.

## Currency

The application uses **Indian Rupees (INR)** for displaying transaction amounts.

## Categories

The application supports categories such as:

* Food
* Transport
* Shopping
* Bills
* Entertainment
* Salary
* Other

## Monthly Summary

The application groups expense transactions by month and displays spending by category, making it easier to understand monthly spending patterns.
