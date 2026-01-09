// Print & Export Utilities for EGP Currency
class PrintExportUtils {
  constructor() {
    this.currency = 'EGP';
    this.currencySymbol = 'ج.م';
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  }

  printReceipt(saleData, printType = 'normal') {
    const printWindow = window.open('', '', 'height=400,width=600');
    const receipt = this.generateReceipt(saleData, printType);
    printWindow.document.write(receipt);
    printWindow.document.close();
    printWindow.print();
  }

  generateReceipt(saleData, printType) {
    const { items, total, tax, final, timestamp, receiptNumber } = saleData;
    const date = new Date(timestamp).toLocaleDateString('ar-EG');
    const time = new Date(timestamp).toLocaleTimeString('ar-EG');

    let html = `
      <html><head><meta charset='UTF-8'>
      <style>
        body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 0; padding: 0; }
        .receipt { width: ${printType === 'thermal' ? '80mm' : '210mm'}; margin: 20px auto; padding: 20px; border: 1px solid #ccc; }
        .header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 20px; padding-bottom: 10px; }
        .header h2 { margin: 0; font-size: ${printType === 'thermal' ? '16px' : '24px'}; }
        .header p { margin: 5px 0; font-size: 12px; }
        .items { margin: 20px 0; }
        .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #999; font-size: ${printType === 'thermal' ? '11px' : '13px'}; }
        .total-section { margin: 20px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 10px 0; }
        .total-line { display: flex; justify-content: space-between; font-weight: bold; margin: 5px 0; }
        .footer { text-align: center; font-size: 11px; margin-top: 20px; padding-top: 10px; border-top: 1px dotted #999; }
        @media print { body { margin: 0; padding: 0; } .receipt { border: none; margin: 0; } }
      </style>
      </head><body>
      <div class='receipt'>
        <div class='header'>
          <h2>المهندس للمبيعات</h2>
          <p>رقم الفاتورة: ${receiptNumber}</p>
          <p>التاريخ: ${date}</p>
          <p>الوقت: ${time}</p>
        </div>
        <div class='items'>
    `;

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      html += `
        <div class='item'>
          <span>${this.formatCurrency(itemTotal)}</span>
          <span>x${item.quantity}</span>
          <span>${this.formatCurrency(item.price)}</span>
          <span>${item.name}</span>
        </div>
      `;
    });

    html += `
        </div>
        <div class='total-section'>
          <div class='total-line'>
            <span>${this.formatCurrency(final)}</span>
            <span>المجموع النهائي</span>
          </div>
          <div class='total-line'>
            <span>${this.formatCurrency(tax)}</span>
            <span>الضريبة (14%)</span>
          </div>
          <div class='total-line'>
            <span>${this.formatCurrency(total)}</span>
            <span>الإجمالي</span>
          </div>
        </div>
        <div class='footer'>
          <p>شكرا لتعاملكم معنا</p>
          <p>من طلبا قواعدها البيانات حفظها للموافقتون</p>
        </div>
      </div>
      </body></html>
    `;
    return html;
  }

  exportToCSV(data, filename = 'export.csv') {
    let csv = 'الاسم,السعر,الكمية,الإجمالي\n';
    data.forEach(item => {
      csv += `${item.name},${item.price},${item.quantity},${item.price * item.quantity}\n`;
    });
    this.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
  }

  exportToJSON(data, filename = 'export.json') {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json;charset=utf-8;');
  }

  exportToExcel(data, filename = 'export.xlsx') {
    let html = `<table><tr><th>الاسم</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th></tr>`;
    data.forEach(item => {
      html += `<tr><td>${item.name}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.price * item.quantity}</td></tr>`;
    });
    html += '</table>';
    const uri = 'data:application/vnd.ms-excel;base64,' + btoa(html);
    const link = document.createElement('a');
    link.href = uri;
    link.download = filename;
    link.click();
  }

  downloadFile(content, filename, contentType) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + contentType + ',;base64,' + btoa(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  printThermal(saleData) {
    this.printReceipt(saleData, 'thermal');
  }

  printNormal(saleData) {
    this.printReceipt(saleData, 'normal');
  }
}

const printExport = new PrintExportUtils();
console.log('طباعة وتصدير جاهز');
