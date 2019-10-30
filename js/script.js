// criação do array: 
(function(){
    let tiles = []; // armanezar as peças no array...
    let answer = []; // armanezar resposta de verificação do jogo
    let startScreen = document.getElementById('startScreen'); // pegando tela de início
    //Evento que vai ser chamado quando for clicado na tela inicial. Recebendo false, pra que nenhuma outra função possa chama-la
    startScreen.addEventListener("click", startGame, false); 

    let overScreen = document.getElementById('overScreen'); // pegando tela final de jogo

    function init(){ // varrer o html pra pegar as referências e salvar no array
        for(let i = 1; i < 9; i+=1){ // varrer o array
            let tile = document.getElementById('n'+i); // cada referência as peças do jogo
            
            //Fazer com que cada posição receba uma image. n+i+ -> devido ao nome das imagens começarem com 'n'
            tile.style.background = "url('images/n"+i+".png')"; 

            // disparar função quando uma peça for clicada. Vai chamar função pra que a peça possa ser movimentada.
            tile.addEventListener("click", moveTile, false); 
            
            tiles.push(tile); // o array recebe uma peça
        }
        
        tiles.push(null); // setar uma peça em branco no tabuleiro
        answer = tiles; // a variável de resposta vai receber a posição de cada peça do array

        render(); // chamar função pra espalhar as peças no tabuleiro
    }


    // desenhar o array 
    function render(){ 
        for(let i in tiles){ 
            let tile = tiles[i];  // pros índices de tiles receber o valor do array, 
            
            if(tile){ // verificar se há valor no índice. Porque tem uma peça em branco...
                //ter como referência a margem esquerda + 5px de distância. Vai fazer distribuição das peças em relação a margem esquerda
                tile.style.left = (i % 3) * 100 + 5 + "px"; 
                if(i < 3){
                    tile.style.top = "5px"; // margem de cima
                } 
                else if(i < 6){
                    tile.style.top = "105px"; // segunda linha
                } else {
                    tile.style.top = "205px"; // terceira linha
                }
            }  
        }
    }


    //embaralhar as peças. Além de verificar se, a cada índice do array, já existe outro de mesmo valor, 
    //se não, ele é inserido no novo array. Vai fazer isso até retornar todos os elementos do outro array, de forma aleatória
    function randomSort(oldArray){ // array antigo
        let newArray;
        //let erros = 0; // pra verificar quantos arrays ele gera que não poderiam ser resolvidos
        //newArray = [];

        do{
            newArray = [];
            while(newArray.length < oldArray.length){ // enquanto o novo array for menor do que a qnt do array recebido:
                // retorna valor inteiro arrendondado pra baixo. Random gera número aleatório * o comprimento do array antigo
                let i = Math.floor(Math.random()*oldArray.length); 
                
                if(newArray.indexOf(oldArray[i]) < 0){ // verificar se o valor do índice no array antigo já existe no novo array... 
                    newArray.push(oldArray[i]); //Se não existir, retorna -1, como é menor que 0, é inserido no novo array
                }
            } 
            //erros ++; // acrescentando +1 na variável erros de arrays sem solução
            //console.log(erros); printando erros
        } while(!validGame(newArray)); // vai ficar chamando a função até que ela retorne um jogo que pode ser resolvido

        return newArray; // depois que tiver todos os elementos, o novo array é retornado.
    }


    // função pra validar se o jogo pode ser resolvido ou não
    function validGame(array){
        let inversions = 0;
        let len = array.length;

        for(let i = 0; i < len -1; i+=1){
            for(let m = i+1; m < len; m +=1){
                if(array[i] && array[m] && array[i].dataset.value < array[m].dataset.value){
                    inversions +=1;
                }
            }
        }

        return inversions % 2 === 0; // se false for retornado, o jogo não tem solução
    }


    // função que inicia o jogo
    function startGame(){
        setTimeout(function(){ // contando o tempo...
            if (chWin()){ // se as peças estiverem alinhadas, jogo termina
                gameOver();
            } else { // 1 minuto pra resolver o jogo
                alert('Você não conseguiu resolver...');
                gameOver();
            }
        }, 50000); // 1 minuto pra resolver o jogo -> 1000 - 1 segundo

        // embaralhar as peças. A função recebe o array em ordem, e retorna o array embaralhado pra variável
        tiles = randomSort(tiles);  
        
        this.style.opacity = "0";  // this serve pra que, quem chamar, sofra a ação do jogo
        this.style.zIndex = "-1"; // pra tirar a div da tela inicial e possibilidade acesso às peças
        this.removeEventListener("click", startGame, false);  // remover o evento de click, já que o jogo já foi inicializado

        render(); // é chamada pra reformular a exibição das formas no tabuleiro;
    }



    // função pra movimentar a peça
    function moveTile(){
        let index = tiles.indexOf(this);
        // verificação à esquerda
        if(index % 3 !== 0){ // se não estiver na coluna da esquerda
            if(!tiles[index -1]){ // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
                tiles[index -1] = this; // a peça vai ser movida pra esquerda
                tiles[index] = null; // e essa lugar onde a peça está vai ficar indisponível
            }
        }

        // verificação à direita
        if(index % 3 !== 2){ // se não estiver na coluna da direita
            if(!tiles[index +1]){ // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
                tiles[index +1] = this; // a peça vai ser movida pra direita
                tiles[index] = null; // e essa lugar onde a peça está vai ficar indisponível
            }
        }

        // verificação acima
        if(index > 2){ // se não estiver na coluna de cima
            if(!tiles[index -3]){ // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
                tiles[index -3] = this; // a peça vai ser movida pra coluna de cima
                tiles[index] = null; // e essa lugar onde a peça está vai ficar indisponível
            }
        }

        // verificação abaixo
        if(index < 6){ // se não estiver na coluna debaixo
            if(!tiles[index +3]){ // verificar se o índice à esquerda tá vazio. Se retornar true, é pq há peça no lugar
                tiles[index +3] = this; // a peça vai ser movida pra coluna debaixo
                tiles[index] = null; // e essa lugar onde a peça está vai ficar indisponível
            }
        }

        render();
        
        // verificar se, após peça ser movimentada, o meu array está em ordem
        if(chWin()){ gameOver(); }
    }


    // verificar se, após peça ser movimentada, o meu array está em ordem
    function chWin(){
        for(let i in tiles){
            let a = tiles[i];
            let b = answer[i];

            if(a !== b){ // se forem diferentes, o array ainda não está em ordem
                return false;
            } 
        }

        return true; // se forem iguais, o array está em ordem e o jogo é finalizado
    }


    // função de fim de jogo
    function gameOver(){
        overScreen.style.opacity = "0.85"; // torna o elemento de fim de jogo, visível
        overScreen.style.zIndex = "1";
        
        setTimeout(function(){ // como o modal tem transição de 0.5s, o função espera meio segundo também
            overScreen.addEventListener("click", startGame, false);
        }, 500);
    }
    

    init();
}());