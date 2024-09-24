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

  const _format = options && options.format ? options.format : 'dd/MM/yyyy'
  return format(value, _format, {
    locale: th,
  })
}

export const myFormatDateTime = (value, options) => {
  if (!value) {
    return
  }

  if (value == undefined) return ''
  if (value == null) return ''
  if (value == '') return ''
  if (value == '0000-00-00 00:00:00') return ''
  if (value == '0000-00-00') return ''

  const _format = options && options.format ? options.format : 'dd/MM/yy H:i'
  return format(value, _format, {
    locale: th,
  })
}

export const myFormatTime = (value, options) => {
  if (!value) {
    return
  }

  if (value == undefined) return ''
  if (value == null) return ''
  if (value == '') return ''
  if (value == '0000-00-00 00:00:00') return ''
  if (value == '0000-00-00') return ''

  const _format = options && options.format ? options.format : 'H:i:s'
  return format(value, _format)
}

export const Number = (number) => {
  return number ? number : 0
}
