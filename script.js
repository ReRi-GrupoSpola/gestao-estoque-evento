const estoque = [
  {nome: "Detergente Líquido Neutro", marca: "D'Visão", qtd: 22, minimo: 10, img: "https://source.unsplash.com/featured/?cleaning"},
  {nome: "Sabonete Líquido Antisséptico", marca: "Premisse", qtd: 20, minimo: 5, img: "https://source.unsplash.com/featured/?soap"},
  {nome: "Álcool Líquido 70%", marca: "Clarity", qtd: 20, minimo: 8, img: "https://source.unsplash.com/featured/?alcohol"},
  {nome: "Pulverizador 500ML", marca: "Nobre", qtd: 50, minimo: 20, img: "https://source.unsplash.com/featured/?spray"},
  {nome: "Pano Multiuso Azul", marca: "Vabene", qtd: 39, minimo: 15, img: "https://source.unsplash.com/featured/?cloth"},
];

const history = [];

const productSelect = document.getElementById('productSelect');
const productDetails = document.getElementById('product-details');
const historyTable = document.getElementById('historyTable');

estoque.forEach((p, i) => {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = p.nome;
  productSelect.appendChild(option);
});

function renderProduct(index) {
  const p = estoque[index];
  productDetails.innerHTML = `
    <figure>
      <img src="${p.img}" alt="Imagem de ${p.nome}">
      <figcaption><a href="${p.img}" target="_blank">Ver imagem maior</a></figcaption>
    </figure>
    <div class="${p.qtd <= p.minimo ? 'low-stock' : ''}">
      <h3>${p.nome} ${p.qtd <= p.minimo ? '<span class="warning-icon">⚠️ Estoque Baixo</span>' : ''}</h3>
      <p><strong>Marca:</strong> ${p.marca}</p>
      <p><strong>Quantidade em Estoque:</strong> ${p.qtd}</p>
    </div>
  `;
}

productSelect.addEventListener('change', (e) => {
  renderProduct(e.target.value);
});

productSelect.value = 0;
renderProduct(0);

function updateStock(tipo) {
  const index = productSelect.value;
  const quantidade = parseInt(prompt(`Quantidade para ${tipo}:`));
  if (isNaN(quantidade) || quantidade <= 0) return alert('Quantidade inválida!');
  if (tipo === 'saida' && estoque[index].qtd < quantidade) return alert('Quantidade insuficiente em estoque!');
  estoque[index].qtd += (tipo === 'entrada' ? quantidade : -quantidade);
  renderProduct(index);

  history.push({
    produto: estoque[index].nome,
    tipo,
    quantidade,
    data: new Date().toLocaleString()
  });

  renderHistory();
}

function renderHistory() {
  historyTable.innerHTML = "";
  history.forEach(mov => {
    const row = `<tr><td>${mov.produto}</td><td>${mov.tipo}</td><td>${mov.quantidade}</td><td>${mov.data}</td></tr>`;
    historyTable.innerHTML += row;
  });
}

document.getElementById('exportExcel').addEventListener('click', () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(estoque.map(p => ({ Produto: p.nome, Marca: p.marca, Quantidade: p.qtd })));
  XLSX.utils.book_append_sheet(wb, ws, 'Estoque');
  XLSX.writeFile(wb, 'estoque_evento.xlsx');
});

document.getElementById('exportPDF').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Estoque Evento', 10, 10);
  estoque.forEach((p, i) => {
    doc.text(`${p.nome} - ${p.marca}: ${p.qtd} unidades`, 10, 20 + (i * 10));
  });
  doc.save('estoque_evento.pdf');
});
