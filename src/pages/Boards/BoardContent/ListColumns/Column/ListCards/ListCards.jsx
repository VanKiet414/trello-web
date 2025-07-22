import { useMemo } from 'react' // Thêm import
import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCards({ cards }) {
  // TỐI ƯU: Dùng useMemo để tính toán danh sách card cần hiển thị một lần duy nhất
  // và chỉ tính lại khi prop 'cards' thay đổi.
  const displayedCards = useMemo(() => {
    // Nếu chỉ có 1 card và đó là placeholder, ta vẫn cần nó để giữ chiều cao cho column
    if (cards?.length === 1 && cards[0].FE_PlaceholderCard) {
      return cards
    }
    // Ngược lại, lọc bỏ tất cả placeholder cards ra khỏi danh sách sẽ được render
    return cards?.filter(card => !card.FE_PlaceholderCard) || []
  }, [cards])

  return (
    // `SortableContext` giờ sẽ làm việc với một danh sách ID đã được lọc sẵn
    <SortableContext items={displayedCards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
      <Box sx={{
        p: '0 5px 5px 5px',
        m: '0 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => `calc(
          ${theme.trello.boardContentHeight} - 
          ${theme.spacing(5)} -
          ${theme.trello.columnHeaderHeight} -
          ${theme.trello.columnFooterHeight}
          )`,
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
      }}>
        {/* Render danh sách card đã được tính toán trước. Code bây giờ rất gọn. */}
        {displayedCards?.map(card => <Card key={card._id} card={card} />)}
      </Box>
    </SortableContext>
  )
}

export default ListCards