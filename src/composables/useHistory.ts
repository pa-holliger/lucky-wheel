// composables/useHistory.ts
import { ref, watch } from "vue"

const MAX_ENTRIES = 200

export type GameResult = {
  color: string
  part: number
  date: string
}

const history = ref<GameResult[]>(
  JSON.parse(localStorage.getItem("history") ?? "[]"),
)

watch(history, v => localStorage.setItem("history", JSON.stringify(v)), { deep: true })

export function useHistory() {
  function addResult(result: GameResult) {
    history.value = [result, ...history.value].slice(0, MAX_ENTRIES)
  }

  function clearHistory() {
    history.value = []
  }

  function removeItem(date: string) {
    history.value = history.value.filter(item => item.date !== date)
  }

  return { history, addResult, clearHistory, removeItem }
}
