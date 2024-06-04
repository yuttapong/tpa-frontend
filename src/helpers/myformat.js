const locales = localStorage.getItem('lang')
const myFormatLang = locales ? locales : 'th-TH'

export const DateTime = (date, options) => {
  let op = {
    dateStyle: 'medium', //  full, long, medium, short
    timeStyle: 'short', //  full, long, medium, short
    timeZone: 'Australia/Sydney',
    hourCycle: 'h24',
    hideTime: false,
    ...options,
  }
  if (date) {
    let _date = new Date(date)
    return new Intl.DateTimeFormat(myFormatLang, op).format(_date)
  }
}

export const Number = (number) => {
  console.log(typeof number)
  return number ? number : 0
}
