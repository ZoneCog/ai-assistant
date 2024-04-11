/**
 * 双语字幕合并
 * 
 * 1
 * 00:00:00,160 --> 00:00:04,200
 * 大家好，最近我做了一个关于
 * hello
 *
 * 2
 * 00:00:02,240 --> 00:00:06,359
 * 大型语言模型的 30 分钟演讲，
 * good
 *
 * 3
 * 00:00:04,200 --> 00:00:08,480
 * 有点像介绍性演讲，
 * hello
 *
 * 4
 * 00:00:06,359 --> 00:00:10,040
 * 不幸的是，演讲没有被录制，
 * bye
 * 
 * 
 */


const fs = require('fs')
const path = require('path')

// 通过命令行参数获取输入和输出文件的路径
const zhInputFile = process.argv[2]
const enInputFile = process.argv[3]
const outputFile = process.argv[4]

if (!zhInputFile || !enInputFile || !outputFile) {
  console.error('请输入有效的中文字幕文件和英文字幕文件,以及输出文件路径！')
  return
}

// 确保输入文件的存在
if (!fs.existsSync(zhInputFile)) {
  console.error('中文字幕文件不存在！')
  return
}

// 确保输入文件的存在
if (!fs.existsSync(enInputFile)) {
  console.error('英文字幕文件不存在！')
  return
}

// 获取输出文件的目录
const outputDir = path.dirname(outputFile)

// 确保输出文件的目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}


fs.readFile(zhInputFile, 'utf8', (err, zhData) => {
  if (err) {
    console.error(err)
    return
  }

  fs.readFile(enInputFile, 'utf8', (err, enData) => {
    if (err) {
      console.error(err)
      return
    }

    // 将内容按行分割
    const zhLines = zhData.split('\n')
    const enLines = enData.split('\n')

    // 存储调整后的行
    const adjustedLines = []

    // 遍历每一行进行时间调整
    for (let i = 0; i < zhLines.length; i++) {
      let zhLine = zhLines[i]
      let enLine = enLines[i]

      if (zhLines[i-1]?.includes(' --> ') && enLines[i-1]?.includes(' --> ')) {
        if (zhLine) {
          adjustedLines.push(zhLine)
        }

        if (enLine) {
          adjustedLines.push(enLine)
        }
      } else {
        adjustedLines.push(zhLine)
      }
      
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

})

