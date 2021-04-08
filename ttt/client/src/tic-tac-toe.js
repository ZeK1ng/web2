import { LitElement, html, css } from 'lit-element';
import  io from 'socket.io-client';
class TicTacToe extends LitElement {
  constructor() {
    super();
    this.board= ["","","","","","","","",""];
    this.firstPlayer = "First P";
    this.secondPlayer ="Sec P";
    this.winner = "";
    this.currentPlayer ="X";
    this.cellsFilled=0;
    this.gameOn = true;
    this.firstPlayerScore = 0;
    this.secondPlayerScore = 0;
    this.winningStates = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];
    this.socket = io('localhost:8081');
    setInterval(() => {
      this.setupSocket();
    }, 0);
  }


  static get properties(){
    return{
      board: Array,
      firstPlayer:String,
      secondPlayer:String,
      winner :String
    }
  }
  setupSocket(){
    this.socket.on('changeName',(playerName)=>{
      console.log(playerName);
      debugger;
      if(this.firstPlayer==="First P"){
        const k = this.firstPlayer;
        this.firstPlayer=playerName;
        this.requestUpdate("firstPlayer",k);
        return;
      }
      if(this.secondPlayer === "Sec P"){
        const k = this.secondPlayer;
        this.secondPlayer=playerName;
        this.requestUpdate("secondPlayer",k);
      }
    });
    this.socket.on('reset',()=>{

    });
    this.socket.on('win',(playername)=>{

    });
    this.socket.on('disconect',()=>{

    });
  }
  static get styles(){
    return css`
      :host {
        // display:flex;
        // flex-direction:column;
        // align-items:center;
      }
      .player-container{
        height: 40px;
        width: 30px;
        display: flex;
        justify-content: space-between;
    
      }
      .board-score-container{
        display:flex;
        flex-direction:column;
        align-items:center;
      }
      .board-container{
        height: 170px;
        width: 240px;
        border: 1px solid black;
        display: grid;
        grid-template-columns: repeat(3, auto);
        margin: auto;
      }
      .cell {
          height: 40px;
          line-height: 40px;
          text-align: center;
          width: 60px;
          margin: 5px;
          border: 1px solid black;
          font-size: 30px;
          cursor: pointer;
          color:black;
      }
      .player{
        margin-right : 5px;
        font-size:12px;
      }
      .reset{
        height: 20px;
        width: 60px;
        border: 1px solid black;
        margin-top: 20px;
        cursor: pointer;
        background-color: green;
      }
      .score{
       display:flex;
      }
      .player-score{
        height: 40px;
        line-height: 40px;
        text-align: center;
        width: 120px;
        margin: 5px;
        border: 1px solid black;
        font-size: 20px;
        color:black;
      }
      .winner{
        height: 40px;
        line-height: 40px;
        text-align: center;
        width: 120px;
        margin: 5px;
        border: 1px solid black;
        font-size: 20px;
        color:red;
      }
  `;
  }

  handleClick(index){
      if(!this.gameOn)return;
      if(this.board[index] !=="")return;
      this.board[index]=this.currentPlayer;
      this.board=[...this.board];
      if(this.currentPlayer ==="X"){
        this.currentPlayer ="O";
      }else{
        this.currentPlayer="X";
      }
      this.cellsFilled++;
      if(this.cellsFilled === 9 ){
        this.gameOn = false;
        const k = this.winner;
        this.winner = "Draw";
        this.requestUpdate("winner",k);
      }
      this.checkWin();
  }
  checkWin(){
    for(let i =0 ; i< this.winningStates.length; i++){
      const currRow = this.winningStates[i];
      const ind1=currRow[0];
      const ind2=currRow[1];
      const ind3=currRow[2];
      if(this.board[ind1] !="" && this.board[ind2]!="" && this.board[ind3] !=""){
        if(this.board[ind1]==this.board[ind2] && this.board[ind2]== this.board[ind3]){
          if(this.board[ind1] === "X"){
            const k = this.winner;
            this.winner = this.firstPlayer+" Won";
            this.requestUpdate("winner",k);
            this.firstPlayerScore++;
          }else{
            const k = this.winner;
            this.winner = this.secondPlayer+" Won";
            this.requestUpdate("winner",k)/
            this.secondPlayerScore++;
          }
          this.gameOn=false;
          return;
        }
      }
    }
  }
  resetGame(){
    this.board= ["","","","","","","","",""];
    this.currentPlayer ="X";
    this.cellsFilled=0;
    this.gameOn = true;
    this.board=[...this.board];
    const k = this.winner;
    this.winner = "";
    this.requestUpdate("winner",k);

  }

  updateAndRenderName(e){
    console.log(e.target.value);
    this.socket.emit('playerEntered',e.target.value);
  }

  
  // updateAndRenderSp(e){
  //   const k = this.secondPlayer;
  //   this.secondPlayer=e.target.value;
  //   if(this.secondPlayer === "") this.secondPlayer="Sec P";
    
  //   this.requestUpdate("secondPlayer",k);
  // }

  render() {
    return html`
      <div class = "player-container">
        <input
          type="text"
          name="first-player"
          class="player"
          placeholder="Enter name"
          @change=${(e) => (this.updateAndRenderName(e))}
        />
      </div>
      <div class = "reset" @click = ${()=> this.resetGame()}>Reset</div>
      <div class = "board-score-container">
      <div class = "winner">${this.winner}</div>
      <div class="score">
        <div class="player-score"> ${this.firstPlayer} ${this.firstPlayerScore}</div>
        <h3>:</h3>
        <div class="player-score"> ${this.secondPlayerScore} ${this.secondPlayer}</div>
      </div>
    
        <div class="board-container">
          ${this.board.map((cell,i)=> 
            html`
            <div
                class="cell"
                @click=${() => {
                    this.handleClick(i);
                }}
            >
                ${cell}
            </div>
        `
          )}
        </div>      </div>
   
    `;
  }

}

customElements.define('tic-tac-toe', TicTacToe);
