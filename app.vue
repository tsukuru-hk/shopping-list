<template>
  <div>
    <h1>カウンター</h1>
    <p>現在の数字: {{ count }}</p>
    <button @click="increment">カウントアップ</button>
    
    <div style="margin-top: 20px;">
      <h2>数値を保存</h2>
      <input 
        v-model.number="inputValue" 
        type="number" 
        placeholder="数値を入力"
        style="padding: 8px; margin-right: 10px;"
      />
      <button @click="saveNumber" :disabled="saving">
        {{ saving ? '送信中...' : '送信' }}
      </button>
      <p v-if="message" :style="{ color: messageType === 'success' ? 'green' : 'red' }">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
const count = ref(0)
const inputValue = ref(0)
const saving = ref(false)
const message = ref('')
const messageType = ref('')

const increment = () => {
  count.value++
}

const saveNumber = async () => {
  if (inputValue.value === null || inputValue.value === undefined) {
    message.value = '数値を入力してください'
    messageType.value = 'error'
    return
  }

  saving.value = true
  message.value = ''

  try {
    const response = await $fetch('/api/save', {
      method: 'POST',
      body: {
        number: inputValue.value
      }
    })

    // レスポンスの構造を確認して適切に処理
    const responseMessage = response?.message || response || '保存が完了しました'
    message.value = '保存しました: ' + responseMessage
    messageType.value = 'success'
    inputValue.value = 0
  } catch (error) {
    console.error('保存エラー:', error)
    message.value = 'エラーが発生しました: ' + (error?.data?.message || error?.message || '不明なエラー')
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}
</script>

