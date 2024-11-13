// Part 1: Number Facts
function addFactToPage(fact) {
    const factDiv = document.createElement('div');
    factDiv.className = 'fact';
    factDiv.innerText = fact;
    document.getElementById('number-facts').appendChild(factDiv);
}

// 1. Get fact about favorite number
axios.get('http://numbersapi.com/7?json')
    .then(res => {
        addFactToPage(res.data.text);
    })
    .catch(err => console.log('Error:', err));

// 2. Get multiple number facts
axios.get('http://numbersapi.com/1,2,3,4?json')
    .then(res => {
        for (let num in res.data) {
            addFactToPage(res.data[num]);
        }
    })
    .catch(err => console.log('Error:', err));

// 3. Get 4 facts about favorite number
Promise.all([
    axios.get('http://numbersapi.com/7?json'),
    axios.get('http://numbersapi.com/7?json'),
    axios.get('http://numbersapi.com/7?json'),
    axios.get('http://numbersapi.com/7?json')
]).then(facts => {
    facts.forEach(fact => addFactToPage(fact.data.text));
}).catch(err => console.log('Error:', err));

// Part 2: Deck of Cards
// 1. Single card request
axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1')
    .then(res => {
        let { suit, value } = res.data.cards[0];
        console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
    })
    .catch(err => console.log('Error:', err));

// 2. Two cards from same deck
let firstCard = null;
axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1')
    .then(res => {
        firstCard = res.data.cards[0];
        return axios.get(`https://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`);
    })
    .then(res => {
        let secondCard = res.data.cards[0];
        console.log(`First card: ${firstCard.value.toLowerCase()} of ${firstCard.suit.toLowerCase()}`);
        console.log(`Second card: ${secondCard.value.toLowerCase()} of ${secondCard.suit.toLowerCase()}`);
    })
    .catch(err => console.log('Error:', err));

// 3. Card drawing UI
let deckId = null;

axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/')
    .then(res => {
        deckId = res.data.deck_id;
        document.getElementById('draw-card').style.display = 'block';
    })
    .catch(err => console.log('Error:', err));

document.getElementById('draw-card').addEventListener('click', function() {
    axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(res => {
            if (res.data.remaining === 0) {
                this.style.display = 'none';
            }
            let cardImg = document.createElement('img');
            cardImg.src = res.data.cards[0].image;
            document.getElementById('card-area').appendChild(cardImg);
        })
        .catch(err => console.log('Error:', err));
});