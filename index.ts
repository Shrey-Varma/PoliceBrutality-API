export{};

const axios = require('axios');
const prompt = require('prompt-sync')();
const chalk = require('chalk');


start();

async function start(){
let choice;

while (true) {
  console.log("Here are the different options you can sort by: state, date, specific tags(tags), response size(size), or politicians. Please enter the different options seperated by a space:");

    let temp = prompt('').replace(/  +/g, ' ').trim();
  if (temp != null) {
    choice = temp;
    break;
  } else {
    alert("Sorry, please enter a valid response.");
  }
}

let stateFilt = choice.search(new RegExp("state", "i")) !== -1;
let date = choice.search(new RegExp("date", "i")) !== -1;
let size = choice.search(new RegExp("size", "i")) !== -1;
let politicians = choice.search(new RegExp("politicians", "i")) !== -1;
let tags = choice.search(new RegExp("tags", "i")) !== -1;
let polChoice;

//console.log("For any of the following questions, please try and avoid putting extra spaces where they are not needed as this may break the code. Thank you!");

if (politicians && (date || tags)) {
  while (true) {
    console.log("Sorry, some of the options that you may have selected such as tags and dates are not avalible with the politician option. Would you like to disable it? Please enter yes/no");
    polChoice = prompt('').replace(/  +/g, ' ').trim();
    if (polChoice === null) {
      console.log("Sorry, please enter a valid response.");
    } else {
      break;
    }
  }

  if (polChoice.toLowerCase() === "yes") {
    politicians = false;
  } else if (polChoice.toLowerCase() === "no") {
    tags = false;
    date = false;
  }
}
let wordArr;
if(tags){
  

console.log("Would you like to search for specific keywords? Please seperate the words with a space or leave empty:")
let temp = prompt('').replace(/  +/g, ' ').trim();
if (temp != null) {
  wordArr = temp.split(" ").join(",");
} else {
  wordArr = null;
}
}
let state;
let stateSize;
if (stateFilt) {
  console.log("Please enter the name of the state you want to target.");
  let stateBig = prompt('').replace(/  +/g, ' ').trim();
  let words = stateBig.split(" ");

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }


  let states = [
    ["Alabama", "AL"],
    ["Alaska", "AK"],
    ["Arizona", "AZ"],
    ["Arkansas", "AR"],
    ["California", "CA"],
    ["Colorado", "CO"],
    ["Connecticut", "CT"],
    ["Delaware", "DE"],
    ["District Of Columbia", "DC"],
    ["Florida", "FL"],
    ["Georgia", "GA"],
    ["Guam", "GU"],
    ["Hawaii", "HI"],
    ["Idaho", "ID"],
    ["Illinois", "IL"],
    ["Indiana", "IN"],
    ["Iowa", "IA"],
    ["Kansas", "KS"],
    ["Kentucky", "KY"],
    ["Louisiana", "LA"],
    ["Maine", "ME"],
    ["Maryland", "MD"],
    ["Massachusetts", "MA"],
    ["Michigan", "MI"],
    ["Minnesota", "MN"],
    ["Mississippi", "MS"],
    ["Missouri", "MO"],
    ["Montana", "MT"],
    ["Nebraska", "NE"],
    ["Nevada", "NV"],
    ["New Hampshire", "NH"],
    ["New Jersey", "NJ"],
    ["New Mexico", "NM"],
    ["New York", "NY"],
    ["North Carolina", "NC"],
    ["North Dakota", "ND"],
    ["Ohio", "OH"],
    ["Oklahoma", "OK"],
    ["Oregon", "OR"],
    ["Pennsylvania", "PA"],
    ["Rhode Island", "RI"],
    ["South Carolina", "SC"],
    ["South Dakota", "SD"],
    ["Tennessee", "TN"],
    ["Texas", "TX"],
    ["Utah", "UT"],
    ["Vermont", "VT"],
    ["Virginia", "VA"],
    ["Washington", "WA"],
    ["West Virginia", "WV"],
    ["Wisconsin", "WI"],
    ["Wyoming", "WY"]
  ];

  if (politicians) {
    stateBig = words.join(" ");
    for (let i = 0; i < states.length; i++) {
      if (states[i][0] === stateBig) {
        state = states[i][1];
        break;
      }
    }
  } else {
    state = words;
    stateSize = state.length;
  }
}

let dateEnter;
if (date) {
  while (true) {
    console.log("Please enter a date in YYYY MM DD format. Most dates within 2020 and after should be valid.")
    let temp = prompt('').replace(/  +/g, ' ').trim();
    const test = new Date(Date.parse(temp));
    if (!isNaN(test.getTime())) {
      dateEnter = temp.split(' ').join('-');
      break;
    } else {
      console.log("Sorry, that was not a valid date. Please try again.");
    }
  }
}
let numSize;
if (size) {
  while(true){
  console.log("How many results do you want? ");
  numSize = parseInt(
    prompt('').replace(/  +/g, ' ').trim(),
    10
  );
  if(numSize >= 0 && !isNaN(numSize)) break;
  else console.log("Sorry, that was not a valid size. Please try again.");
  }
}
let url;
if (politicians) {
  let tempState = stateFilt ? `filter[state]=${state}` : ``;
  let tempSize = size ? `&page[limit]=${numSize}` : ``;
  url = `https://api.846policebrutality.com/api/legislators?${tempState}${tempSize}`;
} 
else {
  let tempDate = date ? `filter[date]=${dateEnter}&` : ``;
  let tempState = stateFilt? `filter[state]=${stateSize === 2 ? `${state[0]}+${state[1]}` : state[0]}&`: ``;
  let tempSize = size ? `page[limit]=${numSize}&` : ``;
  let tempTags = tags? `filter[tags]=${wordArr}&`:``;
  url = `https://api.846policebrutality.com/api/incidents?${tempDate}${tempState}${tempSize}${tempTags}include=evidence`;
}
console.log("Please wait a few seconds for the results to load...");
//console.log(url);

  async function getAPI(){
  await axios
  .get(url)
  .then((response) => {
    let data = response.data.data;
    if(data.length === 0){
      console.log(
          `Sorry, we could not find any results based on the information provided.`);
    }
    for (const cur of data) {
      if (!politicians) {
        console.log(`${chalk.redBright.bold(`Title`)}: ${cur.title}`);
        console.log(`${chalk.hex('#FFA500').bold(`Date`)}: ${cur.date}`);
        console.log(`${chalk.hex('#FFFF00').bold(`Location`)} - ${chalk.dim.green(`State`)}: ${cur.state}, ${chalk.dim.green(`City`)}: ${cur.city}`);
        let linksString = '';
        for(let i =0; i<cur.links.length; i++){
          if(i !== cur.links.length - 1){
            linksString += `${chalk.underline.blue(cur.links[i])},\n `;  
          }  
          else{
            linksString += `${chalk.underline.blue(cur.links[i])}`;
          }
          
        }
        console.log(`${chalk.cyanBright.bold(`Links`)}: ${linksString}`);
        let tagsString = '';
        for (const tag of cur.tags) {
          tagsString += `${tag}, `;
        }
        console.log(`${chalk.magentaBright.bold(`Tags`)}: ${tagsString}`);
      } 
      else {
        console.log(`Title: ${cur.title} ${cur.first_name} ${cur.last_name}`);
        console.log(`State: ${cur.state}`);
        console.log(`Twitter Account: @${cur.twitter_account}`);
        console.log(`Website: ${cur.url}`);
      }
      console.log();
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

getAPI()
.then(() => {
   console.log('Would you like to get another result? Please enter Y/N');
  let result = prompt('');
  if(result.toLowerCase() === 'y'){
    start();
  }
})
.catch(err => console.log("Axios err: ", err));
};


  
  