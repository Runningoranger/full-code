# 拖拽指令

`拖动一张图片的时候，v-drag赋值，v-drop取值`

> 李嘉宾

```html
<template>
  <div class="flex">
    <div class="drag">
      <ul>
        <li v-for="(person, index) in ALL" :key="person + index"><span v-drag="person">{{ person }}</span></li>
      </ul>
    </div>
    <div v-drop="drop" class="drop">
      {{data ? data : 'drop here'}}
    </div>
  </div>
</template>

<script>
  const ALL = `1、用微笑告诉别人，今天的你比昨天更坚强。
2、没有比脚更远的路，没有比人更高的山！
3、不是要做一个单纯优秀的人，而是要做一个不可替代的人。
4、原本认为自己做不到的事最后却做成了，感觉真的很好！
5、所谓成熟，就是越来越发觉以前的自己是个傻逼。
6、人生就象一个球，无论如何滚来滚去，总有在一个点上停止的时候。
7、勤奋是你的密码，能译出你一部壮丽的史诗。
8、观察走在你前面的人，看看他为何领先，学习他的优点。
9、你曾经不被人所爱，你才会珍惜将来那个爱你的人。
10、不是谁什么都有，也不是谁什么都没有。`.split(/\s+/);

  export default {
    data() {
      return {
        ALL,
        data: null,
      };
    },
    methods: {
      drop(data) {
        this.data = data;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }
  .drag {
    text-align: center;
    span {
      display: inline-block;
      cursor: move;
      padding: 5px;
      border-radius: 8px;
      border: 1px solid #abc;
    }
    li {
      margin: 10px;
      line-height: 20px;
    }
  }
  .drop {
    border: 1px solid #ccc;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    transition: 1s ease all;
    border-radius: 8px;
    .isDrag {
      box-shadow: 0px 0px 1000px 1px rgba(66, 133, 244, 1) inset;
    }
  }
</style>
```
