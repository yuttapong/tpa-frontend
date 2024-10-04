export const removeUndefinedAndNull = (text) => {
  let _text = String(text)
  return _text.replace(/null|undefined/g, '').trim()
}
