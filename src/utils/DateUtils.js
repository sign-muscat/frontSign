export const getFormattedDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}/${month}/${day}`;
}

export const getFormattedTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? '오후' : '오전';

    const twelveHour = hours % 12 || 12; // 0시일 경우 12시로 처리

    const formattedHours = twelveHour < 10 ? ' ' + twelveHour : twelveHour.toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${ampm} ${formattedHours}시 ${formattedMinutes}분`;
}