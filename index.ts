// Import stylesheets
import './style.css';
import { Colours } from './models/colours.enum';
import { BodyParts, BodyPartsHelper } from './models/bodyParts.enum';
import { SpinRecord } from './models/spin';

// used to make the spinner spin
let spinnerCounter = 0;

// container for the spinner
let spinnerCycle;

// used to keep track of how many spins have been requested
let spinCount = 0;

// used to keep track of the results of the spin
let selectedColour: string;
let selectedBodyPart: string;

// use to store the results of spins
let spinHistoryArray: Array<SpinRecord> = [];

const historyTable = document.getElementById('historyTableBody');

const statsResults = document.getElementById('statsResults');

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
const spinBtn = <HTMLButtonElement>document.getElementById('spin-btn');
spinBtn.addEventListener('click', () => spinBtnHandler(2000, 100));

const statsBtn = <HTMLButtonElement>document.getElementById('statsBtn');
statsBtn.addEventListener('click', () =>
  statsBtnHandler(colourSelect.value, bodyPartSelect.value)
);

colourSelect.addEventListener('change', () =>
  statsBtnHandler(colourSelect.value, bodyPartSelect.value)
);
bodyPartSelect.addEventListener('change', () =>
  statsBtnHandler(colourSelect.value, bodyPartSelect.value)
);

// TO(DONE)DO handles the spin button click
// time in ms, interval in ms
function spinBtnHandler(time: number, interval: number) {
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
      spinCount,
      Colours[selectedColour],
      BodyParts[selectedBodyPart]
    )
  );
  // console.log(spinHistoryArray);

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

  addToHistory();
}

// TODO add the newly spun result to the history table
function addToHistory() {
  let row: HTMLElement = document.createElement('tr');

  let num: HTMLElement = document.createElement('td');
  num.innerHTML = String(spinHistoryArray[spinHistoryArray.length - 1].num);
  row.appendChild(num);

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

  historyTable.appendChild(row);

  if (historyTable.childElementCount > 5) {
    historyTable.removeChild(historyTable.firstElementChild);
  }
}

function statsBtnHandler(colour, bodyPart) {
  // TODO set the statsResults div innerHTML to the amount and last spun number that the user has chosen
  // eg. Red LeftHand spun 10 times
  //     Red LeftHand last spun at num 23
  console.log(colour, bodyPart);
  let spincombocount = getAmount(colour, bodyPart);
  console.log('spincombocount', spincombocount);

  let lastspun = getLastSpun(colour, bodyPart);
  console.log('lastspun', lastspun);

  statsResults.innerHTML = '';
  let spincombodiv: HTMLElement = document.createElement('div');
  spincombodiv.innerHTML = `${colour} ${bodyPart} spun ${spincombocount} times`;
  statsResults.appendChild(spincombodiv);
  if (lastspun > 0) {
    let lastspundiv: HTMLElement = document.createElement('div');
    lastspundiv.innerHTML = `${colour} ${bodyPart} last spun at num ${lastspun}`;
    statsResults.appendChild(lastspundiv);
  }
}

// TODO returns the amount of times the combination of selected of colour and body part have been spun
function getAmount(colour, bodyPart): number {
  let matchingcount = 0;
  for (let n = 0; n < spinHistoryArray.length; n++) {
    if (BodyParts[spinHistoryArray[n].bodyPart] === bodyPart) {
      if (Colours[spinHistoryArray[n].colour] === colour) {
        matchingcount++;
      }
    }
  }
  return matchingcount;
}

// TODO return the last num which the combination of selected of colour and body part have been spun
function getLastSpun(colour, bodyPart): number {
  for (let n = spinHistoryArray.length; n > 0; n--) {
    if (BodyParts[spinHistoryArray[n - 1].bodyPart] === bodyPart) {
      if (Colours[spinHistoryArray[n - 1].colour] === colour) {
        return n;
      }
    }
  }
  return 0;
}
