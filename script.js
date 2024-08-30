window.onload = carregarOpcoes;
//carregar opçoes de raça de gato para comparação
async function carregarOpcoes() {
await fetch('https://api.thecatapi.com/v1/breeds?limit=10')
    .then(response => response.json())
    .then(breeds => {
    
    const container = document.getElementById('dropdown')
    breeds.forEach(name =>{
        const opcao = document.createElement('option')
        opcao.textContent = name.name
        container.appendChild(opcao)

    })

    const container2 = document.getElementById('dropdown2')
    breeds.forEach(name =>{
        const opcao = document.createElement('option')
        opcao.textContent = name.name
        container2.appendChild(opcao)
    })


    })
    .catch(error => console.error('Erro ao buscar as informações da raça:', error));

}

async function comparar(){
    //get na api de raça de gatos
    await fetch('https://api.thecatapi.com/v1/breeds?limit=10')
    .then(response => response.json())
    .then(breeds => {
        const dropdown1 = document.getElementById("dropdown")
        const dropdown2 = document.getElementById("dropdown2")

        // escolher o que está selecionado na caixa de select
        let primeiroNome = dropdown1.options[dropdown1.selectedIndex].text
        let segundoNome = dropdown2.options[dropdown2.selectedIndex].text

        //find para filtrar no fetch pelo nome da caixa select
        let primeiroGato = breeds.find(gato1 => gato1.name === primeiroNome)
        let segundoGato = breeds.find(gato2 => gato2.name === segundoNome)

        //fetch primeira imagem e crração do primeiro card
        fetch (`https://api.thecatapi.com/v1/images/${primeiroGato.reference_image_id}`)
        .then(responde => responde.json())
        .then(image =>{
            let gato1 = document.getElementById("gato1")
            gato1.setAttribute('class', 'gatos')
            gato1.innerHTML = `
                <img class="imagemGatos" src=${image.url}>
                <h2 class="nomeGatoCard">${primeiroNome}</h2>
                <p>Descrição: ${primeiroGato.description}</p>
                <table>
                    <tr>
                        <th>Nível de Afeição: </th>
                        <td>${primeiroGato.affection_level}<td>
                        <th>Inteligência: </th>
                        <td>${primeiroGato.intelligence}<td>
                    <tr>

                    <tr>
                        <th>Adaptabilidade: </th>
                        <td>${primeiroGato.adaptability}<td>
                        <th>Nível de Energia: </th>
                        <td>${primeiroGato.energy_level}<td>
                    <tr>

                <table>
                <button class="botaoFavoritar" onclick=favoritar('${primeiroGato.id}')>Favoritar Gato</button>
            `
        })
                
        //fetch segunda imagem e criação do segundo card
        .catch(error => console.error('Erro ao buscar as informações da raça:', error));


        fetch (`https://api.thecatapi.com/v1/images/${segundoGato.reference_image_id}`)
        .then(responde => responde.json())
        .then(image2 =>{
            let gato2 = document.getElementById("gato2")
            gato2.setAttribute('class', 'gatos')
            gato2.innerHTML = `
                <img class = "imagemGatos" src=${image2.url}>
                <h2 class="nomeGatoCard">${segundoNome}</h2>
                <p>Descrição: ${segundoGato.description}</p>
                <table>
                    <tr>
                        <th>Nível de Afeição: </th>
                        <td>${segundoGato.affection_level}<td>
                        <th>Inteligência: </th>
                        <td>${segundoGato.intelligence}<td>
                    <tr>

                    <tr>
                        <th>Adaptabilidade: </th>
                        <td>${segundoGato.adaptability}<td>
                        <th>Nível de Energia: </th>
                        <td>${segundoGato.energy_level}<td>
                    <tr>

                <table>
                <button class="botaoFavoritar" onclick=favoritar('${segundoGato.id}')>Favoritar Gato</button>

            
            `
        })
        .catch(error => console.error('Erro ao buscar as informações da raça:', error));

    
    })

    .catch(error => console.error('Erro ao buscar as informações da raça:', error));

    
    
}

async function favoritar(gato){
    //post do servidor das informações do gato selecionado
    await fetch (`https://api.thecatapi.com/v1/breeds/${gato}`)
    .then(response => response.json())
    .then(data =>{
        fetch("http://localhost:3000/create", {
            method: "POST",                      
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })

    })
     
}

async function favoritos(){
    //alterar html para o design da parte favoritos
    let favoritos = document.querySelector("body")
    favoritos.innerHTML = `
    <h1 id="titulo">Favoritos</h1>
    <div id="comparador">    
        <button id="botaoComparar" onclick="voltar()"> Voltar</button>
    </div>
        <div id="containerFavoritos">
        </div>
    `
    //get do servidor
    await fetch("http://localhost:3000/")
    .then(response => response.json())
    .then(data => {
        let gatos = data.response
        let container = document.getElementById("containerFavoritos")
        gatos.forEach(iten =>{
            let favoritado = document.createElement("div")
            favoritado.setAttribute("class", "gatosFavoritados")
            favoritado.setAttribute("id", `${iten.id}`)
            favoritado.innerHTML = `
                <h2 class="nomeGatoCard">${iten.name}</h2>
                <p>Descrição: ${iten.description}</p>
                <table>
                    <tr>
                        <th>Nível de Afeição: </th>
                        <td>${iten.affection_level}<td>
                        <th>Inteligência: </th>
                        <td>${iten.intelligence}<td>
                    <tr>

                    <tr>
                        <th>Adaptabilidade: </th>
                        <td>${iten.adaptability}<td>
                        <th>Nível de Energia: </th>
                        <td>${iten.energy_level}<td>
                    <tr>

                <table>
                <button class="botaoRemover" onclick=remover('${iten.id}')>Remover Gato</button>

            `
            container.appendChild(favoritado)
        })

    })

    titulo = document.querySelector("title")
    titulo.textContent = "Cat Fight - Favoritos"

}

function voltar(){
    window.location.href = "index.html"
}


function remover(id){
    //remover do servido o gato selecionado
    fetch(`http://localhost:3000/del/${id}`, {
        method: "DELETE",
    });

    //remover do html o card do gato removido
    let removido = document.getElementById(`${id}`)
    removido.setAttribute("class", "")
    removido.innerHTML = ` `
}

