<template>
    <div>
    <!-- 模态框 -->
      <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}" >
        <div class="md-modal-inner">
            <!-- 头部 -->
          <div class="md-top">
            <div class="md-title">login in</div>
            <button class="md-close">close</button>
          </div>
          <!-- 内容 -->
          <div class="md-content">
            <div class="confirm-tips">
            <!-- 插槽slot.name message -->
              <slot name="message"></slot>
            </div>
            <!-- div>slot.name btnGroup -->
            <div class="btn-wrap">
              <slot name="btnGroup"></slot>
            </div>
          </div>
        </div>
      </div>
      <!-- 遮罩层 -->
      <div class="md-overlay" v-if="mdShow"></div>
    </div>
</template>

<script>
export default {
   props: ['mdShow']
}
</script>


