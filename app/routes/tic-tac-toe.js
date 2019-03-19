import Route from '@ember/routing/route';

export default Route.extend({
      init() {
        var turn = "X";
        localStorage.turn = turn;
        this._super();

        let c = document.createElement("canvas");
        c.id = 'board';
        c.height = 1500;
        c.width = 1500;
        document.body.appendChild(c);

        let myBoard = ["","","","","","","","",""];
        localStorage.setItem("myBoard", JSON.stringify(myBoard));
        this.drawGrid();
        this.clickEvent();
      },
        clickEvent(){
          var self = this;
          document.body.onclick = function (event) {
            let c = document.getElementById("board");
            let dim = (c.height+c.width)/2;
            let pos = c.getBoundingClientRect();
            let top = Math.floor(pos.top);
            let left = Math.floor(pos.left);
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            let width = Math.floor(c.width /3);
            let height = Math.floor(c.height /3);
            if(mouseX < left || mouseY < top || mouseX > width || mouseY > height) return;
            let x = Math.floor((mouseX - left)/(dim / 9));
            let y = Math.floor((mouseY - top)/(dim / 9));
            let index = (3 * y) + x;
            if(index < 0 || index > 8) return;
            else {
              self.selectBox(index);
              self.drawGrid();
            }
          }
        },

        drawGrid() {
          let c = document.getElementById("board");
          let dim = (c.height+c.width)/2;
          let ctx = c.getContext("2d");
          let size = (dim /9);
          let rowIndex;
          let colIndex;
          let index;
          ctx.lineWidth = 3;
          for (rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (colIndex = 0; colIndex < 3; colIndex++) {
              index = (3 * rowIndex) + colIndex;
              switch (this.getText(this.getBoard(), index)) {
                case "O":
                  ctx.strokeStyle = "black";
                  ctx.beginPath();
                  ctx.arc((size * colIndex)+(size/2), (size * rowIndex)+(size/2), size/3, 0, 2 * Math.PI);
                  ctx.stroke();
                  break;
                case "X":
                  ctx.strokeStyle = "black";
                  let xSize = size*0.80;
                  ctx.beginPath();
                  ctx.moveTo((size * colIndex)+(xSize), (size * rowIndex)+(xSize));
                  ctx.lineTo((size * (colIndex +1))-(xSize), (size * (rowIndex+1))-(xSize));
                  ctx.moveTo((size * colIndex)+(xSize), (size * (rowIndex+1))-(xSize));
                  ctx.lineTo((size * (colIndex +1))-(xSize), (size * (rowIndex))+(xSize));
                  ctx.stroke();
                  break;
                default:
                  ctx.fillStyle = "white";
                  ctx.fillRect(size * colIndex, size * rowIndex, size, size);
                  break;
              }
              ctx.strokeStyle = "black";
              ctx.strokeRect(size * colIndex, size * rowIndex, size, size);
            }

          }
          ctx.beginPath();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 10;
          ctx.moveTo(0, 0);
          ctx.lineTo(0, dim/3);


          ctx.moveTo(dim/3, 0);
          ctx.lineTo(dim/3, dim/3);

          ctx.moveTo(0, dim/3);
          ctx.lineTo(dim/3, dim/3);


          ctx.moveTo(0, 0);
          ctx.lineTo(dim/3, 0);

          ctx.stroke();
          ctx.lineWidth = 1;
        },

        getText(board, id) {
          return board[id];
        },

        getState(board) {
          //top row win
          if (this.getText(board, 0) != "" && this.getText(board, 0) === this.getText(board, 1) && this.getText(board, 0) === this.getText(board, 2)) {
            return this.getText(board, 0);
          }
          //middle row win
          if (this.getText(board, 3) != "" && this.getText(board, 3) === this.getText(board, 4) && this.getText(board, 3) === this.getText(board, 5)) {
            return this.getText(board, 3);
          }
          //lower row win
          if (this.getText(board, 6) != "" && this.getText(board, 6) === this.getText(board, 7) && this.getText(board, 6) === this.getText(board, 8)) {
            return this.getText(board, 6);
          }

          //left column win
          if (this.getText(board, 0) != "" && this.getText(board, 0) === this.getText(board, 3) && this.getText(board, 0) === this.getText(board, 6)) {
            return this.getText(board, 0);
          }
          //middle column win
          if (this.getText(board, 1) != "" && this.getText(board, 1) === this.getText(board, 4) && this.getText(board, 1) === this.getText(board, 7)) {
            return this.getText(board, 1);
          }
          //right column win
          if (this.getText(board, 2) != "" && this.getText(board, 2) === this.getText(board, 5) && this.getText(board, 2) === this.getText(board, 8)) {
            return this.getText(board, 2);
          }

          //diagonal column win
          if (this.getText(board, 0) != "" && this.getText(board, 0) === this.getText(board, 4) && this.getText(board, 0) === this.getText(board, 8)) {
            return this.getText(board, 0);
          }
          //diagonal column win
          if (this.getText(board, 2) != "" && this.getText(board, 2) === this.getText(board, 4) && this.getText(board, 2) === this.getText(board, 6)) {
            return this.getText(board, 2);
          }
          if (this.getAvailableSpaces().length === 0) return "!";
          else return "";
        },

        getAvailableSpaces() {
          let spaces = [];
          let i;
          for (i = 0; i <= 8; i++) {
            if (this.getText(this.getBoard(), i) === "") {
              spaces.push(i);
            }
          }
          return spaces;
        },

        getAvailableSpace(board) {
          let spaces = [];
          let i;
          for (i = 0; i <= 8; i++) {
            if (board[i] === "") {
              spaces.push(i);
            }
          }
          return spaces;
        },

        getBoard() {
          return JSON.parse(localStorage.getItem("myBoard"));
        },

        heuristic(board, depth) {
          let state = this.getState(board);
          if (state === "O") {
            return 100 + depth;
          } else if (state == "X") {
            return -100 - depth;
          }
          return 0;
        },

        miniMax(board, depth, isMax) {
          let availableSpaces = this.getAvailableSpace(board);
          if (depth === 0 || this.getState(this.getBoard()) != "") {
            return this.heuristic(board, depth);
          }
          let value;
          if (isMax) {
            value = -Number.MAX_VALUE;
            availableSpaces.forEach((space) => {
              board[space] = "O";
              value = Math.max(value, this.miniMax(board, depth - 1, false));
              board[space] = "";
            });
          } else {
            value = Number.MAX_VALUE;
            availableSpaces.forEach((space) => {
              board[space] = "X";
              value = Math.min(value, this.miniMax(board, depth - 1, true));
              board[space] = "";
            });
          }
          return value;
        },

        bestMove() {
          let available = this.getAvailableSpaces();
          let board = this.getBoard();
          let bestValue = -Number.MAX_VALUE;
          let bestMove = -1;
          let value;
          available.forEach((space) => {
            board[space] = "O";
            value = this.miniMax(board, 5, false);
            board[space] = "";
            if (value >= bestValue) {
              bestValue = value;
              bestMove = space;
            }
          });
          return bestMove;
        },

        endGame(state) {
          let grid = this.getBoard();
          for (let i = 0; i <= 8; i++) {
            grid[i] = "";
          }
          localStorage.setItem("myBoard", JSON.stringify(grid));
          localStorage.turn = "X";
          return alert(state);
        },

          selectBox(index) {
            let grid = this.getBoard();
            if (grid[index] === "") {
              if (localStorage.turn === "X") {
                grid[index] = localStorage.turn;
                //document.getElementById(id).innerText = localStorage.turn;
                let state = this.getState(grid);
                if (state != "") {
                  if (state == "!") return this.endGame("TIE");
                  else return this.endGame(localStorage.turn + " WINS");
                }
                localStorage.setItem("myBoard", JSON.stringify(grid));
                localStorage.turn = "O";
              }
            }
            if (localStorage.turn === "O") {
              grid[this.bestMove()] = localStorage.turn;
              //document.getElementById(this.bestMove()).innerText = localStorage.turn;
              let state = this.getState(grid);
              if (state != "") {
                if (state == "!") return this.endGame("TIE");
                else return this.endGame(localStorage.turn + " WINS");
              }
              localStorage.setItem("myBoard", JSON.stringify(grid));
              localStorage.turn = "X";
            }
          },
      });
