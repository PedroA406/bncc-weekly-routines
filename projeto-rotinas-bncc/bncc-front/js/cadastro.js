const form = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      mensagem.textContent = "Cadastro realizado com sucesso! Redirecionando...";
      mensagem.style.color = "#4cc9f0";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } else {
      mensagem.textContent = data.message || "Erro ao cadastrar.";
      mensagem.style.color = "#ff6b6b";
    }
  } catch (err) {
    mensagem.textContent = "Erro de conexão com o servidor.";
    mensagem.style.color = "#ff6b6b";
  }
});
