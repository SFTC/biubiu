/**
 * 说明
 * 1、对于get请求，第一个参数为请求url，第二个参数为config，参数可以通过config中的params传递；
 * 2、对于post请求，第一个参数为请求url，第二个参数为请求参数，第三个参数为config；
 * 3、关闭默认请求结果提示，在config中设置hideMessage: true;
 * 4、手动配置错误消息，多用于后端为英文提示，前端转为中文提示，在config中设置message: {errno: errmsg}；
 * 5、这里并不期望有任何参数处理的内容，如果需要参数处理请将逻辑集中于上一步；
 */
import Vue from 'vue';

export const searchMainList = params => Vue.axios.get('/resource/organization/getlclist', { params }).then(res => res.data);
export const createMain = params => Vue.axios.post('/resource/organization/getlclist', params).then(res => res.data);
export const getMainById = params => Vue.axios.get('/resource/organization/getlclist', { params }).then(res => res.data);
