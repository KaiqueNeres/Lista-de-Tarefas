const tarefasForm = document.querySelector("#tarefas-form");
const tarefasIput = document.querySelector("#tarefas-input");
const tarefasLista = document.querySelector("#lista-tarefas");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");

const searchInput = document.querySelector("#search-input");
const earseBtn = document.querySelector("#earse-button");
const filterBtn = document.querySelector("#selecionar-filtro");



let oldInputValue;


// Funções
// Adicionar tarefa
const salvarTarefa =(text, feito = 0, salvar = 1 ) =>{

    const tarefa = document.createElement("div");
    tarefa.classList.add("tarefas");

    const tarefaTitle = document.createElement("h3");
    tarefaTitle.innerText = text;
    tarefa.appendChild(tarefaTitle);
    
    const feitoBtn = document.createElement("button");
    feitoBtn.classList.add("terminar-tarefa") ;
    feitoBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    tarefa.appendChild(feitoBtn);

    const editarBtn = document.createElement("button");
    editarBtn.classList.add("editar-tarefa") ;
    editarBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    tarefa.appendChild(editarBtn);

    const removerBtn = document.createElement("button");
    removerBtn.classList.add("remover-tarefa") ;
    removerBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    tarefa.appendChild(removerBtn);

    // Utilizando dados da Local Storage
    // Salvando no local Storage quando criado uma nova tarefa

    if(feito) {
        tarefa.classList.add("feito");
    };

    if(salvar) {
        salvarTarefaLocalStorage({text, feito})
    };

    tarefasLista.appendChild(tarefa);

    tarefasIput.value = "";
    tarefasIput.focus();
};

//Cancelar a edição de tarefa
const toggleForms = () =>{
    editForm.classList.toggle("esconder");
    tarefasForm.classList.toggle("esconder");
    tarefasLista.classList.toggle("esconder");

};

// Alterar a tarefa
const atualizarTarefa = (text) => {
    
    const tarefas = document.querySelectorAll(".tarefas");

    tarefas.forEach((tarefas) => {

        let tituloTarefa = tarefas.querySelector("h3");

        if(tituloTarefa.innerText === oldInputValue) {
            tituloTarefa.innerText = text;

            atualizarTarefaLocalStorage(oldInputValue, text);
        }
    });
}

// Função para buscar uma tarefa
const getSearchTarefa = (search) =>{
    
    const tarefas = document.querySelectorAll(".tarefas");

    tarefas.forEach((tarefas) => {

        let tituloTarefa = tarefas.querySelector("h3").innerText.toLowerCase();

        const normalizedSearch = search.toLowerCase();

        tarefas.style.display = "flex"

        if(!tituloTarefa.includes(normalizedSearch)){
            tarefas.style.display = "none"
        }
    });
}

// Filtrar tarefas
const filtrarTarefas = (filterValue) =>{

    const tarefas = document.querySelectorAll(".tarefas");

    switch(filterValue){
        case "todas":
            tarefas.forEach((tarefa) => tarefa.style.display = "flex");
            break;

        case "feitas":
        tarefas.forEach((tarefa) => tarefa.classList.contains("feito")
            ? (tarefa.style.display = "flex")
            : (tarefa.style.display = "none")
        );
        break;

        case "fazer":
            tarefas.forEach((tarefa) => !tarefa.classList.contains("feito")
                ? (tarefa.style.display = "flex")
                : (tarefa.style.display = "none")
            );
            break;

        default:
            break;
    }
};

// Eventos

// Adicionar nova tarefa
tarefasForm.addEventListener("submit", (e) =>{
    e.preventDefault();

    const inputValue = tarefasIput.value;

    if(inputValue){
        salvarTarefa(inputValue);
    }
});

// Btns da tarefa

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");

    let tituloTarefa;

    if(parentEl && parentEl.querySelector("h3")){
        tituloTarefa = parentEl.querySelector("h3").innerText;

    }


    // Finalizar a tarefa
    if(targetEl.classList.contains("terminar-tarefa")){
        parentEl.classList.toggle("feito");

        atualizarStatusTarefaLocalStorage(tituloTarefa);
    }

    //Remover tarefa
    if(targetEl.classList.contains("remover-tarefa")){
        parentEl.remove();

        removerTarefaLocalStorage(tituloTarefa);
    }

    // Editar tarefa
    if(targetEl.classList.contains("editar-tarefa")){
        toggleForms();

        //Salvar titulo inicial da tarefa
        editInput.value = tituloTarefa;
        oldInputValue = tituloTarefa;
        
    }
})

// cancelar edição da tarefa
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
})


//Salvar edição da tarefa
editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value;

    if(editInputValue){
        atualizarTarefa(editInputValue);
    }

    toggleForms();
})

// Buscar tarefas
searchInput.addEventListener("keyup", (e) =>{

    const search = e.target.value;

    getSearchTarefa(search);
})


// Apagar campo de buscar
earseBtn.addEventListener("click", (e) => {

    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
})


// Filtrar tarefa
filterBtn.addEventListener("change", (e) => {

    const filterValue = e.target.value;

    filtrarTarefas(filterValue);
})


// Local Storage

const getTarefasLocalStorage = () => {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

    return tarefas;
};


// Carregar tarefas salvas no local storage
const loadTarefas = () => {

    const tarefas = getTarefasLocalStorage();

    tarefas.forEach((tarefa) =>{
        salvarTarefa(tarefa.text, tarefa.feito, 0);
    })

}

// Salvar tarefa no local storage
const salvarTarefaLocalStorage = (tarefa) => {

    //todas as tarefas do local storage
    const tarefas = getTarefasLocalStorage();
    
    // add a nova tarefa no array
    tarefas.push(tarefa);

    // salvar tudo no local storage
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

}

// Removar tarefa no local storage
const removerTarefaLocalStorage = (tarefaText) => {
    const tarefas = getTarefasLocalStorage();

    const filteredTarefas = tarefas.filter((tarefa) => tarefa.text !== tarefaText);

    localStorage.setItem("tarefas", JSON.stringify(filteredTarefas));
}


// Salvar status da tarefa no local storage
const atualizarStatusTarefaLocalStorage = (tarefaText) => {

    const tarefas = getTarefasLocalStorage();

    tarefas.map((tarefa) => tarefa.text === tarefaText
    ?  tarefa.feito = !tarefa.feito
    :  null
    );

    localStorage.setItem("tarefas", JSON.stringify(tarefas));

};

// Salvar no local storage a alteração do texto da tarefa
const atualizarTarefaLocalStorage = (tarefaOldText, tarefaNewText) => {

    const tarefas = getTarefasLocalStorage();

    tarefas.map((tarefa) => tarefa.text === tarefaOldText
    ?  tarefa.text = tarefaNewText
    :  null
    );

    localStorage.setItem("tarefas", JSON.stringify(tarefas));

};


loadTarefas();
