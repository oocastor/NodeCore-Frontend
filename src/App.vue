<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #333;
}
::-webkit-scrollbar-thumb {
  background: #555;
}

.no-scrollbar::-webkit-scrollbar {
  display: none !important;
}
</style>
