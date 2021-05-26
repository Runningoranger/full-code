<template>
  <div class="sort-drag">
    <vuedraggable 
      v-model="list" 
      :options="options"
    >
      <transition-group class="sort-drag-list">
        <div v-for="i in list" :key="i" class="li-item">
          <p>{{ i }}</p>
        </div>
      </transition-group>
    </vuedraggable>
    
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable';
export default {
  components: {
    vuedraggable
  },
  data() {
    return {
      list: [1, 2, 3, 4, 5, 6, 7],
      options: {
        animation:350
      }
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped> 
.sort-drag {
  width: 100%;
  height: 100%;
  .sort-drag-list {
    width: 400px;
    height: 700px;
    .li-item {
      width: 100%;
      height: 40px;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
    }
  }
}
</style>