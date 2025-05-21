export const normalizeText = (text: string): string => {
    return text
        .normalize("NFD")                         // Tách ký tự có dấu
        .replace(/[\u0300-\u036f]/g, "")          // Xoá dấu
        .replace(/đ/g, "d")                       // đ → d
        .replace(/Đ/g, "d")                       // Đ → d
        .toLowerCase()                            // Chuyển thành chữ thường
        .trim();                                  // Xoá khoảng trắng đầu/cuối
};
