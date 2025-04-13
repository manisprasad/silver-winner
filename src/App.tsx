import { useEffect, useState } from "react"
import { Board } from "./components/Board"
import { useSocket } from "./hooks/useSocket"

const Loading = () => {
  return (
    <div className="relative w-16 h-16  animate-spin rounded-full border-8 border-t-white border-b-transparent border-l-indigo-400 border-r-transparent shadow-xl flex items-center justify-center">
      <div className="w-12 h-12 bg-indigo-400 rounded-full animate-ping"></div>
    </div>
  )
}

function App() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null))
  const [connected, setConnected] = useState(false)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [myTurn, setMyTurn] = useState(false)
  const [symbol, setSymbol] = useState<"X" | "O" | null>(null)
  const [winnerMessage, setWinnerMessage] = useState<string | null>(null)


  const socket = useSocket()

  const handleCellClick = (index: number) => {
    console.log("I clicked")
    socket?.send(JSON.stringify({
      type: "place_mark",
      move: index
    }))
  }

  const findPlayer = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "init_game" }))
      setIsSearching(true)
    }
  }

  useEffect(() => {
    if (!socket) return

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case "init_game":
          console.log(message)
          if (message.isMatch) {
            setConnected(true)
            setIsSearching(false)
          } else {
            console.log("please wait for someone to connect")
          }
          if (message.symbol) {
            setSymbol(message.symbol)
          }
          setMyTurn(message.symbol === "X")
          break

        case "place_mark":
          setBoard(prev => {
            const updated = [...prev]
            updated[message.index] = message.symbol
            return updated
          })
          setMyTurn(message.symbol !== symbol)
          break

        case "disconnect":
          setMyTurn(false)
          alert(message.message)
          break

        case "game_over":
          setTimeout(() => {
            if (message.winner === "DRAW") {
              setWinnerMessage("It's a draw 🤝")
            } else if (message.winner === symbol) {
              setWinnerMessage("You win! 🎉")
            } else {
              setWinnerMessage("Opponent wins 😤")
            }
          }, 300)
          setMyTurn(false)
          break
        case "error":
          alert(message.message)
          break
      }
    }
  }, [socket, symbol])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Multiplayer Tic Tac Toe</h1>

      {!isSearching && !connected && (
        <button
          onClick={findPlayer}
          className="mb-6 px-6 py-3 bg-indigo-500 text-white rounded-xl text-lg font-medium shadow-xl hover:bg-indigo-400 transition"
        >
          Find Random Player
        </button>
      )}

      {(isSearching && !connected) && <Loading />}
      {(isSearching && !connected) && (
        <p className="text-xl mt-10 text-gray-300">Please wait for someone to join...</p>
      )}

      {winnerMessage && (
        <div className="mt-6 mb-6 bg-indigo-700 text-white px-6 py-4 rounded-xl text-xl font-semibold shadow-lg">
          {winnerMessage}
        </div>
      )}


      { connected && (
        <>
         {!winnerMessage &&  <p className="mb-4 text-lg font-medium text-gray-300">
            You are <span className="font-bold">{symbol}</span>
            <br />
            {myTurn ? "— It's Your turn" : "— Opponent's turn ⏳"}
          </p>
          }

          <Board isMyTurn={myTurn} board={board} onCellClick={handleCellClick} />
        </>
      )}
    </div>
  )
}

export default App
