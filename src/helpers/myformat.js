const locales = localStorage.getItem('lang')
const myFormatLang = locales ? locales : 'th-TH'
import { format, isValid } from 'date-fns'
import { th } from 'date-fns/locale'
import currency from 'currency.js'

export const myCurrency = (value) => {
  if (value === undefined) return
  if (value === null) return
  if (value === '') return
  return currency(value, { precision: 2, separator: ',', symbol: '' }).format()
}

export const myFormatDate = (value, options) => {
  if (!value) {
    return
  }

  if (value == undefined) return ''
  if (value == null) return ''
  if (value == '') return ''
  if (value == '0000-00-00 00:00:00') return ''
  if (value == '0000-00-00') return ''

  return format(value, 'dd/MM/yyyy')
  let op = {
    dateStyle: 'short', //  full, long, medium, short
    timeZone: 'Asia/Bangkok',
    // hourCycle: 'h24',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  if (typeof date === 'number') {
    let _date = new Date(date)
    return new Intl.DateTimeFormat(myFormatLang, { ...op, ...options }).format(_date)
  } else if (typeof date === 'string') {
    if (date == '0000-00-00 00:00:00') return
    if (date == '0000-00-00') return
    if (date == '') return
    if (typeof date == null) return
    let _date = new Date(date)
    return new Intl.DateFormat(myFormatLang, { ...op, ...options }).format(_date)
  }
}

export const Number = (number) => {
  return number ? number : 0
}
