<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { GraphController } from 'd3-graph-controller'
import {
  graph,
  config,
  keywordsData,
  type Keyword,
} from '@/graph/keywordsGraph'

const graphRef = ref(null)
const controller = ref<Keyword.GraphController | null>(null);

const clearAll = () => {
  if (!controller.value) return;
  keywordsData.forEach(keyword => {
    controller.value!.filterNodesByType(false, keyword.type)
  })
}

const resetGraph = () => {
  if (!graphRef.value) return
  controller.value?.shutdown()
  controller.value = new GraphController<Keyword.Type, Keyword.Node, Keyword.Link>(
    graphRef.value,
    graph,
    config
  )
}

onMounted(resetGraph)

</script>

<template>
  <div class="graph-container">
    <div class="controls">
      <h1 class="title">About yue</h1>
      <button class="button" @click="resetGraph">Reset</button>
      <button class="button" @click="clearAll">Clear</button>
      <div class="type-filter" v-for="{ type, name, items } in keywordsData">
        <input
          :id="type"
          type="checkbox"
          :checked="controller?.nodeTypeFilter.includes(type)"
          @change="
            // @ts-expect-error
            controller?.filterNodesByType($event.currentTarget.checked, type)
          "
        />
        <label :for="type">{{ name ?? type }} ({{ items.length + (name ? 1 : 0) }})</label>
      </div>
    </div>
    <div ref="graphRef" />
  </div>
</template>

<style scoped>
.title {
  margin: 0;
}
.graph-container {
  height: 100vh;
  width: 100vw;
}
.graph {
  height: 100%;
}
.controls {
  position: fixed;
  left: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.button {
  background-color: #0096fa;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 0.25em;
  padding: 0.5em 0.75em;
}
.type-filter {
  background-color: #ffffffcc;
  display: flex;
}
.type-filter > input[type="checkbox"] {
  accent-color: #0096fa;
}
</style>
