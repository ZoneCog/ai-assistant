export const getRandomId = () => {
  return Math.random().toString(36).substring(2, 10)
}

export const randomString = (num: number = 10) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}
