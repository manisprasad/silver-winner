type BoardProps = {
    isMyTurn: boolean,
    board: (null | "X" | "O")[],
    onCellClick: (index: number) => void
}

export const Board = ({isMyTurn, board, onCellClick }: BoardProps) => {
    console.log(isMyTurn)
    return (
        <div className={`grid grid-cols-3 gap-2 w-72 mx-auto p-4 ${isMyTurn ? "border-green-700 " : "border-gray-400"} border-2 bg-gray-100 rounded-xl shadow-lg`}>
            {board.map((cell, idx) => (
                <button
                    key={idx}
                    onClick={() => onCellClick(idx)}
                    className="w-20 h-20 text-3xl font-bold flex items-center justify-center bg-white rounded-xl hover:bg-gray-200 transition-all"
                    disabled={cell !== null}
                >
                    {cell}
                </button>
            ))}
        </div>
    )
}
