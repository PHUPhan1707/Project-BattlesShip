const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton= document.querySelector('#start-button')
const infoDisplay=document.querySelector('#info')
const turnDisplay=document.querySelector('#turn-display')



let angle = 0;

function flip() {
    const optionShips = Array.from(optionContainer.children);

    angle = angle === 0 ? 90 : 0;
    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`);
}

flipButton.addEventListener('click', flip);

const width = 10;

function createBoard(color, user) {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board');
    gameBoardContainer.style.backgroundColor = color;
    gameBoardContainer.id = user;
    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardContainer.append(block);
    }
    gamesBoardContainer.append(gameBoardContainer);
}

createBoard('#1AA7EC', 'player');
createBoard('#1AA7EC', 'computer');

class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];

let notDropped = false;

function getValidity(allBoardBlocks,isHorizontal,startIndex,ship){
    let validStart = isHorizontal ? (startIndex <= width * width - ship.length ? startIndex : width * width - ship.length) :
        (startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width);

    let shipBlocks = [];
    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
        }
    }

    let valid;
    if (isHorizontal) {
        valid = shipBlocks.every((_shipBlock, index) =>
            shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)));
    } else {
        valid = shipBlocks.every((_shipBlock, index) =>
            shipBlocks[0].id < 90 + (width * index + 1));
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));

    return{
        shipBlocks,valid,notTaken
    }
}

function addShipPiece(user, ship, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * width * width);

    let startIndex = startId ? startId : randomStartIndex;

    const { shipBlocks,valid,notTaken}=getValidity(allBoardBlocks,isHorizontal,startIndex,ship)

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name.toLowerCase());
            shipBlock.classList.add('taken');
        });
    } else {
        if (user === 'computer') addShipPiece(user, ship,startId); // Corrected recursion by passing 'user' argument
        if (user === 'player') notDropped = true;
    }
}

ships.forEach(ship => addShipPiece('computer', ship)); // Corrected 'computer' spelling

let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));

const allPlayerBlocks = document.querySelectorAll('#player div'); // Defined 'allPlayerBlocks'

allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver);
    playerBlock.addEventListener('drop', dropShip);
});

function dragStart(e) {
    notDropped = false;
    draggedShip = e.target;
}

function dragOver(e) {
    e.preventDefault();
    const ship= [draggedShip.id]
    highlightArea(e.target.id,ship)
}

function dropShip(e) {
    const startID = e.target.id;
    const ship = ships[draggedShip.id];
    addShipPiece('player', ship, startID);
    if (!notDropped) {
        draggedShip.remove();
    }
}

// Add highlight

function highlightArea(startIndex,ship)
{
    const allBoardBlocks= document.querySelectorAll('#player div')
    let isHoriztonal= angle===0

    const {shipBlocks,valid,notTaken}=getValidity(allBoardBlocks,isHoriztonal,startIndex,ship)

    if(valid && notTaken){
        shipBlocks.forEach(shipBlock=>{
            shipBlock.classList.add('hover')
            setTimeout(()=> shipBlock.classList.remove('hover'),500)
        })
    }
}

let gameOver = false
let hasHitShip = false
let playerTurn
function startGame(){
    if (playerTurn === undefined) {
        if (optionContainer.children.length != 0) {
            infoDisplay.textContent = 'Please place all your ship first!'
        } else {
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
            playerTurn = true
            turnDisplay.textContent = 'Your Turn !!!'
            infoDisplay.textContent = 'Play game now'
        }
    }
}
startButton.addEventListener('click',startGame)

let playerHits=[]
let computerHits=[]
const playerSunkShips=[]
const computerSunkShips=[]

function showGIF() {
    // Create a new image element
    var gifImage = document.createElement('YOUR.gif');

    // Set the source (URL) of the GIF
    gifImage.src = 'Picture/YOUR.gif';


    // Append the image element to a container in the HTML
    document.getElementById('gifContainer').appendChild(gifImage);
}

function handleClick(e){
    if(!gameOver){
        if ( e.target.classList.contains('taken')) {
            e.target.classList.add('wabam')
            infoDisplay.textContent = 'You hit the computer ship'
            let classes = Array.from(e.target.classList)
            classes = classes.filter(className => className !== 'boom')
            classes = classes.filter(className => className !== 'taken')
            classes = classes.filter(className => className !== 'block')
            playerHits.push(...classes)
            checkScore('player',playerHits,playerSunkShips)
        }
        if (!e.target.classList.contains('taken')){
            infoDisplay.textContent='You missed'
            e.target.classList.add('Missyou')

        }
        playerTurn= false
        const allBoardBlocks=document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block=> block.replaceWith(block.cloneNode(true)))
        setTimeout(ComputerGO,3000)
    }
}
//Define the computers  go
function ComputerGO() {
    if(!gameOver){
        turnDisplay.textContent='Computer Turn !'
        infoDisplay.textContent='The computer is thinking.....'

        setTimeout(() => {
            // Nếu máy tính chưa bắn trúng tàu chiến
            if (!hasHitShip) {
                let randomGO = Math.floor(Math.random() * width * width);
                const allBoardBlocks = document.querySelectorAll('#player div');
                if (
                    allBoardBlocks[randomGO].classList.contains('taken') &&
                    allBoardBlocks[randomGO].classList.contains('wabam')
                ) {
                    // Nếu ô đã được bắn trúng trước đó, gọi lại hàm ComputerGO để chọn ô khác
                    ComputerGO();
                    return;
                } else if (
                    allBoardBlocks[randomGO].classList.contains('taken') &&
                    !allBoardBlocks[randomGO].classList.contains('wabam')
                ) {
                    // Nếu ô đã được chiếm nhưng chưa bị bắn trúng, đánh dấu là bắn trúng và hiển thị thông báo tương ứng
                    allBoardBlocks[randomGO].classList.add('wabam');
                    infoDisplay.textContent = 'The computer hit your ship !';
                    let classes = Array.from(e.target.classList);
                    classes = classes.filter(className => className !== 'block');
                    classes = classes.filter(className => className !== 'boom');
                    classes = classes.filter(className => className !== 'taken');
                    computerHits.push(...classes);
                    checkScore('computer', computerHits, computerSunkShips);
                    hasHitShip = true;
                    return;
                    // Đặt hasHitShip thành true để chỉ ra rằng máy tính đã bắn trúng
                } else {
                    // Nếu ô chưa được chiếm, đánh dấu là bắn trượt và hiển thị thông báo tương ứng
                    infoDisplay.textContent = 'The computer missed';
                    allBoardBlocks[randomGO].classList.add('Missyou');
                }
            }
            else {
                // Nếu máy tính đã bắn trúng tàu chiến, tiếp tục tìm các ô xung quanh ô đã bắn trúng
                // và thực hiện các hành động tương ứng
                // Viết mã xử lý tìm các ô xung quanh và thực hiện các hành động tương ứng ở đây
                // Nếu ô hàng xóm đã được bắn trúng trước đó, tiếp tục tìm ô hàng xóm khác
                // Viết mã xử lý tiếp tục tìm ô hàng xóm khác ở đây
                let nextAdjacentCell;
                let adjacentCell = 4;
                for (let i = 0; i < adjacentCell; i++) {
                    if (!adjacentCells[i].classList.contains('wabam')) {
                        nextAdjacentCell = adjacentCells[i];
                        break;
                    }
                }

// Nếu có ô hàng xóm không bị bắn trúng, chọn ô đó và thực hiện các hành động tương ứng
                if (nextAdjacentCell) {
                    nextAdjacentCell.classList.add('wabam');
                    infoDisplay.textContent = 'The computer hit your ship !';
                    let classes = Array.from(nextAdjacentCell.classList);
                    classes = classes.filter(className => className !== 'block');
                    classes = classes.filter(className => className !== 'boom');
                    classes = classes.filter(className => className !== 'taken');
                    computerHits.push(...classes);
                    checkScore('computer', computerHits, computerSunkShips);
                } else {
                    // Nếu không có ô hàng xóm nào chưa được bắn trúng, máy tính sẽ quay trở lại chế độ bắn ngẫu nhiên
                    // Viết mã xử lý khi không tìm thấy ô hàng xóm chưa được bắn trúng ở đây
                    // Ví dụ: Gọi lại hàm ComputerGO() để máy tính tiếp tục bắn ngẫu nhiên
                    ComputerGO();
                }

            }
        }, 1500); // Thời gian chờ trước khi máy tính thực hiện bắn

        setTimeout(()=>{
            playerTurn=true
            turnDisplay.textContent='Your Turn !!!'
            infoDisplay.textContent='Please click on the board to attack the computer ship'
            const allBoardBlocks=document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block=> block.addEventListener('click',handleClick))
        },6000)
    }
}



    function checkScore(user,userHits,userSunkShips){
    function checkShip(shipName,shipLength) {
        if (
            userHits.filter(storedShipName => storedShipName === shipName).length === shipLength
        ) {
            infoDisplay.textContent = `You sunk the ${shipName}`
            if (user === 'player') {
                playerHits=userHits.filter(storedShipName=> storedShipName !== shipName)
            }
            if (user === 'computer') {
                computerHits=userHits.filter(storedShipName=> storedShipName !== shipName)
            }
            userSunkShips.push(shipName)
        }
    }
    checkShip('destroyer',2)
    checkShip('submarine',3)
    checkShip('cruiser',3)
    checkShip('battleship',4)
    checkShip('carrier',5)

    console.log('playerHits',playerHits)
    console.log('playerSunkShips',playerSunkShips)
    if (playerSunkShips.length === 5) {
        infoDisplay.textContent = 'You sunk all the computer ships.Congratulations you win!'
        gameOver = true
    }
    if (computerSunkShips.length === 5) {
        infoDisplay.textContent = 'The computer sunk all your ships. You lose!'
        gameOver = true

        gameOver = true
    }
}