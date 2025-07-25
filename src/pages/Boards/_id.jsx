import { useEffect } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

//import { mockData } from '~/apis/mock-data'
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis'
import { cloneDeep } from 'lodash'
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'

function Board () {
  const dispatch = useDispatch()
  // Không dùng State của component nữa mà chuyển qua State của Redux
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  useEffect(() => {
    // Call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  /* Func này có nhiệm vụ gọi API và xử lý khi kéo thả column xong xuôi
     Chỉ cần gọi API để cập nhật mảng trong columnOrderIds của Board chứa nó (thay đổi vị trí trong Board) */
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    /*
    * Trường hợp dùng Spread Operator này thì lại không sao bởi vì ở đây chúng ta không dùng push như ở trên
    * làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị columns và columnOrderIds
    * bằng 2 mảng mới. Tương tự như cách làm concat ở trường hợp createNewColumn thôi :))
    */
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  /* Khi di chuyển card trong cùng một Column:
     Chỉ cần gọi API để cập nhật mảng trong cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng) */
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board

    /**
    * Cannot assign to read only property 'cards' of object
    * Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only – (nested object – can thiệp sâu dữ liệu)
    */
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

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

    // Tương tự đoạn xử lý chỗ hàm moveColumns nên không ảnh hưởng Redux Toolkit Immutability gì ở đây cả.
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API xử lý phía Back-end
    // Lấy cardOrderIds của column cũ và mới, đảm bảo là mảng
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds || []
    let nextCardOrderIds = dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds || []

    // Xử lý placeholder nếu có
    if (prevCardOrderIds.length > 0 && prevCardOrderIds[0]?.includes('placeholder-card')) prevCardOrderIds = []
    if (nextCardOrderIds.length > 0 && nextCardOrderIds[0]?.includes('placeholder-card')) nextCardOrderIds = []

    // Gửi dữ liệu lên API
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds
    })
  }

  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..."/>
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng/mở dựa theo cái State isShowModalActiveCard lưu trong Redux */}
      {<ActiveCard />}

      {/* Các thành phần còn lại của Board Details*/}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // 3 cái trường hợp move dưới đây thì giữ nguyên để code xử lý kéo thả ở phần BoardContent không bị quá dài, mất kiểm soát khi đọc code, maintain.
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
