// elementos principais
const ftList = document.getElementById('ft_list');
const btnAdicionar = document.getElementById('btn-adicionar');

// roda a lista salva depois que recarrega a página
window.addEventListener('DOMContentLoaded', carregarTarefasDoCookie);


btnAdicionar.addEventListener('click', () => {
    // janela de prompt
    const textoTarefa = prompt("Digite a nova tarefa:");

    // verifica se o campo não está vazio
    if (textoTarefa && textoTarefa.trim() !== "") {
        adicionarTarefaNaTela(textoTarefa.trim());
        salvarTarefasNoCookie(); // Atualiza o armazenamento após criar
    }
});


function adicionarTarefaNaTela(texto) {
    // Cria a div da TAREFA
    const novaTarefa = document.createElement('div');
    novaTarefa.className = 'todo-item';
    novaTarefa.textContent = texto;

    //  Clique para remover a tarefa 
    novaTarefa.addEventListener('click', () => {
        // Abre a janela de configuração perguntando se deseja remover
        const confirmarExclusao = confirm(`Deseja remover a tarefa: "${texto}"?`);
        
        if (confirmarExclusao) {
            novaTarefa.remove(); // Remove permanentemente 
            salvarTarefasNoCookie(); // Atualiza o armazenamento após deletar
        }
    });

    
    // Deixa o item sempre no topo
    ftList.insertBefore(novaTarefa, ftList.firstChild);
}


function salvarTarefasNoCookie() {
    const itens = [];
    const elementosTarefas = ftList.querySelectorAll('.todo-item');
    
    
    elementosTarefas.forEach(elemento => {
        itens.push(elemento.textContent);
    });

    
    const jsonString = JSON.stringify(itens);
    
    // Configura e salva no Cookie 
    const dataExpiracao = new Date();
    dataExpiracao.setTime(dataExpiracao.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = `listaTarefas=${encodeURIComponent(jsonString)}; expires=${dataExpiracao.toUTCString()}; path=/`;

    
    // Isso evita que o navegador apague os dados caso o arquivo seja aberto localmente sem servidor
    localStorage.setItem('listaTarefasBackup', jsonString);
}


function carregarTarefasDoCookie() {
    const nomeCookie = "listaTarefas=";
    const cookiesDecodificados = decodeURIComponent(document.cookie);
    const listaCookies = cookiesDecodificados.split(';');
    let cookieValor = "";

    // Tenta encontrar o Cookie correto dentro do navegador
    for (let i = 0; i < listaCookies.length; i++) {
        let c = listaCookies[i].trim();
        if (c.indexOf(nomeCookie) === 0) {
            cookieValor = c.substring(nomeCookie.length, c.length);
            break;
        }
    }

    let itens = [];

    // Se o cookie tiver dados válidos, carrega dele
    if (cookieValor !== "") {
        itens = JSON.parse(cookieValor);
    } else {
        // Se o cookie não existir (por restrição de arquivo local), usa o backup de segurança
        const backup = localStorage.getItem('listaTarefasBackup');
        if (backup) {
            itens = JSON.parse(backup);
        }
    }

    // Se houver qualquer tarefa salva nos históricos, recria no DOM
    if (itens.length > 0) {
        
        // Invertendo aqui, as tarefas recarregam exatamente no mesmo topo/ordem que estavam.
        itens.reverse().forEach(texto => {
            adicionarTarefaNaTela(texto);
        });
    }
}
