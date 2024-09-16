export const pointRangeToPricePerUnit = (point, pointPrice, range, rangePrice) => {
  let price = 0
  let totalPointPrice = Number(point) * Number(pointPrice)
  let totalRangePrice = Number(range) * Number(rangePrice)
  price = totalPointPrice + totalRangePrice //ราคาต่อหน่วย
  return price
}
