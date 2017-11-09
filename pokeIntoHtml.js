'use stritch'

pokemon = require('./data/pokemon.json');

function pokeIntoHtml(poke){
    var arr = []
    poke.forEach(function(pk){
        arr.push(<div class="item" data-value=${pk.name} >
        <img class="ui mini avatar image" src=${pk.image_url} />
        ${pk.name}
      </div>)
    })
    arr.forEach(function(pk){
        console.log(pk)
})
debugger;
}

console.log('hi')

<div class="item" data-value=Bulbasaur >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png />   Bulbasaur </div>
<div class="item" data-value=Ivysaur >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/002.png />   Ivysaur </div>
<div class="item" data-value=Venusaur >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/003.png />   Venusaur </div>
<div class="item" data-value=Venusaur >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/003.png />   Venusaur </div>
<div class="item" data-value=Charmander >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/004.png />   Charmander </div>
<div class="item" data-value=Charmeleon >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/005.png />   Charmeleon </div>
<div class="item" data-value=Charizard >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/006.png />   Charizard </div>
<div class="item" data-value=Charizard >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/006.png />   Charizard </div>
<div class="item" data-value=Charizard >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/006.png />   Charizard </div>
<div class="item" data-value=Squirtle >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/007.png />   Squirtle </div>
<div class="item" data-value=Wartortle >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/008.png />   Wartortle </div>
<div class="item" data-value=Blastoise >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/009.png />   Blastoise </div>
<div class="item" data-value=Blastoise >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/009.png />   Blastoise </div>
<div class="item" data-value=Caterpie >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/010.png />   Caterpie </div>
<div class="item" data-value=Metapod >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/011.png />   Metapod </div>
<div class="item" data-value=Butterfree >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/012.png />   Butterfree </div>
<div class="item" data-value=Weedle >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/013.png />   Weedle </div>
<div class="item" data-value=Kakuna >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/014.png />   Kakuna </div>
<div class="item" data-value=Beedrill >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/015.png />   Beedrill </div>
<div class="item" data-value=Beedrill >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/015.png />   Beedrill </div>
<div class="item" data-value=Pidgey >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/016.png />   Pidgey </div>
<div class="item" data-value=Pidgeotto >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/017.png />   Pidgeotto </div>
<div class="item" data-value=Pidgeot >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/018.png />   Pidgeot </div>
<div class="item" data-value=Pidgeot >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/018.png />   Pidgeot </div>
<div class="item" data-value=Rattata >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/019.png />   Rattata </div>
<div class="item" data-value=Rattata >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/019.png />   Rattata </div>
<div class="item" data-value=Raticate >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/020.png />   Raticate </div>
<div class="item" data-value=Raticate >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/020.png />   Raticate </div>
<div class="item" data-value=Spearow >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/021.png />   Spearow </div>
<div class="item" data-value=Fearow >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/022.png />   Fearow </div>
<div class="item" data-value=Ekans >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/023.png />   Ekans </div>
<div class="item" data-value=Arbok >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/024.png />   Arbok </div>
<div class="item" data-value=Pikachu >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/025.png />   Pikachu </div>
<div class="item" data-value=Raichu >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/026.png />   Raichu </div>
<div class="item" data-value=Raichu >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/026.png />   Raichu </div>
<div class="item" data-value=Sandshrew >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/027.png />   Sandshrew </div>
<div class="item" data-value=Sandshrew >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/027.png />   Sandshrew </div>
<div class="item" data-value=Sandslash >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/028.png />   Sandslash </div>
<div class="item" data-value=Sandslash >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/028.png />   Sandslash </div>
<div class="item" data-value=Nidoran♀ >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/029.png />   Nidoran♀ </div>
<div class="item" data-value=Nidorina >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/030.png />   Nidorina </div>
<div class="item" data-value=Nidoqueen >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/031.png />   Nidoqueen </div>
<div class="item" data-value=Nidoran♂ >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/032.png />   Nidoran♂ </div>
<div class="item" data-value=Nidorino >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/033.png />   Nidorino </div>
<div class="item" data-value=Nidoking >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/034.png />   Nidoking </div>
<div class="item" data-value=Clefairy >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/035.png />   Clefairy </div>
<div class="item" data-value=Clefable >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/036.png />   Clefable </div>
<div class="item" data-value=Vulpix >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/037.png />   Vulpix </div>
<div class="item" data-value=Vulpix >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/037.png />   Vulpix </div>
<div class="item" data-value=Ninetales >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/038.png />   Ninetales </div>
<div class="item" data-value=Ninetales >   <img class="ui mini avatar image" src=http://assets.pokemon.com/assets/cms2/img/pokedex/detail/038.png />   Ninetales </div>