<template>
  <div class="layout-wrapper">
    <!--左侧导航-->
    <o-header/>
    <!--按钮侧边栏-->
    <o-aside/>
    <!--主要区域-->
    <o-main/>
  </div>
</template>

<script>
import OHeader from './Header/index'
import OAside from './Aside/index'
import OMain from './Main/index'
export default {
  name: 'layout',
  components: { OMain, OAside, OHeader }
}
</script>

<style lang="less">
  .layout-wrapper{
    display: flex;
    box-shadow: 0 0 40px rgba(0,0,0,0.1);

    header{
      width: 320px;
      min-width: 320px;
      background: #fff;
      border-top: 10px solid #32c1fb;
      padding: 20px 50px;
      position: relative;
      z-index: 101;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05), 1px 0 rgba(0,0,0,0.05);
    }

    aside{
      width: 80px;
      min-width: 80px;
      background: #fff;
      border-top: 10px solid #8c53ff;
      z-index: 99;
      box-shadow: 0 0 10px rgba(0,0,0,0.05), 1px 0 rgba(0,0,0,0.05), -1px 0 rgba(0,0,0,0.05);
    }

    main{
      flex: 1;
      border-top: 10px solid #eee;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05), 1px 0 rgba(0, 0, 0, 0.05);
    }
  }

  @media screen and (max-width: 720px){
    .layout-wrapper{
      aside{
        display: none;
      }
      main{
        margin-right: 0 !important;

        .bottom{
          .bottom-inner{
            flex-direction: column;
          }
        }
      }
    }
  }

  @media screen and (max-width: 960px){
    .layout-wrapper{
      flex-direction: column;

      header{
        float: left;
        min-width: 100%;
        max-width: 100%;
        padding-bottom: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      aside{
        z-index: 103;
        min-width: 80px;
        max-width: 80px;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
      }
      main{
        margin-right: 80px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        .bottom{
          display: block;
        }
      }
    }
  }

  @media screen and (min-width: 1024px) {
    .layout-wrapper{
      margin-bottom: 40px;
    }
  }
</style>
