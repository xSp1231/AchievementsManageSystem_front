<template>
<div class="home">
  <div class="noticePanel" >
    <Announcement></Announcement>
  </div>
  <div class="otherIntro">
    <OtherIntro></OtherIntro>
  </div>
</div>
</template>
<script setup>
import Announcement from './homeComponents/Announcement.vue'
import OtherIntro   from './homeComponents/otherIntro.vue'
</script>

<style scoped>
.home{
  height: 100%;
  display: flex;
}
.noticePanel{
  width: 75%;

}
.otherIntro{
  margin-left: 1%;
  width: 22%;

}
</style>
