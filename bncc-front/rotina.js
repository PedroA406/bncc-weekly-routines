const form = document.getElementById('formRotina');
const statusArea = document.getElementById('statusArea');
const loader = document.getElementById('loader');
const cards = document.getElementById('cards');
const listaHabilidades = document.getElementById('listaHabilidades');
const objetoEl = document.getElementById('objeto');
const metodologiaEl = document.getElementById('metodologia');
const recursosEl = document.getElementById('recursos');
const avaliacaoEl = document.getElementById('avaliacao');
const btnGerar = document.getElementById('btnGerar');
const btnLimpar = document.getElementById('btnLimpar');
const btnPDF = document.getElementById('btnPDF');

let rotinaAtual = null;

function showLoader(show){ loader.style.display = show ? 'block':'none'; }
function showCards(show){ cards.style.display = show ? 'block':'none'; }

form.addEventListener('submit', async e=>{
  e.preventDefault();
  const ano = Number(document.getElementById('ano').value);
  const bimestre = Number(document.getElementById('bimestre').value);
  const semana = Number(document.getElementById('semana').value);

  if(!ano || !bimestre || !semana){
    statusArea.textContent='Preencha ano, bimestre e semana.';
    return;
  }

  statusArea.textContent='Gerando rotina...';
  showLoader(true);
  showCards(false);
  btnGerar.disabled = true;

  try{
    const res = await fetch('http://localhost:5000/api/rotinas/gerar',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ano,bimestre,semana})
    });

    const data = await res.json();

    if(!res.ok){
      statusArea.textContent = data.message || 'Erro ao gerar rotina.';
      return;
    }

    rotinaAtual = data.rotina || data;

    // Preencher habilidades
    listaHabilidades.innerHTML='';
(rotinaAtual.habilidades||[]).forEach(h=>{
  const li = document.createElement('li');
  li.textContent = (h.codigo ? h.codigo + ' — ' : '') + (h.descricao || h.nome || h);
  listaHabilidades.appendChild(li);
});


    objetoEl.textContent = rotinaAtual.objetivos || '—';
    metodologiaEl.textContent = rotinaAtual.metodologia || '—';
    recursosEl.textContent = rotinaAtual.recursos || '—';
    avaliacaoEl.textContent = rotinaAtual.avaliacao || '—';

    statusArea.textContent='✅ Rotina gerada com sucesso.';
    showCards(true);

  }catch(err){
    console.error(err);
    statusArea.textContent='Erro de conexão ao gerar rotina.';
  }finally{
    showLoader(false);
    btnGerar.disabled=false;
  }
});

btnLimpar.addEventListener('click',()=>{
  document.getElementById('ano').value='';
  document.getElementById('bimestre').value='';
  document.getElementById('semana').value='';
  statusArea.textContent='Campos limpos.';
  showCards(false);
  rotinaAtual = null;
});

document.getElementById("btnPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // pegar dados extras
  const escola = document.getElementById("escola").value || "—";
  const professor = document.getElementById("professor").value || "—";
  const periodo = document.getElementById("periodo").value || "—";

  // 🔵 TÍTULO EM NEGRITO
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Rotina Semanal - BNCC", 105, 15, { align: "center" });

  // volta fonte normal
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Escola: ${escola}`, 14, 30);
  doc.text(`Professor: ${professor}`, 14, 38);
  doc.text(`Período: ${periodo}`, 14, 46);

  // linha
  doc.setLineWidth(0.5);
  doc.line(10, 52, 200, 52);

  let y = 65;

  // 🔵 SEÇÃO: HABILIDADES (TÍTULO EM NEGRITO)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Habilidades:", 14, y);
  y += 8;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(12);

  const habilidades = Array.from(document.querySelectorAll("#listaHabilidades li"))
        .map(li => li.textContent.trim());

  habilidades.forEach(hab => {
    const lines = doc.splitTextToSize("- " + hab, 180);
    lines.forEach(line => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 7;
    });
  });

  y += 5;

  // 🔵 OUTRAS SEÇÕES (TÍTULOS EM NEGRITO)
  const secoes = [
    { titulo: "Objeto", id: "objeto" },
    { titulo: "Metodologia", id: "metodologia" },
    { titulo: "Recursos", id: "recursos" },
    { titulo: "Avaliação", id: "avaliacao" }
  ];

  secoes.forEach(sec => {

    if (y > 250) { doc.addPage(); y = 20; }

    // TITULO EM NEGRITO
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`${sec.titulo}:`, 14, y);
    y += 8;

    // texto normal
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    const texto = document.getElementById(sec.id).textContent.trim();
    const lines = doc.splitTextToSize(texto, 180);

    lines.forEach(line => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 7;
    });

    y += 5;
  });

  // salvar
  doc.save("rotina_bncc.pdf");
});


