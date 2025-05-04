<template>
  <router-view class="router"/>
</template>
<script setup lang="ts">
console.log("<!--\n" +
    " *                                                     __----~~~~~~~~~~~------___\n" +
    " *                                    .  .   ~~//====......          __--~ ~~\n" +
    " *                    -.            \\_|//     |||\\\\  ~~~~~~::::... /~\n" +
    " *                 ___-==_       _-~o~  \\/    |||  \\\\            _/~~-\n" +
    " *         __---~~~.==~||\\=_    -_--~/_-~|-   |\\\\   \\\\        _/~\n" +
    " *     _-~~     .=~    |  \\\\-_    '-~7  /-   /  ||    \\      /\n" +
    " *   .~       .~       |   \\\\ -_    /  /-   /   ||      \\   /\n" +
    " *  /  ____  /         |     \\\\ ~-_/  /|- _/   .||       \\ /\n" +
    " *  |~~    ~~|--~~~~--_ \\     ~==-/   | \\~--===~~        .\\\n" +
    " *           '         ~-|      /|    |-~\\~~       __--~~\n" +
    " *                       |-~~-_/ |    |   ~\\_   _-~            /\\\n" +
    " *                            /  \\     \\__   \\/~                \\__\n" +
    " *                        _--~ _/ | .-~~____--~-/                  ~~==.\n" +
    " *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||\n" +
    " *                                  -_     ~\\      ~~---l__i__i__i--~~_/\n" +
    " *                                  _-~-__   ~)  \\--______________--~~\n" +
    " *                                //.-~~~-~_--~- |-------~~~~~~~~\n" +
    " *                                       //.-~~~--\\\n" +
    " *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" +
    " *\n" +
    " *                               神兽保佑            永无BUG\n" +
    " -->")
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useInfoStore } from '@/stores/userStore.ts';
const userInfo = useInfoStore();
const router = useRouter();
onMounted(()=>{
  router.push('/login')
})
</script>
<style lang="scss">
.router {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
