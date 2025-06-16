import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sorts'

//import { mockData } from '~/apis/mock-data'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'


function Board () {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Tạm thời fix cứng boardId, sau khi học nâng cao sẽ sử dụng react-router-dom để lấy chuẩn boardId từ URL về.
    const boardId = '684a98323ba77f91adf598df'
    // Call API
    fetchBoardDetailsAPI(boardId).then(board => {

      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        // Khi F5 trang web thì cần xử lý vấn đề kéo thả vào một columnn rỗng(video 37.2)
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          // Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống các component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
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

  /* Khi di chuyển card trong cùng Column
     Chỉ cần gọi API để cập nhật mảng trong columnOrderIds của Board chứa nó (thay đổi vị trí trong mảng) */
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  /* Func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong xuôi
  Chỉ cần gọi API để cập nhật mảng trong cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng) */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
 * Khi di chuyển card sang Column khác:
 * B1: Cập nhật mảng cardOrderIds của Column ban đầu chứa nó
 *     (Thực chất là xóa _id của Card ra khỏi mảng cardOrderIds của Column này).
 * B2: Cập nhật mảng cardOrderIds của Column đích
 *     (Thực chất là thêm _id của Card vào mảng cardOrderIds của Column đích, đúng vị trí mong muốn).
 * B3: Cập nhật lại trường columnId mới của Card vừa được kéo
 *     (Đảm bảo Card biết nó đang thuộc Column nào).
 * => Nên làm một API riêng để hỗ trợ thao tác này, đảm bảo tính nhất quán dữ liệu.
 */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {

    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }


  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
