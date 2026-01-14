const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      mensagem.textContent = "Login realizado com sucesso!";
      mensagem.style.color = "#4cc9f0";
      localStorage.setItem("token", data.token);
      localStorage.setItem("nomeUsuario", data.nome);
      setTimeout(() => {
        window.location.href = "index.html"; // redireciona para o dashboard
      }, 1000);
    } else {
      mensagem.textContent = data.message || "Erro ao fazer login.";
      mensagem.style.color = "#ff6b6b";
    }
  } catch (err) {
    mensagem.textContent = "Erro de conexão com o servidor.";
    mensagem.style.color = "#ff6b6b";
  }
});
