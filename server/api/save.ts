import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // POSTリクエストのみ許可
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method Not Allowed'
    })
  }

  const body = await readBody(event)
  const number = body.number

  // 数値の検証
  if (typeof number !== 'number' || isNaN(number)) {
    throw createError({
      statusCode: 400,
      message: '有効な数値を送信してください'
    })
  }

  try {
    // dataディレクトリが存在しない場合は作成
    const dataDir = join(process.cwd(), 'data')
    try {
      await mkdir(dataDir, { recursive: true })
    } catch (error) {
      // ディレクトリが既に存在する場合は無視
    }

    // ファイルに保存（JSON形式で追記）
    const filePath = join(dataDir, 'numbers.json')
    const timestamp = new Date().toISOString()
    const data = {
      number,
      timestamp
    }

    // 既存のデータを読み込む（存在する場合）
    let existingData = []
    try {
      const fs = await import('fs/promises')
      const fileContent = await fs.readFile(filePath, 'utf-8')
      existingData = JSON.parse(fileContent)
    } catch (error) {
      // ファイルが存在しない場合は空配列から開始
    }

    // 新しいデータを追加
    existingData.push(data)

    // ファイルに書き込み
    await writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf-8')

    // レスポンスを確実に返す
    return {
      success: true,
      message: `数値 ${number} を保存しました`,
      timestamp,
      savedNumber: number
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'ファイルの保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー')
    })
  }
})

