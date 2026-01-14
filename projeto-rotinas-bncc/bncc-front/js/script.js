const form = document.getElementById("formRotina");
const resultado = document.getElementById("resultado");
const detalhesRotina = document.getElementById("detalhesRotina");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const ano = document.getElementById("ano").value;
  const bimestre = document.getElementById("bimestre").value;
  const semana = document.getElementById("semana").value;

  try {
    const res = await fetch("http://localhost:5000/api/rotinas/gerar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ano, bimestre, semana }),
    });

    const data = await res.json();
    mostrarRotina(data);
  } catch (error) {
    alert("Erro ao gerar rotina.");
    console.error(error);
  }
});

function mostrarRotina(rotina) {
  resultado.style.display = "block";
  detalhesRotina.innerHTML = `
    <p><strong>Ano:</strong> ${rotina.ano}</p>
    <p><strong>Bimestre:</strong> ${rotina.bimestre}º</p>
    <p><strong>Semana:</strong> ${rotina.semana}</p>
    <h3>🧠 Habilidades:</h3>
    ${rotina.habilidades.map(h => `
      <div class="habilidade-card">
        <strong>${h.codigo}</strong> - ${h.descricao}
      </div>
    `).join("")}
  `;
}
