import moment from 'moment'
var mymoment = {}
mymoment.install = function(Vue){
    Vue.prototype.$moment = moment
}
export default mymoment