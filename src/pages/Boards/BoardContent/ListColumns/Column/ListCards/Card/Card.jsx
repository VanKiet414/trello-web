import React, { useMemo } from 'react' // Thêm React và useMemo
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'

// TỐI ƯU 1: Bọc component bằng React.memo để tránh render không cần thiết
const Card = React.memo(({ card }) => {
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  // TỐI ƯU 2: Sử dụng useMemo để ghi nhớ object style, chỉ tạo lại khi cần
  const dndKitCardStyles = useMemo(() => ({
    /* touchAction: 'none', // Dành cho sensor default dạng PointerSensor */
    // Nếu sử dụng CSS.Transform như docs sẽ lỗi kiểu stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }), [transform, transition, isDragging])

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  const setActiveCard = () => {
    // Cập nhật data cho cái activeCard trong Redux
    dispatch(updateCurrentActiveCard(card))
    // Hiện Modal ActiveCard lên
    dispatch(showModalActiveCard())
  }

  return (
    <MuiCard
      onClick={setActiveCard}
      ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        // Đày là 2 cách để ẩn card tùy dự án
        //overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset'
        //height: card?.FE_PlaceholderCard ? '0px' : 'unset'
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} /> }
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {shouldShowCardActions() &&
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        {!!card?.memberIds?.length &&
          <Button size="small" startIcon={ <GroupIcon/> }>{card?.memberIds?.length}</Button>
        }
        {!!card?.comments?.length &&
          <Button size="small" startIcon={ <CommentIcon/> }>{card?.comments?.length}</Button>
        }
        {!!card?.attachments?.length &&
          <Button size="small" startIcon={ <AttachmentIcon/> }>{card?.attachments?.length}</Button>
        }
      </CardActions>
      }
    </MuiCard>
  )
})

export default Card