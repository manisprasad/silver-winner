type BoardProps = {
    isMyTurn: boolean,
    board: (null | "X" | "O")[],
    onCellClick: (index: number) => void
  }
  
  export const Board = ({ isMyTurn, board, onCellClick }: BoardProps) => {
    console.log(isMyTurn)
    return (
      <div className={`grid grid-cols-3 gap-2 w-72 mx-auto p-4 ${isMyTurn ? "border-green-500" : "border-gray-600"} border-2 bg-gray-800 rounded-xl shadow-xl`}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => onCellClick(idx)}
            className="w-20 h-20 text-3xl font-bold flex items-center justify-center bg-gray-700 text-white rounded-xl hover:bg-gray-600 disabled:opacity-40 transition-all"
            disabled={cell !== null}
          >
            {cell}
          </button>
        ))}
      </div>
    )
  }
  