// Import stylesheets
import './style.css';
import { Colours } from './models/colours.enum';
import { BodyParts, BodyPartsHelper } from './models/bodyParts.enum';
import { SpinRecord } from './models/spin';
import { Player } from './models/player';

// used to make the spinner spin
let spinnerCounter = 0;

// container for the spinner
let spinnerCycle;

// used to keep track of how many spins have been requested
let spinCount: number;

// used to keep track of whose turn it is
let currentplayer: string;

// used to keep track of the results of the spin
let selectedColour: string;
let selectedBodyPart: string;

// use to store the results of spins
let spinHistoryArray: Array<SpinRecord>;

// SETUP FOR PLAYER POSITION
// let classedp1=new Player('Player 1');
// console.log(classedp1.LeftFoot);
// console.log(classedp1.LeftFoot==undefined);
// classedp1.LeftFoot=Colours.Green;
// console.log(classedp1.LeftFoot);

// player names
const p1nameInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('p1name')
);
let p1name: string;
const p2nameInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('p2name')
);
let p2name: string;
const p3nameInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('p3name')
);
let p3name: string;
const p4nameInput: HTMLInputElement = <HTMLInputElement>(
  document.getElementById('p4name')
);
let p4name: string;

let players: Array<string>;

const lastplayername = document.getElementById('lastplayername');
const currentplayername = document.getElementById('currentplayername');

const playerSelect: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('playerSelect')
);

// elements for results and history
const statsResults = document.getElementById('statsResults');
const historyTable = document.getElementById('historyTableBody');

// colour related elements
const colourDiv = document.getElementById('colourResult');
const colourSelect: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('colourSelect')
);

// sets up an array of strings to represent the colours from the enum, and adds the enums to the stats dropdown
let coloursArray: Array<string> = [];
for (let colour in Colours) {
  if (isNaN(Number(colour))) {
    coloursArray.push(colour);

    let newOption: HTMLOptionElement = document.createElement('option');
    newOption.innerHTML = colour;
    newOption.value = colour.toString();
    colourSelect.add(newOption);
  }
}

// bodypart related elements
const bodyPartP = document.getElementById('bodyPartText');
const bodyPartSelect: HTMLSelectElement = <HTMLSelectElement>(
  document.getElementById('bodyPartSelect')
);

// TO(DONE)DO see above and create an array of strings to store the bodypart strings from the enum, and adds the enums to the stats dropdown
let bodyPartsArray: Array<string> = [];
for (let bodypart in BodyParts) {
  if (isNaN(Number(bodypart))) {
    bodyPartsArray.push(bodypart);

    let newOption: HTMLOptionElement = document.createElement('option');
    newOption.innerHTML = bodypart;
    newOption.value = bodypart.toString();
    bodyPartSelect.add(newOption);
  }
}

// TO(DONE)DO add eventlistners to buttons
const newGameBtn = <HTMLButtonElement>document.getElementById('player-upd-btn');
newGameBtn.addEventListener('click', () => newgame());

const spinBtn = <HTMLButtonElement>document.getElementById('spin-btn');
spinBtn.addEventListener('click', () => spinBtnHandler(2000, 100));

// stats update on button or change
const statsBtn = <HTMLButtonElement>document.getElementById('statsBtn');
statsBtn.addEventListener('click', () =>
  statsBtnHandler(playerSelect.value, colourSelect.value, bodyPartSelect.value)
);
colourSelect.addEventListener('change', () =>
  statsBtnHandler(playerSelect.value, colourSelect.value, bodyPartSelect.value)
);
bodyPartSelect.addEventListener('change', () =>
  statsBtnHandler(playerSelect.value, colourSelect.value, bodyPartSelect.value)
);

// sets player names and resets history
newgame();

function newgame() {
  // reset history
  spinCount = 0;
  spinHistoryArray = [];
  statsResults.innerHTML = 'No spins recorded';
  historyTable.innerHTML = '';

  // set player names
  p1name = p1nameInput.value;
  p2name = p2nameInput.value;
  p3name = p3nameInput.value;
  p4name = p4nameInput.value;

  players = [p1name, p2name, p3name, p4name];

  playerSelect.innerHTML = '';
  for (let player in players) {
    let newOption: HTMLOptionElement = document.createElement('option');
    newOption.innerHTML = players[player];
    newOption.value = players[player];
    playerSelect.add(newOption);
  }

  currentplayer = players[0];
  currentplayername.innerHTML = currentplayer;

  lastplayername.innerHTML = '';
}

// TO(DONE)DO handles the spin button click
// time in ms, interval in ms
function spinBtnHandler(time: number, interval: number) {
  lastplayername.innerHTML = currentplayer;
  // increment the spin number (done first because the first spin should be 1)
  spinCount++;

  // start spinner rotating through colours
  spinnerCycle = setInterval(() => spinSpinners(), interval);

  // TO(DONE)DO randomly select colour from array
  let colourIndex: number = 0;
  colourIndex = Math.floor(Math.random() * coloursArray.length);
  selectedColour = coloursArray[colourIndex];
  // console.log(colourIndex,coloursArray[colourIndex]);

  // TO(DONE)DO randomly select bodyPart from array
  let bodyPartIndex: number = 0;
  bodyPartIndex = Math.floor(Math.random() * bodyPartsArray.length);
  selectedBodyPart = bodyPartsArray[bodyPartIndex];
  // console.log(bodyPartIndex,bodyPartsArray[bodyPartIndex]);

  // add spin to history
  spinHistoryArray.push(
    new SpinRecord(
      currentplayer,
      spinCount,
      Colours[selectedColour],
      BodyParts[selectedBodyPart]
    )
  );
  console.log(spinHistoryArray);

  spinBtn.disabled = true;

  // set timer to stop the spinners rotating
  setTimeout(() => stopSpinners(), time);
}

// rotates between the colours in Colours.enum.
function spinSpinners() {
  spinnerCounter++;

  colourDiv.style.backgroundColor =
    coloursArray[spinnerCounter % coloursArray.length];

  bodyPartP.innerHTML = bodyPartsArray[spinnerCounter % bodyPartsArray.length];
}

// stops spinner after time parameter, time in ms
function stopSpinners() {
  clearInterval(spinnerCycle);

  // TO(DONE)DO set colourDiv and bodyPartP to the randomly spun results
  colourDiv.style.backgroundColor = selectedColour;
  bodyPartP.innerHTML = selectedBodyPart;

  spinBtn.disabled = false;

  // set the current player (i.e. 'Next Spin') to the next player when the spin is complete
  currentplayer = players[spinCount % 4];
  currentplayername.innerHTML = currentplayer;

  addToHistory();
}

// TODO add the newly spun result to the history table
function addToHistory() {
  //create a new row
  let row: HTMLElement = document.createElement('tr');

  // add num, player, colour and bodypart to the row based on the last element of roll history
  let num: HTMLElement = document.createElement('td');
  num.innerHTML = String(spinHistoryArray[spinHistoryArray.length - 1].num);
  row.appendChild(num);
  let player: HTMLElement = document.createElement('td');
  player.innerHTML = spinHistoryArray[spinHistoryArray.length - 1].player;
  row.appendChild(player);
  let colour: HTMLElement = document.createElement('td');
  colour.innerHTML = String(
    Colours[spinHistoryArray[spinHistoryArray.length - 1].colour]
  );
  row.appendChild(colour);
  let bodyPart: HTMLElement = document.createElement('td');
  bodyPart.innerHTML = String(
    BodyParts[spinHistoryArray[spinHistoryArray.length - 1].bodyPart]
  );
  row.appendChild(bodyPart);

  // add the row to the table
  historyTable.appendChild(row);

  // if the table is more than 5 rolls, remove the oldest (first) row
  if (historyTable.childElementCount > 5) {
    historyTable.removeChild(historyTable.firstElementChild);
  }
}

function statsBtnHandler(player, colour, bodyPart) {
  // TODO set the statsResults div innerHTML to the amount and last spun number that the user has chosen
  // eg. Red LeftHand spun 10 times
  //     Red LeftHand last spun at num 23
  // console.log(colour, bodyPart);

  // call functions to get values

  let spincombocount = getAmount(player, colour, bodyPart);
  // console.log('spincombocount', spincombocount);

  let lastspun = getLastSpun(player, colour, bodyPart);
  // console.log('lastspun', lastspun);

  // reset the stats display
  statsResults.innerHTML = '';

  // add the number of spins
  let spincombodiv: HTMLElement = document.createElement('div');
  spincombodiv.innerHTML = `${player} spun ${colour} ${bodyPart} ${spincombocount} times`;
  statsResults.appendChild(spincombodiv);

  // if a matching spin exists, display the last spin
  if (lastspun > 0) {
    let lastspundiv: HTMLElement = document.createElement('div');
    lastspundiv.innerHTML = `${player} last spun ${colour} ${bodyPart} at num ${lastspun}`;
    statsResults.appendChild(lastspundiv);
  }
}

// TODO returns the amount of times the combination of selected of colour and body part have been spun
function getAmount(player, colour, bodyPart): number {
  let matchingcount = 0;
  for (let n = 0; n < spinHistoryArray.length; n++) {
    if (spinHistoryArray[n].player === player) {
      if (BodyParts[spinHistoryArray[n].bodyPart] === bodyPart) {
        if (Colours[spinHistoryArray[n].colour] === colour) {
          matchingcount++;
        }
      }
    }
  }
  return matchingcount;
}

// TODO return the last num which the combination of selected of colour and body part have been spun
function getLastSpun(player, colour, bodyPart): number {
  for (let n = spinHistoryArray.length; n > 0; n--) {
    if (spinHistoryArray[n - 1].player === player) {
      if (BodyParts[spinHistoryArray[n - 1].bodyPart] === bodyPart) {
        if (Colours[spinHistoryArray[n - 1].colour] === colour) {
          return n;
        }
      }
    }
  }
  return 0;
}
