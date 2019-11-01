// criação do array: 
let pecas = []; // armanezar as peças no array...
let arrayEmOrdem = []; // armanezar resposta de verificação do jogo
let telaInicial = document.getElementById('telaInicial'); // pegando tela de início
//Evento que vai ser chamado quando for clicado na tela inicial. Recebendo false, pra que nenhuma outra função possa chama-la
telaInicial.addEventListener("click", iniciarJogo, false);

let telaFinal = document.getElementById('telaFinal'); // pegando tela final de jogo


// varrer o html pra pegar as referências e salvar no array
function varrerHtml() { 
    for (let i = 1; i < 9; i += 1) { // varrer o array
        let peca = document.getElementById('n' + i); // cada referência as peças do jogo

        //Fazer com que cada posição receba uma image. n+i+ -> devido ao nome das imagens começarem com 'n'
        peca.style.background = "url('images/n" + i + ".png')";

        // disparar função quando uma peça for clicada. Vai chamar função pra que a peça possa ser movimentada.
        peca.addEventListener("click", moverPeca, false);

        pecas.push(peca); // o array recebe uma peça
    }

    pecas.push(null); // setar uma peça em branco no tabuleiro
    arrayEmOrdem = pecas; // a variável de resposta vai receber a posição de cada peça do array

    desenharArray(); // chamar função pra espalhar as peças no tabuleiro
}


// desenhar o array 
function desenharArray() {
    for (let i in pecas) {
        let peca = pecas[i];  // pros índices de pecas receber o valor do array, 

        if (peca) { // verificar se há valor no índice. Porque tem uma peça em branco...
            //ter como referência a margem esquerda + 5px de distância. Vai fazer distribuição das peças em relação a margem esquerda
            peca.style.left = (i % 3) * 100 + 5 + "px";
            if (i < 3) { peca.style.top = "5px"; } // margem de cima
            else if (i < 6) { peca.style.top = "105px";  } // segunda linha
            else { peca.style.top = "205px";  } // terceira linha
        }
    }
}


//embaralhar as peças. Além de verificar se, a cada índice do array, já existe outro de mesmo valor, 
//se não, ele é inserido no novo array. Vai fazer isso até retornar todos os elementos do outro array, de forma aleatória
function embaralharPecas(oldArray) { // array antigo
    let newArray;
    
    do {
        newArray = [];
        while (newArray.length < oldArray.length) { // enquanto o novo array for menor do que a qnt do array recebido:
            // retorna valor inteiro arrendondado pra baixo. Random gera número aleatório * o comprimento do array antigo
            let i = Math.floor(Math.random() * oldArray.length);

            if (newArray.indexOf(oldArray[i]) < 0) { // verificar se o valor do índice no array antigo já existe no novo array... 
                newArray.push(oldArray[i]); //Se não existir, retorna -1, como é menor que 0, é inserido no novo array
            }
        }
    } while (!validarJogo(newArray)); // vai ficar chamando a função até que ela retorne um jogo que pode ser resolvido

    return newArray; // depois que tiver todos os elementos, o novo array é retornado.
}


// função pra validar se o jogo pode ser resolvido ou não
function validarJogo(array) {
    let inversoes = 0;
    let len = array.length;

    for (let i = 0; i < len - 1; i += 1) {
        for (let m = i + 1; m < len; m += 1) {
            if (array[i] && array[m] && array[i].dataset.value < array[m].dataset.value) {
                inversoes += 1;
            }
        }
    }

    return inversoes % 2 === 0; // se false for retornado, o jogo não tem solução
}


// função que inicia o jogo
function iniciarJogo() {
    setTimeout(function () {
        alert('Você não conseguiu resolver...');
        fimDeJogo();
    }, 50000);

    // embaralhar as peças. A função recebe o array em ordem, e retorna o array embaralhado pra variável
    pecas = embaralharPecas(pecas);

    this.style.opacity = "0";  // this serve pra que, quem chamar, sofra a ação do jogo
    this.style.zIndex = "-1"; // pra tirar a div da tela inicial e possibilidade acesso às peças
    this.removeEventListener("click", iniciarJogo, false);  // remover o evento de click, já que o jogo já foi inicializado

    desenharArray(); // é chamada pra reformular a exibição das formas no tabuleiro;
}



// função pra movimentar a peça
function moverPeca() {
    let index = pecas.indexOf(this);
    // verificação à esquerda
    if (index % 3 !== 0) { // se não estiver na coluna da esquerda
        if (!pecas[index - 1]) { // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
            pecas[index - 1] = this; // a peça vai ser movida pra esquerda
            pecas[index] = null; // e essa lugar onde a peça está vai ficar indisponível
        }
    }

    // verificação à direita
    if (index % 3 !== 2) { // se não estiver na coluna da direita
        if (!pecas[index + 1]) { // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
            pecas[index + 1] = this; // a peça vai ser movida pra direita
            pecas[index] = null; // e essa lugar onde a peça está vai ficar indisponível
        }
    }

    // verificação acima
    if (index > 2) { // se não estiver na coluna de cima
        if (!pecas[index - 3]) { // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
            pecas[index - 3] = this; // a peça vai ser movida pra coluna de cima
            pecas[index] = null; // e essa lugar onde a peça está vai ficar indisponível
        }
    }

    // verificação abaixo
    if (index < 6) { // se não estiver na coluna debaixo
        if (!pecas[index + 3]) { // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
            pecas[index + 3] = this; // a peça vai ser movida pra coluna debaixo
            pecas[index] = null; // e essa lugar onde a peça está vai ficar indisponível
        }
    }

    desenharArray();

    // verificar se, após peça ser movimentada, o meu array está em ordem
    if (verificarArrayEmOrdem()) { fimDeJogo(); }
}


// verificar se, após peça ser movimentada, o meu array está em ordem
function verificarArrayEmOrdem() {
    for (let i in pecas) {
        let a = pecas[i];
        let b = arrayEmOrdem[i];

        if (a !== b) { // se forem diferentes, o array ainda não está em ordem
            return false;
        }
    }

    return true; // se forem iguais, o array está em ordem e o jogo é finalizado
}


// função de fim de jogo
function fimDeJogo() {
    telaFinal.style.opacity = "1"; // torna o elemento de fim de jogo, visível
    telaFinal.style.zIndex = "1";

    setTimeout(function () { // como o modal tem transição de 0.5s, o função espera meio segundo também
        telaFinal.addEventListener("click", iniciarJogo, false);
    }, 500);
}


varrerHtml(); // chamando função pra pegar referências do html...