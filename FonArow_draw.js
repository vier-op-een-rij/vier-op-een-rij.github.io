class Board_drawSimple2{
    #main
    constructor(main){
        this.#main = main;
    }

    // properties
    //!  addapt for later change: x , y , width , height;
    get x(){return 0;}
    get y(){return 0;}
    get width(){return 700;}
    get height(){return 600;}
    
    #cellBorder = 16
    get cellBorder(){return this.#cellBorder;}
    set cellBorder(value){  this.#cellBorder = value;}
    
    #colors = new Array('#666', 'yellow', 'red', 'blue')
    get cellBorderColor(){return this.#colors[0];}
    set cellBorderColor(value){  this.#colors[0] = value;}

    get player1Color(){return this.#colors[1];}
    set player1Color(value){  this.#colors[1] = value;}

    get player2Color(){return this.#colors[2];}
    set player2Color(value){  this.#colors[2] = value;}

    get noPlayerColor(){return this.#colors[3];}
    set noPlayerColor(value){  this.#colors[3] = value;}

    #stonesMargin = 10
    get stonesMargin(){return this.#stonesMargin;}
    set stonesMargin(value){  this.#stonesMargin = value;}
    
    //get stoneColors(){return this.#stoneColors}
    



    // calculated properties
    get cellWidth(){return this.width/7;}
    get cellHeight(){return this.height/6;}
    
    
    draw(boardState = this.#main.board,ctx = document.getElementById('MainCanvas').getContext('2d')){
        ctx.save()
        ctx.translate(this.x,this.y); //! adjust later
        //let Color = new Array('white', 'yellow', 'red', 'blue')
        let {width,height,cellWidth,cellHeight,cellBorder,stonesMargin,cellBorderColor} = this

        ctx.clearRect(0,0,this.width,this.height);
        // //! temp back drop
        // ctx.fillStyle = 'pink';
        // ctx.fillRect(0,0,this.width,this.height);
        // overlay 
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(width,0);
        ctx.lineTo(width,height);
        ctx.lineTo(0,height);
        ctx.lineTo(0,0);
        for (let x = 0;x<7;x++){
            for (let y = 0 ;y<6;y++){
                ctx.moveTo((x+1)*cellWidth - cellBorder/2,(y+0.5)*cellHeight)
                ctx.ellipse((x+0.5)*cellWidth,(y+0.5)*cellHeight,cellWidth / 2 - cellBorder/2,cellHeight / 2 - cellBorder/2,0, 0, 2*Math.PI)
            }
        }
        ctx.fillStyle = cellBorderColor;
        ctx.fill('evenodd')
        ctx.strokeStyle = cellBorderColor;
        ctx.stroke()
        // pips
        for (let x = 0;x<7;x++){
            for (let y = 0 ;y<6;y++){
                if (boardState.grid[x][y]){
                    ctx.fillStyle = this.#colors[boardState.grid[x][y]];
                    ctx.beginPath();
                    ctx.ellipse((x+0.5)*cellWidth,(y+0.5)*cellHeight,cellWidth / 2 - cellBorder/2-stonesMargin,cellHeight / 2 - cellBorder/2-stonesMargin,0, 0, 2*Math.PI);
                    ctx.closePath();
                    ctx.fill();
                }
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
        
        let text ='player '+boardState.winner.toString()+' has won'
        let arg = new Array(text,350,300)

        ctx.strokeStyle = 'white'
        ctx.lineWidth = 4.0
        ctx.strokeText(...arg)
        
        ctx.lineWidth = 1.0
        ctx.fillStyle = this.#colors[boardState.winner];
        ctx.fillText(...arg)

        ctx.strokeStyle = 'black'
        //ctx.lineWidth = 2.0
        ctx.strokeText(...arg)

        ctx.restore();
    }
}
//console.log('simple2 is loaded')
export{Board_drawSimple2}