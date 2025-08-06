function convertJsonToCsv() {
  const jsonInput = document.getElementById('jsonInput').value.trim();
  const csvOutput = document.getElementById('csvOutput');
  const tableContainer = document.getElementById('tableContainer');

  hideMessage();
  csvOutput.value = '';
  tableContainer.innerHTML = '';

  if (!jsonInput) {
    showMessage('Por favor, insira um JSON.', 'warning');
    return;
  }

  let data;
  try {
    data = JSON.parse(jsonInput);
  } catch (e) {
    showMessage('JSON inválido. Verifique a sintaxe.', 'danger');
    return;
  }

  if (!Array.isArray(data)) {
    showMessage('O JSON deve ser um array de objetos.', 'danger');
    return;
  }

  if (data.length === 0) {
    showMessage('O array JSON está vazio.', 'warning');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const item of data) {
    const row = headers.map(h => escapeCsv(item[h])).join(',');
    csvRows.push(row);
  }

   const csv = csvRows.join('\n');
   csvOutput.value = csv;
   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
   const url = URL.createObjectURL(blob);
   const downloadLink = document.getElementById('downloadLink');
   downloadLink.href = url;
   downloadLink.classList.remove('d-none');


  renderTable(headers, data);
  showMessage('Conversão realizada com sucesso!', 'success');
}

function escapeCsv(value) {
  if (value == null) return '';
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function renderTable(headers, data) {
  const table = document.createElement('table');
  table.className = 'table table-bordered table-striped mt-4';

  const thead = table.createTHead();
  const headRow = thead.insertRow();
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach(item => {
    const row = tbody.insertRow();
    headers.forEach(header => {
      const cell = row.insertCell();
      cell.textContent = item[header] ?? '';
    });
  });

  document.getElementById('tableContainer').appendChild(table);
}

function showMessage(text, type = 'danger') {
  const message = document.getElementById('message');
  message.textContent = text;
  message.className = `alert alert-${type}`;
  message.classList.remove('d-none');
}

function hideMessage() {
  const message = document.getElementById('message');
  message.textContent = '';
  message.className = 'alert d-none';
}

function clearFields() {
  document.getElementById('jsonInput').value = '';
  document.getElementById('csvOutput').value = '';
  document.getElementById('tableContainer').innerHTML = '';
  document.getElementById('downloadLink').classList.add('d-none');
  hideMessage();
}
