<script>
import Vue from "vue";
import { Popover } from bootstrap;

const popover = Vue.component('bsPopover', {
  template: `
    <slot/>
  `,
  props: {
    content: {
      required: false,
      default: '',
    },
    title: {
      default: 'My Popover',
    },
    trigger: {
      default: 'click',
    },
    delay: {
      default: 0,
    },
    html: {
      default: false,
    },
  },
  mounted() {
    // pass bootstrap popover options from props
    var options = this.$props
    var ele = this.$slots.default[0].elm
    new Popover(ele,options)
  },
})
</script>
