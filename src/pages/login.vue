<style scoped>
  .layout {
    /*background: #f5f7f9;*/
    position: relative;
    overflow: hidden;

    width: 100%;
    height: 100%;
    background-image: url(../../static/assets/img/login_bg.jpg);
    background-size: cover;
    background-position: 50%;
  }

  .login-panel {
    top: 0;
    width: 350px;
    padding: 30px 20px 16px 20px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;
    box-shadow: 0px 0px 100px rgba(255, 255, 255, 0.4);
  }

  .captchaImage {
    float: right;
    padding: 0px 1px;
    border-radius: 4px 4px 4px 4px;
    height: 28px;
    position: absolute;
    right: 1px;
    top: 3px;
  }

  .captchaImage:hover {
    cursor: pointer;
  }

  .login-title {
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .layout-footer {
    position: fixed;
    bottom: 0px;
    text-align: center;
    color: #9ea7b4;
    width: 100%
  }

  .layout-login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
  }

</style>

<template>
  <div class="layout">
    <div class="layout-login">
      <div class="login-panel">
        <div class="login-title">
          <span style="color: #17233d;font-weight: 700">{{isLogin ? '欢迎登录' : '注册新用户'}}</span>
          <span style="color: #2d8cf0;cursor: pointer" @click="isLogin = !isLogin">{{isLogin ? '注册' : '登录'}}</span>
        </div>
        <Form ref="formLogin" :model="formLogin" :rules="ruleInline" v-if="isLogin">
          <div class="login-area">
            <FormItem prop="username">
              <i-input v-model="formLogin.username" type="text" placeholder="用户名" style="width: 100%"></i-input>
            </FormItem>
            <FormItem prop="password">
              <i-input v-model="formLogin.password" type="password" placeholder="密码" style="width: 100%"></i-input>
            </FormItem>

            <FormItem v-if="captchaEnable" prop="captcha" class="captchaItem">
              <i-input v-model="formLogin.captcha" type="text" @change="toUpperCase(val)" :maxlength="4" placeholder="验证码"
                      style="width: 100%;">
                <!--<span slot="append"></span>-->
              </i-input>
              <img class="captchaImage" :src="captchaUrl" @click="changeCaptcha()" title="点击更换验证码">
            </FormItem>
            <FormItem>
              <Button type="primary" style="width: 100%" @click="handleSubmit('formLogin')" long :loading="loading">
                登 录
              </Button>
            </FormItem>
          </div>
          <div style="padding: 0px 8px;">
            Username:<b>admin</b> Password:<b>123456</b>
            <router-link style="float: right;" to="/">忘记密码</router-link>
          </div>
        </Form>
        <Form ref="formRegister" :model="formRegister" :rules="ruleRegister" v-else>
          <FormItem prop="username">
            <i-input v-model="formRegister.username" type="text" placeholder="请输入登录用户名" style="width: 100%"></i-input>
          </FormItem>
          <FormItem prop="password">
            <i-input v-model="formRegister.password" type="password" placeholder="请输入密码" style="width: 100%"></i-input>
          </FormItem>
          <FormItem prop="comfirmPassword">
            <i-input v-model="formRegister.comfirmPassword" type="password" placeholder="请再次输入密码" style="width: 100%"></i-input>
          </FormItem>
          <FormItem prop="email">
            <i-input v-model="formRegister.email" type="text" placeholder="请输入您的常用邮箱" style="width: 100%"></i-input>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width: 100%" @click="handleSubmit('formRegister')" long :loading="loading">
              快速注册
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="layout-footer">{{footerText}}</div>
  </div>
</template>
<script>
  import axios from 'axios';
  import config from '@/config';
  import {
    BASEURL
  } from 'api/config'
  const reg = /^(?=.*?\d)(?=.*?[A-Za-z])[\dA-Za-z]{8,}$/ //检验密码
  export default {
    data () {
      return {
        captchaUrl: this.captchaUrl = HOST + config.api.captcha + new Date().getTime(),
        captchaEnable: config.captchaEnable,
        loading: false,
        isLogin: true,
        footerText: config.footerText,
        formLogin: {
          username: '',
          password: '',
          captcha: ''
        },
        ruleInline: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '请填写验证码', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
          ]
        },

        formRegister: {
          username: '',
          password: '',
          comfirmPassword: '',
          email: ''
        },

        ruleRegister: {
          username: [{
            required: true,
            trigger: 'blur',
            message: '请输入用户名'
          }],
          password: [{
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!reg.test(value)) {
                callback(new Error('要求至少8位数字加英文'))
              } else {
                callback()
              }
            }
          }],
          comfirmPassword: [{
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!reg.test(value)) {
                callback(new Error('要求至少8位数字加英文'))
              } else {
                if (value !== this.formRegister['password']) {
                  callback(new Error('新密码输入不一致，请重新确认'))
                } else {
                  callback()
                }
              }
            }
          }],
        },
      };
    },
    computed: {},
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            // let data = {
            //   username: this.formLogin.username,
            //   password: this.formLogin.password,
            //   captcha: this.formLogin.captcha
            // };
            this.loading = true;
            const data = {
              "loginName": "admin",
              "loginPassword": "admin1234",
              "verifyCode": "nd74",
            }
            axios({
              url: `${BASEURL}/user/login`,
              method: 'post',
              data, 
              headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).then(res => {
              console.log('res', res)
              const { data } = res
              if(data.code === 'SUCCESS') {
                this.$Message.success('登录成功');
                localStorage.setItem('tokenId', data.data.tokenId)
                localStorage.setItem('userId', data.data.userId)
                this.$router.push({path: '/user'});
              } else {
                this.changeCaptcha(); //更新验证码
              }
            }).catch(err => {
              console.log('err', err)
              this.changeCaptcha(); //更新验证码
            })
          } else {
            this.$Message.error('请填写正确再提交!');
          }
        });
      },
      changeCaptcha () {
        this.formLogin.captcha = '';
        // this.captchaUrl = HOST + config.api.captcha + new Date().getTime();
      },
      toUpperCase (val) {
        console.log(val);
      }
    },
    mounted () {
      window.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          this.handleSubmit('formLogin');
        }
      });
      localStorage.setItem('tokenId', '')
      localStorage.setItem('userId', '')
    },
    components: {}
  };
</script>
