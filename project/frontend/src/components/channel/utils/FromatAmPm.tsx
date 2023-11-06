export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes: number | string = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0시는 12로 표시
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
