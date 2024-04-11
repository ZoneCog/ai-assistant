/**
 * 处理字幕文件中的结束时间标记不正确的情况
 * 例如如下情况，上一段落的结束时间和下一段落
 * 的开始时间有重叠
 * 
 * 
 * 1
 * 00:00:00,160 --> 00:00:04,200
 * 大家好，最近我做了一个关于
 *
 * 2
 * 00:00:02,240 --> 00:00:06,359
 * 大型语言模型的 30 分钟演讲，
 *
 * 3
 * 00:00:04,200 --> 00:00:08,480
 * 有点像介绍性演讲，
 *
 * 4
 * 00:00:06,359 --> 00:00:10,040
 * 不幸的是，演讲没有被录制，
 * 
 * 处理后的结果是，上一段落的结束时间等于下一段落的开始时间：
 * 
 * 1
 * 00:00:00,160 --> 00:00:02,200
 * 大家好，最近我做了一个关于
 *
 * 2
 * 00:00:02,240 --> 00:00:04,359
 * 大型语言模型的 30 分钟演讲，
 *
 * 3
 * 00:00:04,200 --> 00:00:04,480
 * 有点像介绍性演讲，
 *
 * 4
 * 00:00:06,359 --> 00:00:10,040
 * 不幸的是，演讲没有被录制，
 * 
 */


const fs = require('fs')
const path = require('path')

// 通过命令行参数获取输入和输出文件的路径
const inputFile = process.argv[2]
const outputFile = process.argv[3]


if (!inputFile || !outputFile) {
  console.error('请输入有效的输入和输出文件路径！')
  return
}

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  // 将内容按行分割
  const lines = data.split('\n')

  // 存储调整后的行
  const adjustedLines = []

  // 遍历每一行进行时间调整
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // 判断是否包含时间标记
    if (line.includes('-->')) {
      // 在下一段落中寻找带有时间标记的行
      let found = false
      let j = i + 1
      while (!found && j < lines.length) {
        const nextLine = lines[j]
        if (nextLine.includes('-->')) {
          const [nextParamStartPre] = nextLine.split(' --> ')
          const nextParamStartTime = nextParamStartPre.split(',')[0]
          const [currentLineStart, currentLineEnd] = line.split(' --> ')
          const currentLineEndWidth = currentLineEnd.split(',')[1]
          line =
            currentLineStart +
            ' --> ' +
            nextParamStartTime +
            ',' +
            currentLineEndWidth
          found = true
        }
        j++
      }
    }

    adjustedLines.push(line)
  }

  // 获取输出文件的目录
  const outputDir = path.dirname(outputFile)

  // 确保输出文件的目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 将修改后的内容写入输出文件
  fs.writeFile(outputFile, adjustedLines.join('\n'), (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log('处理完毕，已保存到' + outputFile)
  })

})

