import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function ListCards({ cards }) {
  // Kiểm tra nếu chỉ có 1 card và là placeholder
  const onlyPlaceholder = cards?.length === 1 && cards[0].FE_PlaceholderCard
  return (
    <SortableContext items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
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
        {/* {cards?.map(card => <Card key={card._id} card={card} />)} */}
        {onlyPlaceholder
          ? <Card key={cards[0]._id} card={cards[0]} />
          : cards?.filter(card => !card.FE_PlaceholderCard).map(card => (
            <Card key={card._id} card={card} />
          ))
        }
      </Box>
    </SortableContext>
  )
}

export default ListCards
