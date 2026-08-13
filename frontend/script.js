const API_URL = 'http://localhost:3000/users';

const apiUrlEl = document.getElementById('apiUrl');
const form = document.getElementById('userForm');
const mensagemEl = document.getElementById('mensagem');
const tableBody = document.getElementById('usersTableBody');

apiUrlEl.textContent = API_URL;

function mostrarMensagem(texto) {
  mensagemEl.textContent = texto;
}

async function listarUsuarios() {
  const resposta = await fetch(API_URL);
  const usuarios = await resposta.json();
  renderizarTabela(usuarios);
}

function renderizarTabela(usuarios) {
  tableBody.innerHTML = '';

  usuarios.forEach((usuario) => {
    const linha = document.createElement('tr');

    const colunaNome = document.createElement('td');
    colunaNome.textContent = usuario.nome;

    const colunaEmail = document.createElement('td');
    colunaEmail.textContent = usuario.email;

    const colunaAcoes = document.createElement('td');

    const botaoVer = document.createElement('button');
    botaoVer.textContent = 'Ver';
    botaoVer.addEventListener('click', () => verUsuario(usuario.id));

    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.className = 'btn-excluir';
    botaoExcluir.addEventListener('click', () => excluirUsuario(usuario.id));

    colunaAcoes.appendChild(botaoVer);
    colunaAcoes.appendChild(botaoExcluir);

    linha.appendChild(colunaNome);
    linha.appendChild(colunaEmail);
    linha.appendChild(colunaAcoes);

    tableBody.appendChild(linha);
  });
}

async function verUsuario(id) {
  const resposta = await fetch(`${API_URL}/${id}`);
  if (!resposta.ok) {
    mostrarMensagem('Usuário não encontrado.');
    return;
  }
  const usuario = await resposta.json();
  mostrarMensagem(`Usuário: ${usuario.nome} (${usuario.email})`);
}

async function excluirUsuario(id) {
  const resposta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (resposta.ok) {
    mostrarMensagem('Usuário excluído.');
    listarUsuarios();
  } else {
    mostrarMensagem('Erro ao excluir usuário.');
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  const resposta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email }),
  });

  if (resposta.ok) {
    mostrarMensagem('Usuário cadastrado com sucesso.');
    form.reset();
    listarUsuarios();
  } else {
    mostrarMensagem('Erro ao cadastrar usuário. Verifique os dados.');
  }
});

listarUsuarios();
