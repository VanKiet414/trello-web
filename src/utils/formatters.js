export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
* Video 37.2 Hàm generatePlaceholderCard: Xử lý lỗi logic của thư viện Dnd-kit khi một Column không có dữ liệu:
* - Phía FE sẽ tự tạo ra một "Placeholder Card" đặc biệt, không liên quan đến dữ liệu từ Back-end.
*   Thẻ card đặc biệt này sẽ được ẩn khỏi giao diện người dùng.
* - Cấu trúc ID của Placeholder Card rất đơn giản và có thể xác định dễ dàng, không cần sinh ID ngẫu nhiên:
*   Ví dụ: `columnId=placeholder-card` (mỗi column chỉ có tối đa một Placeholder Card).
* - Quan trọng khi tạo Placeholder Card: cần đảm bảo có đầy đủ các trường như: _id, boardId, columnId, FE_PlaceholderCard.
*/
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-events để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// Cách sử dụng: Với tất cả các link hoặc button mà có hành động gọi api thì thêm class "interceptor-loading" cho nó là xong.
export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}