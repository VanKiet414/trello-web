import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board }) {
  return (
    <Box sx= {{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon />}
          label={board?.title}
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={6}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:fist-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="src/components/AppBar/Menus/avatar.jpg"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://kenh14cdn.com/203336854389633024/2024/7/27/hieu-3-17220612878962084334595-1722069503834-17220695047501787564486.jpg"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/L7gYIAqbbyncgPp-OdWIep7Zyik9YTwOA0lxKXIX0ygN06lAj0p2ct9sy9LQoRjt2whZWKtW=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/EFB13mILKGh6KbJnTUayPFRw11s4iKhz6GtpbfTl2AAwmUo0FFB2jbxpOup4j5w0gAhYKyqudR4=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://image.plo.vn/w1000/Uploaded/2025/ernccqrwq/2024_02_28/ca-si-den-vau-duoc-de-cu-nam-ca-si-cua-nam-nau-an-cho-em-co-mat-o-2-de-cu-9484.jpg.webp"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://thanhnien.mediacdn.vn/Uploaded/caotung/2022_08_07/ca-si-mono-2225.jpg"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="src/components/AppBar/Menus/avatar.jpg"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://kenh14cdn.com/203336854389633024/2024/7/27/hieu-3-17220612878962084334595-1722069503834-17220695047501787564486.jpg"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/L7gYIAqbbyncgPp-OdWIep7Zyik9YTwOA0lxKXIX0ygN06lAj0p2ct9sy9LQoRjt2whZWKtW=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/EFB13mILKGh6KbJnTUayPFRw11s4iKhz6GtpbfTl2AAwmUo0FFB2jbxpOup4j5w0gAhYKyqudR4=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://image.plo.vn/w1000/Uploaded/2025/ernccqrwq/2024_02_28/ca-si-den-vau-duoc-de-cu-nam-ca-si-cua-nam-nau-an-cho-em-co-mat-o-2-de-cu-9484.jpg.webp"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://thanhnien.mediacdn.vn/Uploaded/caotung/2022_08_07/ca-si-mono-2225.jpg"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://image.plo.vn/w1000/Uploaded/2025/ernccqrwq/2024_02_28/ca-si-den-vau-duoc-de-cu-nam-ca-si-cua-nam-nau-an-cho-em-co-mat-o-2-de-cu-9484.jpg.webp"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://thanhnien.mediacdn.vn/Uploaded/caotung/2022_08_07/ca-si-mono-2225.jpg"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://image.plo.vn/w1000/Uploaded/2025/ernccqrwq/2024_02_28/ca-si-den-vau-duoc-de-cu-nam-ca-si-cua-nam-nau-an-cho-em-co-mat-o-2-de-cu-9484.jpg.webp"
            />
          </Tooltip>
          <Tooltip title='vankietdev'>
            <Avatar
              alt="vankietdev"
              src="https://thanhnien.mediacdn.vn/Uploaded/caotung/2022_08_07/ca-si-mono-2225.jpg"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
