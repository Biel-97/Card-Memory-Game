const play = document.querySelector('.play')
const descricao = document.querySelector('.desc')
const escolha = document.querySelector('.escolha')
const inicial = document.querySelector('.inicial')
const descricaotxt = document.querySelector('.descricaotxt')
let final = document.querySelector('.resultado')
let jogo = document.querySelector('.jogo')
let resultado = document.querySelector('.resultado')

play.onclick = function (e) {
    if (descricao.style.display === 'none') {
        // play.style.display = 'none'
        descricao.style.display = 'flex'
        play.style.alignSelf = 'center'
        inicial.style.flexDirection = 'row'
        escolha.style.display = 'none'
        final.style.display = 'flex'
    } else {
        descricao.style.display = 'none'
        play.style.display = 'flex'
        play.style.alignSelf = 'center'
        inicial.style.flexDirection = 'column'
        escolha.style.display = 'flex'
        final.style.display = 'none'
    }
}

descricao.onclick = function (e) {
    if (play.style.display === 'none') {
        // play.style.display = 'none'
        play.style.display = 'flex'
        descricao.style.alignSelf = 'center'
        inicial.style.flexDirection = 'row'
        descricaotxt.style.display = 'none'
        final.style.display = 'flex'

    } else {
        play.style.display = 'none'
        descricao.style.display = 'flex'
        descricao.style.alignSelf = 'center'
        inicial.style.flexDirection = 'column'
        descricaotxt.style.display = 'flex'
        final.style.display = 'none'

    }
}

var form = document.querySelector('.escolha');
var botao = document.querySelectorAll('.opcao');
let numero_cartas = []

function dificuldade(nivel) {
    if (nivel === 'facil') {
        return 22
    } else if (nivel === 'medio') {
        return 26
    } else if (nivel === 'dificil') {
        return 32
    }
}

botao.forEach(e => {
    e.addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector('.escolha').style.display ='none'
        transicao('inicial', 'jogo')
        let nivel = e.id
        numero_cartas.push(e.id)
        numero_cartas.push(dificuldade(e.id))
        loading(innerWidth, 100)
        criar_jogo(dificuldade(nivel))
        

    })
});

let win = 0
let lose = 0
let situacao = 0
// Barra de tempo
const loading = function loading(comprimento, tempo) {
    const passo = (tempo * 1000) / comprimento
    let elem = document.querySelector(".load");
    let width = 0;
    let id = setInterval(load, passo + 1);
    function load() {
        if (situacao !== 0) {
            elem.style.width = '0px'
            fimdejogo()
            clearInterval(id);
            situacao = 0
        }else if (width == innerWidth) {
            lose ++
            let derrota = document.querySelector('.derrota')
            derrota.innerHTML = lose
            fimdejogo()
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + 'px';
        }
    }
    if (elem.style.width == innerWidth) {
        jogo.style.display = 'none'
    }
}

const transicao = function transicao(antes_div, depois_div) {
    const antes = document.querySelector('.' + antes_div)
    const depois = document.querySelector('.' + depois_div)
    antes.style.opacity = '0'
    antes.style.transition = '1s'
    setTimeout(function () {
        antes.style.display = 'none';
        depois.style.display = 'flex';
    }, 1200);
    setTimeout(function () {
        depois.style.opacity = '1'
        depois.style.transition = '1s'
    }, 1500);
}


criar_jogo = function (nivel) {
    //adcionar numero de cartas baseando-se no nivel de fificuldade
    let contador = 0
    const total_cartas = numero_cartas[1]
    let conteiner = document.createElement('div')
    conteiner.className ='conteiner-card'
    jogo.appendChild(conteiner)
    while (contador != total_cartas) {
        const carta = document.createElement('div')
        carta.className = 'carta'
        conteiner.appendChild(carta)
        const frontal = document.createElement('div')
        frontal.className = 'frontal';
        carta.appendChild(frontal);
        const verso = document.createElement('div')
        verso.className = 'verso'
        carta.appendChild(verso)
        contador++
    }

    // girar carta 
    click_turn = function (class_cartas) {
        let viradas = 0
        function retorno  (carta) {
            setTimeout(function() {
                carta.style.transform = "rotateY(360deg)";
                carta.style.transition = '0.3s';
            }, 500)
        }
        let fonte = new Array
        let tentativa = new Array
        let carta = new Array

        const cartas = document.querySelectorAll('.' + class_cartas)
        cartas.forEach(e => {
            e.firstChild.onclick = function () {
                console.log(tentativa)
                e.style.transform = "rotateY(180deg)"
                if (fonte.length <= 1) {
                    fonte.push(e.lastChild.firstChild.src)
                    tentativa.push(e.lastChild)
                    carta.push(e)
                }
                if (tentativa.length === 2) {
                    if (fonte[0] === fonte[1]) {
                        viradas ++
                        viradas ++
                        tentativa[0].style.backgroundColor = 'black'
                        tentativa[1].style.backgroundColor = 'black'
                        tentativa[0].style.transition = '2s'
                        tentativa[1].style.transition = '2s'
                        if (viradas == dificuldade(numero_cartas[0])) {
                            situacao ++
                            win ++
                            console.log(win)
                            let Vitoria = document.querySelector('.Vitoria')
                            Vitoria.innerHTML = win
                            let elem = document.querySelector(".load");
                            elem.style.width = '1px'
                            fimdejogo()
                        }
                    } else if (fonte[0] != fonte[1]) {
                        retorno(carta[0])
                        retorno(carta[1])
                    }
                        fonte = []
                        tentativa = []
                        carta = []
                }
            }
        
        })
    }
    click_turn('carta')

    // cria numeros aleatorios definidos
    var sorteados = [];
    var valorMaximo = dificuldade(numero_cartas[0])
    function criarUnico() {
        if (sorteados.length == valorMaximo) {
            sorteados = []
        }
        var sugestao = Math.ceil(Math.random() * valorMaximo); // Escolher um numero ao acaso
        while (sorteados.indexOf(sugestao) >= 0) {  // Enquanto o numero já existir, escolher outro
            sugestao = Math.ceil(Math.random() * valorMaximo);
        }
        sorteados.push(sugestao); // adicionar este numero à array de numeros sorteados para futura referência
        return sugestao; // devolver o numero único
    }

    imagem_verso = function (class_verso) {
        let diretorio = "img/carta-verso/"
        let versos = document.querySelectorAll('.' + class_verso) //todos os versos no array
        let imagens = new Array // todas as imagens no array, adcionadas no for
        imagens.push(0) // adcionando o indice 0 porque o "criarunico()" nao gera o numero 0 aleatoriamente
        for (let nome_imagem = 1; nome_imagem <= dificuldade(numero_cartas[0]) / 2; nome_imagem++) {
            imagens.push(diretorio + nome_imagem + '.png')
            imagens.push(diretorio + nome_imagem + '.png')
        }
        versos.forEach((e) => {
            let figure1 = document.createElement('img')
            figure1.src = imagens[criarUnico()]
            e.appendChild(figure1)
        })
    }
    imagem_verso('verso')
}

function fimdejogo() {
    let barra_loading = document.querySelector('.load')
    let jogo = document.querySelector('.jogo')
    let conteiner = document.querySelector('.conteiner-card')
    numero_cartas.pop()
    numero_cartas.pop()
    barra_loading.style.width = "0px"
    barra_loading.style.transition = '1s';
    setTimeout(function () { jogo.style.display = 'none';
    jogo.removeChild(conteiner);
}, 2000);
    transicao('jogo', 'inicial')
}
