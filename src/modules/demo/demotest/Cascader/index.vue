<template>
  <div>
    <CascaderSelector 
     :options="options"
    />
  </div>
</template>

<script>
import CascaderSelector from "@/components/CascaderSelector";
export default {
  components: {
    CascaderSelector
  },
  data() {
    return {
      options: [
        {
          label: "电影",
          value: "1",
          children: [
            {
              label: "科幻",
              value: "1-1",
            },
            {
              label: "爱情",
              value: "1-2",
            },
            {
              label: "动作",
              value: "1-3",
            }
          ]
        },
        {
          label: "美食",
          value: "2",
          children: [
            {
              label: "西餐",
              value: "2-1",
            }
          ]
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style>

</style>