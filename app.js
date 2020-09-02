class Despesa {
  constructor(ano,mes,dia,tipo,descricao,valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  //validação de inputs, caso algum deles seja nulo, indefinido ou vazio retorna falso. se não retorna verdadeiro
  validarDados() {
    for (let i in this) {
      if (this[i] == null || this[i] == "" || this[i] == undefined) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    // busca o elemento ID dentro do local storage
    let id = localStorage.getItem("id");

    //se retornar null, cria um elemento ID com value igual a 0
    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    // recebe o ultimo ID do localstorage
    let proximoId = localStorage.getItem("id");
    // retorna o valor do ID convertido em número e soma mais um
    return parseInt(proximoId) + 1;
  }

  // converte o objeto despesa para JSON
  gravar(d) {
    // recebe o valor do ID convertido para numero
    let id = this.getProximoId();

    // converte o objeto do ultimo id para Json e atribui ao parametro d
    localStorage.setItem(id, JSON.stringify(d));

    //adiciona o valor do id
    localStorage.setItem("id", id);
  }

  // retorna os registros de despesas na consulta, convertendo eles para objetos novamente
  recuperarTodosRegistros() {

    // array que ira receber os objetos
    let despesas = Array()
    // recebimento do valor dos id
    let id = localStorage.getItem("id");

    //enquanto i for menor ou igual ao id será acrescido mais 1 à I e em cada volta do laço o JSON será convertido para objeto e jogado no array
    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i))
      if(despesa != null) {
        despesa.id = i
        despesas.push(despesa)
      }
    }
    //retorna o valor do array
    return despesas
  }

  // faz a busca do objeto com base nos dados do objeto em parametro
  pesquisar(despesa){

    // Array que irá encapsular os registros do local storage
    let despesasFiltradas = Array()
    despesasFiltradas = this.recuperarTodosRegistros()

    console.log(despesasFiltradas)

 /* aplicação de filtro ano, filtra o array com registros do local storage (parametro d) e compara com os registros do input (parametro despesa) */
    if(despesa.ano != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
    }

    // filtro de mês
    if(despesa.mes != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
    }


    if(despesa.dia != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
    }


    if(despesa.tipo != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
    }

    // filtro de descricao
    if(despesa.descricao != ''){
      despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
    }

    // filtro de valor
    if(despesa.valor != '') {
      despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
    }    

    return despesasFiltradas

  }

  remover(id){
    localStorage.removeItem(id)
  }

}

//instancia do objeto bd para criação de ID dinamicos para listagem de despesas
let bd = new Bd();

// recebimento dos input pelo metodo getElementById
function cadastrarDespesas() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  // instancia do objeto despesa com parametros recebidos pelos input
  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  //se retornar verdadeiro exibe modal sucesso
  if (despesa.validarDados() == true) {
    // cria o modal success
    let modal_titulo = document.querySelector(".modal-title");
    let modal_body = document.querySelector(".modal-body");
    let modal_button = document.querySelector("#btn-modal");

    modal_titulo.innerHTML = "Sucesso";
    modal_titulo.classList += " text-success";

    modal_body.innerHTML = "Dados cadastrados com sucesso";

    modal_button.innerHTML = "continuar";
    modal_button.classList = "btn btn-success";

    $("#registraModal").modal("show");

    // reseta os campos
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    descricao.value = ''
    valor.value = ''

    //grava a despesa em local storage
    bd.gravar(despesa);
  }
}

//carrega a lista de despesa do localstorage
function carregarListaDespesas(despesas = Array(), filtro = false) {

  if(despesas.length == 0 && filtro == false){
  //atribui ao array despesa o metodo que recupera a lista de despesas
  despesas =  bd.recuperarTodosRegistros();
  }

  //Selecionando o Tbody da tabela
  let listaDespesas = document.querySelector('#listaDespesas')
  listaDespesas.innerHTML = ''

  //percorrer o Array despesa listando os elementos de forma dinamica
  despesas.forEach(function(d) {
  
    //criando o TR
   let linha = listaDespesas.insertRow()

   //criar as colunas e adiciona o conteudo dentro delas
   linha.insertCell(0).innerHTML = ` ${d.dia}/${d.mes}/${d.ano}`

   //ajustar o tipo atribuindo uma legenda ao numero da opção selecionada no input
   switch(parseInt(d.tipo)) {
      case 1: d.tipo = 'Alimentação'
        break
      case 2: d.tipo = 'Educação'
        break
      case 3: d.tipo = 'Lazer'
        break
      case 4: d.tipo = 'Saúde'
        break
      case 5: d.tipo = 'Transporte'
        break        
   }

   linha.insertCell(1).innerHTML = d.tipo
   linha.insertCell(2).innerHTML = d.descricao
   linha.insertCell(3).innerHTML = d.valor

   //criar o botão de exclusão
   let btn = document.createElement("button")
   btn.className = 'btn btn-danger'
   btn.innerHTML = '<i class="fas fa-times"></i>'
   btn.id = `id_despesa${d.id}` // associa o id do objeto ao botão
   btn.onclick = function () {
     //remover a despesa
     let id = this.id.replace('id_despesa', '')
     bd.remover(id)
     window.location.reload()
   }
   linha.insertCell(4).append(btn)
   console.log(d)
  });
}

// filtrando despesas e pesquisando
function pesquisarDespesas() {
  // pegando apenas o value dos input
  let ano = document.getElementById("ano").value
  let mes = document.getElementById("mes").value
  let dia = document.getElementById("dia").value
  let tipo = document.getElementById("tipo").value
  let descricao = document.getElementById("descricao").value
  let valor = document.getElementById("valor").value

  // instancia do objeto despesa para filtrar despesas (variaveis no parametro pois o retorno é só o value)
  let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)

  //chamar o metodo de pesquisa com variavel despesa no parametro
  let despesas =  bd.pesquisar(despesa)

  carregarListaDespesas(despesas, true)

}