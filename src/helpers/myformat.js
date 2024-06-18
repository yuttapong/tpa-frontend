const locales = localStorage.getItem('lang')
const myFormatLang = locales ? locales : 'th-TH'

export const DateTime = (date, options) => {
  if (!date) {
    return
  }
  let op = {
    dateStyle: 'medium', //  full, long, medium, short
    timeZone: 'Asia/Bangkok',
    hourCycle: 'h24',
  }

  if (date && date != '0000-00-00') {
    let _date = new Date(date)
    return new Intl.DateTimeFormat(myFormatLang, { ...op, ...options }).format(_date)
  }
}

export const Number = (number) => {
  return number ? number : 0
}
