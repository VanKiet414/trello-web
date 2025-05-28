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