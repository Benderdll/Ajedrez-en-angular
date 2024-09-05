import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tabla-ajedrez-test';

  board: string[][] = [
    ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
    ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
    ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
    ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
    ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
    ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
    ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8'],
    ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8']
  ];

  blackPieces: string[] = ['♜', '♞', '♝', '♛', '♚', '♟'];
  whitePieces: string[] = ['♖', '♘', '♗', '♕', '♔', '♙'];

  piecePositions: { [key: string]: string } = {

  };

  selectedCell: string | null = null;
  possibleMoves: string[] = [];
  // Piezas seleccionadas
  selectedPiece: string | null = null;

  whiteTurn: boolean = true;

  // toggleTurn() {
  //   this.whiteTurn = !this.whiteTurn;
  // }

  ngOnInit() {
    this.resetBoard();
  }

  isWhitePiece(piece: string): boolean {
    return this.whitePieces.includes(piece);
  }

  // Método para seleccionar una pieza
  selectPiece(piece: string): void {
    this.selectedPiece = piece;
  }

  clearMove() {
    this.selectedCell = null;
    this.selectedPiece = null;
    this.possibleMoves = [];
    
  }

  finishTurn() {
    this.whiteTurn = !this.whiteTurn;
  }

  resetBoard() {
    this.piecePositions = {

      // Torres
      'A1': '♜', 'H1': '♜', 'A8': '♖', 'H8': '♖',
      // Caballos
      'B1': '♞', 'G1': '♞', 'B8': '♘', 'G8': '♘',
      // Alfiles
      'C1': '♝', 'F1': '♝', 'C8': '♗', 'F8': '♗',
      // Reina
      'D1': '♛', 'D8': '♕',
      // Rey
      'E1': '♚', 'E8': '♔',
      // Peones
      'A2': '♟', 'B2': '♟', 'C2': '♟', 'D2': '♟', 'E2': '♟', 'F2': '♟', 'G2': '♟', 'H2': '♟',
      // Peones
      'A7': '♙', 'B7': '♙', 'C7': '♙', 'D7': '♙', 'E7': '♙', 'F7': '♙', 'G7': '♙', 'H7': '♙'
    };
    this.clearMove();
    this.whiteTurn = true;
  }

  selectCell(cell: string) {
    if (cell === this.selectedCell) {
      this.clearMove();
      return;
    }else if(this.selectedCell && this.selectedCell != cell && !this.possibleMoves.includes(cell)){
      this.clearMove();
    
    } else if(this.possibleMoves.includes(cell)) {
        if (Object.keys(this.piecePositions).includes(cell)) { 
  
          if (this.selectedPiece !== null) {
            console.log(this.selectedCell, this.selectedPiece, "moved to",cell,"and eated",this.piecePositions[cell]);
            this.piecePositions[cell] = this.selectedPiece;
            delete this.piecePositions[this.selectedCell!];
          }
          this.clearMove();
          this.finishTurn();
          return;
        } else {
          if (this.selectedPiece !== null && this.selectedCell !== null) {
            this.piecePositions[cell] = this.selectedPiece;
            delete this.piecePositions[this.selectedCell];
            console.log(this.selectedCell, this.piecePositions[cell], "moved to",cell);
            this.clearMove();
            this.finishTurn();
  
          } else {
            console.error('Selected piece is null');
        }
      } 

    } else {

      if(this.getSelectedPiece(cell) != null) {
        if(this.whiteTurn == this.isWhitePiece(this.getSelectedPiece(cell))){
          this.selectedCell = cell;
          this.selectedPiece = this.getSelectedPiece(cell)
          
        }
      
      } else {
        this.selectedPiece = null;
      }

      switch (this.selectedPiece) {
        // BLACK PIECES \\
        case '♞': // Caballo
        case '♘': // Caballo
          this.possibleMoves = this.calculateKnightMoves(cell);
          break;
        case '♜': // Torre
        case '♖': // Torre
          this.possibleMoves = this.calculateRookMoves(cell);
          break;
        case '♝': // Alfil
        case '♗': // Alfil
          this.possibleMoves = this.calculateBishopMoves(cell);
          break;
        case '♛': // Reina
        case '♕': // Reina
          this.possibleMoves = this.calculateQueenMoves(cell);
          break;
        case '♚': // Rey
        case '♔': // Rey
          this.possibleMoves = this.calculateKingMoves(cell);
          break;
        case '♟':
          this.possibleMoves= this.calculateBlackPawnMoves(cell);
          break;     
        // WHITE PAWN \\
        case '♙':
          this.possibleMoves= this.calculateWhitePawnMoves(cell);
          break;
          // NULL PIECE \\
        default:
          this.possibleMoves = [];
          break;
      }
    }

  }

  getSelectedPiece(cell: string) {
    return this.piecePositions[cell];
  }

  calculateKnightMoves(cell: string): string[] {
    const moves: string[] = [];
    const [col, row] = [cell.charCodeAt(0), parseInt(cell[1])];
    const knightMoves = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];

    for (const [dx, dy] of knightMoves) {
      const newCol = String.fromCharCode(col + dx);
      const newRow = row + dy;
      // if (newCol >= 'A' && newCol <= 'H' && newRow >= 1 && newRow <= 8 && !this.piecePositions[newCol + newRow]) {
      if (newCol >= 'A' && newCol <= 'H' && newRow >= 1 && newRow <= 8){
        if(this.piecePositions[newCol + newRow]){
          if(this.selectedPiece != null && this.isWhitePiece(this.piecePositions[newCol + newRow]) != this.isWhitePiece(this.selectedPiece)){
            moves.push(`${newCol}${newRow}`);
          }
        }else{
          moves.push(`${newCol}${newRow}`);
        }
      }
    }

    return moves;
  }

  calculateRookMoves(cell: string): string[] {
    const moves: string[] = [];
    const [col, row] = [cell.charCodeAt(0), parseInt(cell[1])];

    // Direcciones posibles para la torre
    const directions = [
      [1, 0], [-1, 0], // Horizontal (derecha, izquierda)
      [0, 1], [0, -1]  // Vertical (arriba, abajo)
    ];

    for (const [dx, dy] of directions) {
      let newCol = col;
      let newRow = row;

      // Sigue moviéndote en la dirección hasta que llegues al borde del tablero
      while (true) {
        newCol += dx;
        newRow += dy;
        // if (newCol >= 'A'.charCodeAt(0) && newCol <= 'H'.charCodeAt(0) && newRow >= 1 && newRow <= 8 && !this.piecePositions[String.fromCharCode(newCol) + newRow]) {
        if (newCol >= 'A'.charCodeAt(0) && newCol <= 'H'.charCodeAt(0) && newRow >= 1 && newRow <= 8) {

          if(this.piecePositions[String.fromCharCode(newCol) + newRow]){
            if(this.selectedPiece != null && this.isWhitePiece(this.piecePositions[String.fromCharCode(newCol) + newRow]) != this.isWhitePiece(this.selectedPiece)){
              moves.push(`${String.fromCharCode(newCol)}${newRow}`);
              break;
            }else{
              break;
            }
          }
          moves.push(`${String.fromCharCode(newCol)}${newRow}`);
        } else {
          break;
        }
      }
    }

    return moves;
  }

  calculateBishopMoves(cell: string): string[] {
    const moves: string[] = [];
    const [col, row] = [cell.charCodeAt(0), parseInt(cell[1])];

    // Direcciones posibles para el alfil
    const directions = [
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [dx, dy] of directions) {
      let newCol = col + dx;
      let newRow = row + dy;
      // while (newCol >= 'A'.charCodeAt(0) && newCol <= 'H'.charCodeAt(0) && newRow >= 1 && newRow <= 8 && !this.piecePositions[String.fromCharCode(newCol) + newRow]) {
      while (newCol >= 'A'.charCodeAt(0) && newCol <= 'H'.charCodeAt(0) && newRow >= 1 && newRow <= 8) {
        
        if(this.piecePositions[String.fromCharCode(newCol) + newRow]){
          if(this.selectedPiece != null && this.isWhitePiece(this.piecePositions[String.fromCharCode(newCol) + newRow]) != this.isWhitePiece(this.selectedPiece)){
            moves.push(`${String.fromCharCode(newCol)}${newRow}`);
            break;
          }else{
            break;
          }
        }
        moves.push(`${String.fromCharCode(newCol)}${newRow}`);
        newCol += dx;
        newRow += dy;
      }
    }

    return moves;
  }

  calculateQueenMoves(cell: string): string[] {
    // La reina combina los movimientos del alfil y la torre
    return [...this.calculateBishopMoves(cell), ...this.calculateRookMoves(cell)];
  }

  calculateKingMoves(cell: string): string[] {
    const moves: string[] = [];
    const [col, row] = [cell.charCodeAt(0), parseInt(cell[1])];

    // Movimientos posibles para el rey
    const kingMoves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [dx, dy] of kingMoves) {
      const newCol = String.fromCharCode(col + dx);
      const newRow = row + dy;
      if (newCol >= 'A' && newCol <= 'H' && newRow >= 1 && newRow <= 8){
        if(this.piecePositions[newCol + newRow]){
          if(this.selectedPiece != null && this.isWhitePiece(this.piecePositions[newCol + newRow]) != this.isWhitePiece(this.selectedPiece)){
            moves.push(`${newCol}${newRow}`);
          }
        }else{
          moves.push(`${newCol}${newRow}`);
        }
      }
    }

    return moves;
  }

  calculateBlackPawnMoves(cell: string): string[] {
    const moves: string[] = [];
    const [col, row] = [cell.charCodeAt(0), parseInt(cell[1])];
  
    // Movimiento hacia abajo
    const newRow = row + 1;
    if (newRow >= 1 && newRow <= 8 && !this.piecePositions[String.fromCharCode(col) + (row+1)]) {
      moves.push(`${String.fromCharCode(col)}${newRow}`);
    }
  
    // Movimiento inicial de dos casillas hacia abajo
    if (row === 2) {
      const doubleMoveRow = row + 2;
      if (doubleMoveRow >= 1 && doubleMoveRow <= 8 && !this.piecePositions[String.fromCharCode(col) + (newRow)]) {
        moves.push(`${String.fromCharCode(col)}${doubleMoveRow}`);
      }else{
        console.log("Can't move to", String.fromCharCode(col) + (row+1), "because there is a piece in the way");
      }
    }

    //diagonal abajo
    if(this.piecePositions[String.fromCharCode(col+1) + (newRow)]){
      if(this.isWhitePiece(this.piecePositions[String.fromCharCode(col+1) + (newRow)])){
        moves.push(`${String.fromCharCode(col+1)}${newRow}`);
      }
      
    }
    //diagonal arriba
    if(this.piecePositions[String.fromCharCode(col-1) + (newRow)]){
      if(this.isWhitePiece(this.piecePositions[String.fromCharCode(col-1) + (newRow)])){
        moves.push(`${String.fromCharCode(col-1)}${newRow}`);
      }
    }
    return moves;
  }

  calculateWhitePawnMoves(cell: string): string[] {
    const moves: string[] = [];
    const [col, row] = [cell.charCodeAt(0), parseInt(cell[1])];
  
    // Movimiento hacia abajo
    const newRow = row - 1;
    if (newRow >= 1 && newRow <= 8 && !this.piecePositions[String.fromCharCode(col) + (newRow)]) {
      moves.push(`${String.fromCharCode(col)}${newRow}`);
    }
  
    // Movimiento inicial de dos casillas hacia abajo
    if (row === 7) {
      const doubleMoveRow = row - 2;
      if (doubleMoveRow >= 1 && doubleMoveRow <= 8 && !this.piecePositions[String.fromCharCode(col) + (row-1)]) {
        moves.push(`${String.fromCharCode(col)}${doubleMoveRow}`);
      }else{
        console.log("Can't move to", String.fromCharCode(col) + (row-1), "because there is a piece in the way");
      }
    }

    //diagonal abajo
    if(this.piecePositions[String.fromCharCode(col+1) + (newRow)]){
      if(!this.isWhitePiece(this.piecePositions[String.fromCharCode(col+1) + (newRow)])){
        moves.push(`${String.fromCharCode(col+1)}${newRow}`);
      }
      
    }

    //diagonal arriba
    if(this.piecePositions[String.fromCharCode(col-1) + (newRow)]){
      if(!this.isWhitePiece(this.piecePositions[String.fromCharCode(col-1) + (newRow)])){
        moves.push(`${String.fromCharCode(col-1)}${newRow}`);
      }
    }
    
  
    return moves;
  }
}
