import mysql from 'mysql2/promise'

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

  // 環境変数からデータベース接続情報を取得
  const dbHost = process.env.DB_HOST || 'mysql'
  const dbPort = parseInt(process.env.DB_PORT || '3306')
  const dbName = process.env.DB_NAME || 'resource_planner'
  const dbUser = process.env.DB_USER || 'app_user'
  const dbPassword = process.env.DB_PASSWORD || 'app_password'

  let connection
  try {
    // MySQLデータベースに接続
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword
    })

    // numberテーブルにデータを挿入
    const [result] = await connection.execute(
      'INSERT INTO number (value) VALUES (?)',
      [number]
    ) as [mysql.ResultSetHeader, mysql.FieldPacket[]]

    // 挿入されたIDを取得
    const insertId = result.insertId

    // レスポンスを返す
    return {
      success: true,
      message: `数値 ${number} を保存しました`,
      id: insertId,
      savedNumber: number
    }
  } catch (error) {
    console.error('MySQL保存エラー:', error)
    throw createError({
      statusCode: 500,
      message: 'データベースの保存に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー')
    })
  } finally {
    // 接続を閉じる
    if (connection) {
      await connection.end()
    }
  }
})

