import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  Tooltip,
  Message,
  Avatar,
  Dialog,
  Form,
  FormItem,
  Input,
  Upload
} from 'element-ui'

Vue.use(Upload)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tooltip)
Vue.prototype.$message = Message
Vue.use(Avatar)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
