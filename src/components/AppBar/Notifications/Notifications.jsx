import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchInvitationsAPI,
  selectCurrentNotifications,
  updateBoardInvitationAPI,
  addNotification,
  setHasNewNotification, // Thêm action này
  selectHasNewNotification // Thêm selector này
} from '~/redux/notifications/notificationsSlice'
import { socketIoInstance } from '~/socketClient'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    // Lưu các notification PENDING vào localStorage khi user mở menu
    const readIds = notifications
      .filter(n => n.boardInvitation.status === 'PENDING')
      .map(n => n._id)
    localStorage.setItem('readNotifications', JSON.stringify(readIds))
    dispatch(setHasNewNotification(false))
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Khi click vào thông báo thì sẽ chuyển hướng đến trang board tương ứng
  const navigate = useNavigate()

  // Lấy dữ liệu user từ Redux Store
  const currentUser = useSelector(selectCurrentUser)

  // Lấy dữ liệu notifications từ trong Redux
  const notifications = useSelector(selectCurrentNotifications)

  // Lấy trạng thái chấm đỏ từ Redux
  const hasNewNotification = useSelector(selectHasNewNotification)

  // Fetch danh sách các lời mời invitations
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchInvitationsAPI()).then(res => {
      const readIds = JSON.parse(localStorage.getItem('readNotifications') || '[]')
      // Nếu có notification PENDING chưa đọc, set chấm đỏ
      if (
        res.payload &&
        res.payload.some(n => n.boardInvitation.status === 'PENDING' && !readIds.includes(n._id))
      ) {
        dispatch(setHasNewNotification(true))
      }
    })

    // Tạo một cái function xử lý khi nhận được sự kiện real-time, docs hướng dẫn:
    // https://socket.io/how-to/use-with-react
    const onReceiveNewInvitation = (invitation) => {
      // Nếu thằng user đang đăng nhập hiện tại mà chúng ta lưu trong redux chính là thằng invitee trong bản ghi invitation.
      if (invitation.inviteeId?.toString() === currentUser._id?.toString()) {
        // Bước 1: Thêm bản ghi invitation mới vào trong redux
        dispatch(addNotification(invitation)) // reducer này sẽ set hasNewNotification = true
        // Bước 2: Không cần set local state nữa, đã dùng Redux
      }
    }

    // Lắng nghe một cái sự kiện real-time có tên là BE_USER_INVITED_TO_BOARD từ phía server gửi về
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    // Clean Up event để ngăn chặn việc bị đăng ký lặp lại event:
    // https://socket.io/how-to/use-with-react#cleanup
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }
  }, [dispatch, currentUser._id])

  // Cập nhật lại trạng thái - status của lời mời join board
  const updateBoardInvitation = (status, invitationId) => {
    /* console.log('status: ', status)
    console.log('invitationId:', invitationId) */
    dispatch(updateBoardInvitationAPI({ status, invitationId }))
      .then(res => {
        // console.log(res)
        if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
          // Nếu thằng user đã Accept lời mời join board thì chuyển hướng đến trang board đó
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
      })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          aria-label="Open notifications menu"
          color="warning"
          // variant="none"
          // variant="dot"
          variant={hasNewNotification ? 'dot' : 'standard'} // Dùng Redux thay vì local state
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            color: hasNewNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
        PaperProps={{
          style: {
            maxHeight: 400 // Giới hạn chiều cao menu để tránh tràn màn hình
          }
        }}
      >
        {(!notifications || notifications.length === 0) &&
          <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>
        }
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 360,
              overflowY: 'auto'
            }}>
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification.inviter?.displayName}</strong> had invited you to join the board
                    <strong> {notification.board?.title} </strong></Box>
                </Box>

                {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING &&
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                  >
                    Reject
                  </Button>
                </Box>
                }

                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                    <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                  }
                  {notification.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED &&
                    <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                  }
                </Box>

                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography component="span" sx={{ fontSize: '13px' }}>
                    {moment(notification.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== (notifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications