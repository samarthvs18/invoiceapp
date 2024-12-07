const invoiceTable = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
const addItemButton = document.getElementById('addItem');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const grandTotalElement = document.getElementById('grandTotal');
const generatePdfButton = document.getElementById('generatePdf');

let subtotal = 0;

// Add event listener to the "Add Item" button to add new rows to the table
addItemButton.addEventListener('click', () => {
  const row = invoiceTable.insertRow();

  row.innerHTML = `
    <td><input type="text" placeholder="Item Name"></td>
    <td><input type="number" min="0" value="1" class="quantity"></td>
    <td><input type="number" min="0" value="0" class="price"></td>
    <td class="lineTotal">0.00</td>
    <td><button class="deleteRow">Delete</button></td>
  `;

  row.querySelector('.quantity').addEventListener('input', updateTotals);
  row.querySelector('.price').addEventListener('input', updateTotals);
  row.querySelector('.deleteRow').addEventListener('click', () => {
    row.remove();
    updateTotals();
  });
});

// Function to update the totals (subtotal, tax, grand total)
function updateTotals() {
  subtotal = 0;

  Array.from(invoiceTable.rows).forEach(row => {
    const quantity = row.querySelector('.quantity').value || 0;
    const price = row.querySelector('.price').value || 0;
    const total = quantity * price;

    row.querySelector('.lineTotal').textContent = total.toFixed(2);
    subtotal += total;
  });

  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  subtotalElement.textContent = subtotal.toFixed(2);
  taxElement.textContent = tax.toFixed(2);
  grandTotalElement.textContent = grandTotal.toFixed(2);
}

// Event listener for the "Generate PDF" button
generatePdfButton.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;

  // Create a new jsPDF instance
  const doc = new jsPDF();

  // Add a title to the PDF
  doc.text("Invoice", 20, 20);

  // Adding table to PDF from HTML table with id "invoiceTable"
  doc.autoTable({
    html: '#invoiceTable', // Use the table with id "invoiceTable"
    startY: 30, // Start the table a bit lower (to avoid overlap with the title)
    theme: 'grid', // Optional: Adds a grid style to the table
  });

  // Save the PDF
  doc.save("invoice.pdf");
});
