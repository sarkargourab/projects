const n = 50;
const array = [];

let audioCtx = null;
let animationSpeed = 100;

init();

function playNote(freq){//frequency
    if (audioCtx == null){
        audioCtx = new(
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0,audioCtx.currentTime+dur);
    osc.connect(node)
    osc.connect(audioCtx.destination)
}

function init(){
    for(let i= 0;i<n;i++){
        array[i] = Math.random();
    }
    showBar();
}

function play() {
    const algorithm = document.getElementById("algorithm").value;
    const copy = [...array];
    let moves;

    switch(algorithm){
        case "bubble":
            moves = bubbleSort(copy);
            break;
        case "selection":
            moves = selectionSort(copy);
            break;
        case "insertion":
            moves = insertionSort(copy);
            break;

        default:
            console.error("Unknown sorting algorithm");
            return;
        
    }

    animate(moves);
}

function animate(moves){
    if (moves.length == 0) {
        showBar();
        return;
    }
    const move = moves.shift();
    const [i,j] = move.indices

    if(move.type == "swap"){
        [array[i],array[j]] = [array[j],array[i]];
    }
    playNote(100+array[i]*500);
    playNote(100+array[j]*500);
    showBar(move);
    setTimeout (function(){
        animate(moves);
    },animationSpeed);
}

function bubbleSort(array){
    const moves = [];
    do{
        var swapped = false;
        for(let i = 1;i<array.length;i++){
            moves.push({
                indices:[i-1,i],
                type:"comp"});
            if(array[i-1]>array[i]){
                swapped = true;
                moves.push({
                    indices:[i-1,i],
                    type:"swap"});
                [array[i-1],array[i]]=[array[i],array[i-1]];
            }
        }
    }while(swapped);
    return moves;
}

function selectionSort(array) {
    const moves = [];
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < array.length; j++) {
            moves.push({indices: [minIdx, j], type: "comp"});
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            moves.push({indices: [i, minIdx], type: "swap"});
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
        }
    }
    return moves;
}

function insertionSort(array) {
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            moves.push({indices: [j - 1, j], type: "comp"});
            moves.push({indices: [j - 1, j], type: "swap"});
            [array[j - 1], array[j]] = [array[j], array[j - 1]];
            j--;
        }
    }
    return moves;
}

function showBar(move){
    container.innerHTML = "";
    for(let i = 0; i<array.length;i++){
        const bar = document.createElement("div");
        bar.style.height = array[i]*100+"%";
        bar.classList.add("bar");

        if(move && move.indices.includes(i)){
            bar.style.backgroundColor =
             move.type == "swap"?"red":"blue";
        }
        container.appendChild(bar);
    }
}

function updateSpeed() {
    animationSpeed = document.getElementById('speed').value;
}