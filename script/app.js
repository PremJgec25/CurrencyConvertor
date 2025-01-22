// flag api format => <img src="https://flagsapi.com/:country_code/:style/:size.png">
const flagApiURL = 'https://flagsapi.com/IN/flat/64.png';

// currency api format => https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@{apiVersion}/{date}/{endpoint}
//view github pge => https://github.com/fawazahmed0/currency-api

/*using
/currencies/{currencyCode}/{currencyCode}
Get the currency value for EUR to JPY:
https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/jpy.json
*/

const dropdowns = document.querySelectorAll('.dropdown-menu');
const btn = document.querySelector('form button');
const msg = document.querySelector('.messeage');
const arrow = document.querySelector('.arrow i');
let amountEl = document.querySelector('#enteredAmount');

// adding options to select

dropdowns.forEach((selectEl) => {
  for (currCode in countryList) {
    let newOpton = document.createElement('option');
    newOpton.setAttribute('value', currCode);
    newOpton.textContent = currCode;

    if (currCode == 'USD' && selectEl.name == 'from') {
      newOpton.selected = 'selected';
    } else if (currCode == 'INR' && selectEl.name == 'to') {
      newOpton.selected = 'selected';
    }
    // console.log(newOpton);
    selectEl.append(newOpton);
  }
});

//adding event listener to select to change flag

const updateFlag = async (selectTag) => {
  let flagEl = selectTag.parentElement.querySelector('img');
  let currcode = selectTag.value,
    countryCode = countryList[currcode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  flagEl.src = newSrc;
};
dropdowns.forEach((selectEl) => {
  selectEl.addEventListener('change', (evt) => {
    updateFlag(evt.target);
  });
});

// adding event listener to btn

const getExchangeRate = async () => {
  let curr1 = dropdowns[0].value,
    curr2 = dropdowns[1].value;
  let fetchURL = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${curr1.toLowerCase()}/${curr2.toLowerCase()}.json`;
  let response = await fetch(fetchURL);
  return await response.json();
};
const updateExchangeRate = async () => {
  let amount = amountEl.value;
  //checking for invalid amount
  if (amount < 1 || amount === '') {
    amount = 1;
    amountEl.value = 1;
  }

  let data = await getExchangeRate();
  let exchangeRate = data[dropdowns[1].value.toLowerCase()];
  //updating msg
  msg.textContent = `${amount} ${dropdowns[0].value} = ${(
    amount * exchangeRate
  ).toFixed(3)} ${dropdowns[1].value}`;
};

btn.addEventListener('click', async (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

//adding event listener to interchnge arrow
arrow.addEventListener('click', (evt) => {
  let temp = dropdowns[0].value;
  dropdowns[0].value = dropdowns[1].value;
  dropdowns[1].value = temp;
  updateFlag(dropdowns[0]);
  updateFlag(dropdowns[1]);
});

//adding load as event to load th current rate when open the page

window.addEventListener('load', updateExchangeRate);
