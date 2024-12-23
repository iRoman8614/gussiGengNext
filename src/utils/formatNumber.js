const suffixes = ["", "k", "m", "b", "t", "q", "qn", "sx", "sp"];

/**
 * Функция для форматирования числа с возможностью сокращения.
 * @param {number|string} num - Число для форматирования.
 * @param {number} maxLength - Максимальная длина числа, после которой оно будет сокращено.
 * @returns {string} Отформатированное число.
 */
export function formatNumber(num, maxLength = 12) {
    if (num === undefined || num === null || isNaN(num)) {
        throw new Error('Invalid number');
    }
    num = parseFloat(num);
    if (num.toString().length <= maxLength) {
        return num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }
    let value = num;
    let index = 0;
    while (value >= 1000 && index < suffixes.length - 1) {
        value /= 1000;
        index++;
    }
    if (value < 100) {
        return `${value.toFixed(2)}${suffixes[index]}`;
    } else {
        return `${Math.floor(value)}${suffixes[index]}`;
    }
}
