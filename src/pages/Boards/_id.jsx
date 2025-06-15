import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
//import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

function Board () {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId, sau khi học nâng cao sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về.
    const boardId = '684a98323ba77f91adf598df'
    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {
      // Khi F5 trang web thì cần xử lý vấn đề kéo thả vào một columnn rỗng(video 37.2)
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })

      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Khi tạo column  mới thì nó chưa có cards, nên chúng ta sẽ tạo một card placeholder để hiển thị trong column mới.
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cập nhật lại state Board
    // Phía Front-end, chúng ta phải tự cập nhật lại state data board (thay vì phải gọi lại API fetchBoardDetails).
    // Lưu ý: Cách làm này phụ thuộc vào lựa chọn và đặc thù từng dự án.
    // Ở một số dự án, Back-end sẽ hỗ trợ trả về toàn bộ dữ liệu Board mới sau khi có thao tác tạo Column hoặc Card,
    // giúp Front-end nhận được dữ liệu cập nhật ngay mà không cần gọi lại API lấy chi tiết Board.
    // => Khi đó, Front-end sẽ nhận dữ liệu mới nhanh và đơn giản hơn.
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cập nhật lại state Board
    // Phía Front-end, chúng ta phải tự cập nhật lại state data board (thay vì phải gọi lại API fetchBoardDetails).
    // Lưu ý: Cách làm này phụ thuộc vào lựa chọn và đặc thù từng dự án.
    // Ở một số dự án, Back-end sẽ hỗ trợ trả về toàn bộ dữ liệu Board mới sau khi có thao tác tạo Column hoặc Card,
    // giúp Front-end nhận được dữ liệu cập nhật ngay mà không cần gọi lại API lấy chi tiết Board.
    // => Khi đó, Front-end sẽ nhận dữ liệu mới nhanh và đơn giản hơn.
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === newCardData.columnId)
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
