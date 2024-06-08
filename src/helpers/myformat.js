const locales = localStorage.getItem('lang')
const myFormatLang = locales ? locales : 'th-TH'

export const DateTime = (date, options) => {
  if (!date) {
    return
  }
  let op = {
    dateStyle: 'medium', //  full, long, medium, short
    timeStyle: 'short', //  full, long, medium, short
    timeZone: 'Asia/Bangkok',
    hourCycle: 'h24',
    hideTime: true,
  }
  if (date) {
    let _date = new Date(date)
    return new Intl.DateTimeFormat(myFormatLang, { ...op, ...options }).format(_date)
  }
}

export const Number = (number) => {
  console.log(typeof number)
  return number ? number : 0
}
