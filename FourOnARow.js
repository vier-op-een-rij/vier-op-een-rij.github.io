import{Board_drawSimple2} from'./FonArow_draw.js';



class Board_State{
    
    constructor(){
        this.grid = new Array()
        for(let i = 0;i<7;i++){
            this.grid.push(new Array(6))
        }
        this.clear();
    }
    clear(){
        for(let x = 0 ;x<7;x++){
            for(let y = 0 ;y<6;y++){
                this.grid[x][y] = 0;
            }
        }
    }
    get isFull(){
        for (let x = 0;x < 7;x++){
           if (this.grid[x][0] == false){return false}
        }
        return true;
    }
    get winner(){
        return this.#checkFour();
    }
    #checkFour(){
        let answer = this.#checkVertical();
        if (answer) {return answer;}
        answer = this.#checkHorizontal();
        if (answer) {return answer;}
        return this.#checkDiagonal();
    }
    #checkVertical(){
        for (let x = 0;x<7;x++){
            let n = 0;
            let p = -1; 
            for (let y = 5;y>=0;y--){
                //if (this.grid[x][y] == false){
                //    y = -1;
                //} else {
                    if(this.grid[x][y] == p){
                        n++;
                    } else {
                        p = this.grid[x][y]; 
                        if (p == 0){p = -1;}
                        n = 1;
                    }
                    if(n == 4){return p}// found
                //}
            }
        }
        return false;
    }
    #checkHorizontal(){
        for (let y = 5;y>=0;y--){
            let n = 0;
            let p = -1; 
            for (let x = 0;x<7;x++){
                if(this.grid[x][y] == p){
                    n++;
                } else {
                    p = this.grid[x][y];
                    n = 1;
                }
                if(n == 4 && p > 0){
                    return p
                }
            }
        }
        return false;
    }
    #checkDiagonal(){
        // down Right
        for(let x = 0; x <4;x++){
            for(let y = 0; y <3;y++){
                let p = this.grid[x][y];
                if (p){
                    let same = true;
                    for (let i = 1;i<4;i++){
                       if(this.grid[x+i][y+i] != p){same = false;}
                    }
                    if (same){return p;}
                }
            }
        }
        // down left
        for(let x = 3; x <7;x++){
            for(let y = 0; y <3;y++){
                let p = this.grid[x][y];
                if (p){
                    let same = true;
                    for (let i = 1;i<4;i++){
                       if(this.grid[x-i][y+i] != p){same = false;}
                    }
                    if (same){return p;}
                }
            }
        }
        return false;
    }
    // toString(){
    //     return this.grid.toString();
    // }


    moveAvailable(x){
        return this.grid[x][0] == false;
    }
    performMove(x,player){
        let y = 0;
        while(y < 5 && this.grid[x][y+1]== false){
            y++;
        }
        this.grid[x][y] = player;
        //console.log(x+'/'+y)
    }

    //!used
    copy(){
        let nB = new Board_State();
        for(let x = 0; x < 7;x++){
            for (let y = 0;y<6;y++){
                nB.grid[x][y] = this.grid[x][y];
            }
        }
        return nB;
    }
}


class Board_drawSimple{
    #main
    constructor(main){
        this.#main = main;
    }

    draw(boardState = this.#main.board,ctx = document.getElementById('MainCanvas').getContext('2d')){
        ctx.save()
        let Color = new Array('white','yellow','red', 'grey')
        for (let x = 0;x<7;x++){
            for (let y = 0 ;y<6;y++){
                ctx.fillStyle = Color[boardState.grid[x][y]];
                ctx.fillRect(x*100,y*100,100,100)
                ctx.strokeRect(x*100,y*100,100,100)
            }
        }
        ctx.restore();
    }

    drawWinner(boardState = this.#main.board,ctx = document.getElementById('MainCanvas').getContext('2d')){
        //this.draw()
        //alert('player '+boardState.winner.toString()+' has won the game')
        ctx.save();
        ctx.font = "bold 64px serif";
        ctx.textAlign = 'center'
        ctx.fillStyle = 'green'
        ctx.fillText('player '+boardState.winner.toString()+' has won',350,300)

        ctx.strokeStyle = 'black'
        //ctx.strokeText('player '+boardState.winner.toString()+' has won',40,50)
        

        ctx.restore();
    }
}


class Main{
    
    board = new Board_State()
    painter = new Board_drawSimple2(this)
    constructor(){
        
    }
    get gameInProgress(){return this.board.winner == false;}
    #player = 1;
    get activePlayer(){
        return this.#player;
    }
    togglePlayer(){
        this.#player == 1? this.#player = 2: this.#player = 1;
    } // used in 1 place

    #AI = false
    get Using_AI(){
        if (this.#AI == false){return false}
        return true;
    }
    setAI(AI){
        this.#AI = AI;
    }

    // temp name
    activateMove(x){
        if(this.gameInProgress && this.board.moveAvailable(x)){
            this.board.performMove(x,this.#player);
            //this.togglePlayer();
            this.#postMove();
        }
        //this.painter.draw();
    }

    #postMove(){
        this.togglePlayer();
        this.painter.draw();
        if (this.board.winner != false){
            this.painter.drawWinner();
        }


        if(this.#player == 2 && this.#AI != false){
            // do the ai thing
            this.#AI.performMove();
        }
    }

}
class AI{
    #lv
    constructor(lv = 15){
        this.#lv = lv;
    }

    performMove(board = main.board){
        let posibleMoves = new Array();
        for (let x = 0;x<7;x++){
            if (board.moveAvailable(x)){posibleMoves.push(x)}
        }
        //console.log(posibleMoves)
        //
        //! more advanced choice here.
        //? check my winning move
        if(this.#lv > 0){
        for (let i = 0; i < posibleMoves.length;i++){
            if (this.#checkwinningmove(2,posibleMoves[i])==2){
                main.activateMove(posibleMoves[i])
                console.log('I win')
                return; // I win
            }
        }
        }
        //? check oponents winning move
        if(this.#lv > 1){
        for (let i = 0; i < posibleMoves.length;i++){
            if (this.#checkwinningmove(1,posibleMoves[i])==1){
                main.activateMove(posibleMoves[i])
                console.log('I will not let you')
                return; // stop you from winning
            }
        }
        }
        //? check losing move
        if(this.#lv > 2){
            let RemainingMoves = new Array();
            for (let i = 0; i < posibleMoves.length;i++){
                if (this.#checklosingmove(2,posibleMoves[i]) == false){
                    RemainingMoves.push(posibleMoves[i])
                }
            }
            if (RemainingMoves.length != 0){
                posibleMoves = RemainingMoves;
            } else {
                main.activateMove(posibleMoves[Math.floor(Math.random() * posibleMoves.length)]) // replace with not random?
                return; // admit defeat
            }   
        }
        //? check oponents losing move
        if(this.#lv > 3){
            let RemainingMoves = new Array();
            for (let i = 0; i < posibleMoves.length;i++){
                if (this.#checklosingmove(1,posibleMoves[i]) == 2){
                    //RemainingMoves.push(posibleMoves[i])
                    console.log('lv4 I deem move '+posibleMoves[i]+' advantages if my oponent makes it')
                } else {
                    RemainingMoves.push(posibleMoves[i])
                }
            }
            if (RemainingMoves.length != 0){
                posibleMoves = RemainingMoves;
            } // else all moves remain equaly posible and non have a preferance ti thus remains unchanged
        }
        //? get double win move
        if(this.#lv > 4){
        for (let i = 0; i < posibleMoves.length;i++){
            if (this.#checkDoubleWinMove(2,posibleMoves[i]) == true){
                console.log('lv5 this move just game me a guerantied win.')
                main.activateMove(posibleMoves[i])
                return; // win on next turn.
            } 
        }
        }
        //? prevent double win move
        if(this.#lv > 5){
            let RemainingMoves = new Array();
            for (let i = 0; i < posibleMoves.length;i++){
                if (this.#checkAllowsDouble(2,posibleMoves[i]) == false){
                    RemainingMoves.push(posibleMoves[i]);   
                }
            }
            if (RemainingMoves.length != 0){
                posibleMoves = RemainingMoves;
            } else {
                main.activateMove(posibleMoves[Math.floor(Math.random() * posibleMoves.length)]) // replace with not random?
                return; // admit defeat if oponent sees the double move 
            }   
        }
        //
        if(this.#lv > 6){

        }


        //
        main.activateMove(posibleMoves[Math.floor(Math.random() * posibleMoves.length)])
        return; // random move was made
    }

    #checkwinningmove(player, x, board = main.board){ 
        //! easy
        let bc = board.copy();
        bc.performMove(x,player)
        return bc.winner;
    }
    #checklosingmove(player, x, board = main.board){
        let other = 0;
        player == 2? other = 1: other = 2;
        let bc = board.copy();
        bc.performMove(x,player)
        if (bc.moveAvailable(x)){
            bc.performMove(x,other)
        } 
        return bc.winner;
    }
    #checkDoubleWinMove(player, x, board = main.board){
        //let other = 0;
        //player == 2? other = 1: other = 2;
        let bc = board.copy();
        bc.performMove(x,player)
        let count_wins = 0
        for(let i = 0;i < 7 ;i++){
            if(bc.moveAvailable(i)){
                if (this.#checkwinningmove(player,i,bc)){count_wins++}
            }
        }
        if (count_wins > 1){return true;} else {return false;}
    }
    #checkAllowsDouble(player,x, board = main.board){
        let other = 0;
        player == 2? other = 1: other = 2;
        let bc = board.copy();
        bc.performMove(x,player)
        for (let i = 0;i<7;i++){
            if (bc.moveAvailable(i)){
                if (this.#checkDoubleWinMove(other,i,bc)){
                    return true;
                }
            }
        }
        return false;
    }
    #checkPinMove(){}// see if move forces a losing move 

}


const main = new Main();
main.setAI(new AI());



//! who goes first randomizer
if (Math.floor(Math.random() * 2) == 1){
    let x = Math.floor(Math.random() * 7);
    main.board.grid[x][5] = 2;
}
// //! chalange
// main.board.grid[3][4] = 2;
// //! chalange2
// main.board.grid[3][5] = 3;


main.painter.draw();


let canvas = document.getElementById('MainCanvas')
canvas.addEventListener("click", (event) => {
    
    let x = Math.floor(event.offsetX / 100);
    // order move with x as a parameter
    main.activateMove(x);

   
});


