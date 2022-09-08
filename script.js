import {texts} from "./data.js"

let persons = localStorage.getItem('persons')?localStorage.getItem('persons'):[];
let buttonStart = document.getElementById("button-start");
let title = document.getElementById("title");
let text = document.getElementById("text");
let resource = document.getElementById("resource");
let message = document.getElementById("message");
let timer = document.getElementById("timer");
let saveResultPanel = document.getElementById("save-result-panel");
let showResultPanelButton = document.getElementById("show-result-panel-button");
let saveResultButton = document.getElementById("save-result-button");
let fullName = document.getElementById("full-name");
let resultList = document.getElementById("result-list");
let resultTable = document.getElementById("result-table");
let clearListButton = document.getElementById("clear-list-button");
let lang = document.getElementById("lang");


let randomInteger;
let selectedTitle;
let selectedText;
let selectedResource;
let timerNum = 0;
let interval =null;
let speed=0;
let date = new Date();
let day = date.getDay();
let month = date.getMonth();
let year = date.getFullYear();
let dateNow = day+"/"+month+"/"+year;
let language=lang.checked?"tr":"en";
let filteredList=texts.filter(text => text.lang === language);
console.log(filteredList);

// Initialize
function init(){
    title.style.display="none";
    text.style.display="none";
    resource.style.display="none";
    timer.style.display="none";
    message.innerText="To start click START button";
    getFromLocalStorage();
}
lang.addEventListener("change", ()=>{
    language = lang.checked?"tr":"en";
    filteredList = texts.filter(text => text.lang === language)
})
// Add EventListener to Button
buttonStart.addEventListener("click", () => {
    
    //Start
    if(buttonStart.innerText.toLocaleLowerCase() ==="Start".toLocaleLowerCase()){
        randomInteger = Math.floor(Math.random()*filteredList.length);
        selectedTitle = filteredList[randomInteger].title;
        selectedText = filteredList[randomInteger].text;
        selectedResource = filteredList[randomInteger].res;
        text.innerText = selectedText;
        title.innerText = selectedTitle;
        resource.innerText ="Resource: "+ selectedResource;
        title.style.display="block";
        text.style.display="block";
        resource.style.display="block";
        timer.style.display="block";
        message.style.display="none";
        buttonStart.innerText="STOP";
        resultTable.style.display="none";
        showResultPanelButton.style.display ="none";
        lang.style.display="none";
        // timerNum Start
        interval = setInterval(()=>{
            timer.innerText=formatTimer(timerNum);
            timerNum++;
        },1000)
    }

    // Stop
    else if(buttonStart.innerText.toLocaleLowerCase() === "Stop".toLocaleLowerCase()){
        speed = calculateSpeed(selectedText, timerNum);
        title.style.display="none";
        text.style.display="none";
        resource.style.display="none";
        message.style.display="block";
        buttonStart.innerText="START";
        message.innerText = "Your reading speed is "+speed+" words per minute."
        timer.style.display="none";
        lang.style.display="block";

        timer.innerText="";
        showResultPanelButton.style.display="block";

        // Clear Interval and Reset timerNum
        clearInterval(interval)
        timerNum =0;
    }
});

// AddEventListener to show result panel
showResultPanelButton.addEventListener("click", () => {
    saveResultPanel.style.display="flex";
    showResultPanelButton.style.display ="none"
    buttonStart.style.display="none";
    lang.style.display="none";

});


// AddEventListener for Save Result
saveResultButton.addEventListener("click",()=>{
    saveResult();
});

// AddEventListener for clear list button
clearListButton.addEventListener("click",()=>{
    clearList();
})

//Calculate speed
function calculateSpeed(text,timerNum){
    let words = text.split(" ");
    let count = words.length;
    let speed =Math.floor((count / timerNum)*60);
    return speed;
}


// Format the timer
function formatTimer(num){
    let format = "00:00";
    let second = num % 60;
    let min= Math.floor(num / 60);
    if(second < 10){
        second = "0"+second;
    }
    if(min < 10){
        min ="0"+min;
    }
    format = min+":"+second;
    return format;
}


//Add reading result to list
function saveResult(){
    persons.push({
        id:persons.length+1,
        fullName:fullName.value,
        textTitle:selectedTitle,
        date:dateNow,
        speed:speed
    })
    
    clearForm();
    saveToLocalStorage();
    getFromLocalStorage();

    //Show list after 500 ms
    setTimeout(() => {
        saveResultPanel.style.display="none";
        resultTable.style.display="block";
        buttonStart.style.display="block";
        lang.style.display="block";
    }, 500);
    showResultList();
}


//Show result list
function showResultList(){
    resultList.innerHTML = ""
    persons.map(person =>{
        resultList.innerHTML += "<tr><td>"+person.id+"</td><td>"+person.date+"</td><td>"+person.fullName+"</td><td>"+person.textTitle+"</td><td>"+person.speed+"</td></tr>"
    })
}

// Save to local storage
function saveToLocalStorage(){
    localStorage.setItem("persons", JSON.stringify(persons));
}


// Get from localStorage
function getFromLocalStorage(){
    if(localStorage.getItem("persons")!==null){
         persons = JSON.parse(localStorage.getItem("persons"));
    }
}

// Clear localStorage
function clearList(){
    localStorage.removeItem("persons");
    resultTable.remove();
}   

function clearForm(){
    fullName.value ="";
}
init();
