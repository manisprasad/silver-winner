import { useEffect, useState } from "react"
import { Board } from "./components/Board"
import { useSocket } from "./hooks/useSocket"
const Loading = () => {
  return(
    <div className="relative w-16 h-16 animate-spin rounded-full border-8 border-t-black border-b-transparent border-l-blue-400 border-r-transparent shadow-xl flex items-center justify-center">
    <div className="w-12 h-12 bg-blue-400 rounded-full animate-ping"></div>
  </div>
  
  )
}

function App() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null))
  const [connected, setConnected] = useState(false)
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [myTurn, setMyTurn] = useState(false)
  const [symbol, setSymbol] = useState<"X" | "O" | null>(null)


  const socket = useSocket()

  const handleCellClick = (index: number) => {
    console.log("I clicked")
    // if (!myTurn || board[index] !== null || !symbol) return

    socket?.send(JSON.stringify({
      type: "place_mark",
      move: index
    }))
  }

  const findPlayer = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "init_game" }))
      setIsSearching(true);
    }
  }

  useEffect(() => {
    if (!socket) return

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      switch (message.type) {
        case "init_game":
          console.log(message)
          if(message.isMatch) {
            setConnected(true)
            setIsSearching(false);
          }else{
            console.log("please wait for someoneto connect")
          }
          if(message.symbol){
            setSymbol(message.symbol)
          }
          setMyTurn(message.symbol === "X") // X always starts
          break

        case "place_mark":
          setBoard(prev => {
            const updated = [...prev]
            updated[message.index] = message.symbol
            return updated
          })
          setMyTurn(message.symbol !== symbol) // next turn if it's not your symbol
          break
        case "disconnect":
          setMyTurn(false);
          alert(message.message);
          break;
        case "game_over":
          alert(message.winner === "DRAW" ? "It's a draw!" : `${message.winner} wins!`)
          setMyTurn(false)
          break

        case "error":
          alert(message.message)
          break
      }
    }
  }, [socket, symbol])
  console.log(symbol)
  console.log(myTurn)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Multiplayer Tic Tac Toe</h1>
      
      {!isSearching && !connected && (
        <button
          onClick={findPlayer}
          className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-xl text-lg font-medium shadow-md hover:bg-indigo-700 transition"
        >
          Find Random Player
        </button>
      )}
      
      {
       (isSearching && !connected) && (
        <Loading/>
        
          )
      }
       {
       (isSearching && !connected) && (
        <p className="text-xl">Please wait for someone to join...</p>
        
          )
      }

      {connected && (
        <>
          <p className="mb-4 text-lg font-medium text-gray-700">
            You are <span className="font-bold">{symbol}</span> &nbsp;
            <br />
            {myTurn ? "— It's Your turn" : "— Opponent's turn ⏳"}
          </p>
          <Board isMyTurn={myTurn ? true : false} board={board} onCellClick={handleCellClick} />
        </>
      )}
    </div>
  )
}

export default App
