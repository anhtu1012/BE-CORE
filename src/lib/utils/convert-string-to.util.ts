/**
 * @description Chuyển đổi chuỗi thành camelCase
 * @author hanphn
 * @date 20/04/2025
 * @export
 * @param {string} str
 * @return {string}  {string}
 * @example toCamelCase('hello-world') => 'helloWorld'
 */
export function toCamelCase(str: string): string {
  const result = str
    // Tách chuỗi thành mảng các từ dựa trên dấu gạch dưới, gạch ngang, và khoảng trắng
    .split(/[-_\s]+/)
    // Chuyển đổi từng từ thành camelCase
    .map((word, index) => {
      if (index === 0) {
        // Từ đầu tiên: chữ cái đầu tiên viết thường, các chữ cái còn lại giữ nguyên
        return word.charAt(0).toLowerCase() + word.slice(1);
      }
      // Các từ tiếp theo: chữ cái đầu tiên viết hoa, các chữ cái còn lại viết thường
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  // Xử lý trường hợp PascalCase (đảm bảo ký tự đầu tiên luôn viết thường)
  return result.charAt(0).toLowerCase() + result.slice(1);
}
