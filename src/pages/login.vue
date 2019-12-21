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
  width: 100%;
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

<style lang="scss" scoped>
.captchaItem {
  & /deep/ .ivu-input-group-append {
    padding: 0 !important;
    border: none !important;
  }
}
</style>

<template>
  <div class="layout">
    <div class="layout-login">
      <div class="login-panel">
        <div class="login-title">
          <span style="color: #17233d;font-weight: 700">{{showtext}}</span>
          <div>
            <span
              style="color: #2d8cf0;cursor: pointer"
              @click="isLogin = !isLogin"
            >{{isLogin ? '注册' : '登录'}}</span>
            <span style="color: #2d8cf0;cursor: pointer" @click="handleShowModel('changePwd')">忘记密码</span>
          </div>
        </div>
        <Form ref="formLogin" :model="formLogin" :rules="ruleInline" v-show="modle == 'formLogin'">
          <div class="login-area">
            <FormItem prop="username">
              <i-input
                v-model="formLogin.username"
                type="text"
                placeholder="用户名"
                style="width: 100%"
              ></i-input>
            </FormItem>
            <FormItem prop="password">
              <i-input
                v-model="formLogin.password"
                type="password"
                placeholder="密码"
                style="width: 100%"
              ></i-input>
            </FormItem>

            <FormItem prop="captcha" class="captchaItem">
              <i-input
                v-model="formLogin.captcha"
                type="text"
                :maxlength="4"
                placeholder="验证码"
                style="width: 100%;"
              >
                <div
                  id="v_container"
                  class="captcha-ipt"
                  slot="append"
                  style="width: 100px;height: 30px;"
                ></div>
              </i-input>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                style="width: 100%"
                @click="handleSubmit('formLogin')"
                long
                :loading="loading"
              >登 录</Button>
            </FormItem>
          </div>
        </Form>
        <Form
          ref="formRegister"
          :model="formRegister"
          :rules="ruleRegister"
          v-show="modle == 'formRegister'"
        >
          <FormItem prop="username">
            <i-input
              v-model="formRegister.username"
              type="text"
              placeholder="请输入登录用户名"
              style="width: 100%"
            ></i-input>
          </FormItem>
          <FormItem prop="password">
            <i-input
              v-model="formRegister.password"
              type="password"
              placeholder="请输入密码"
              style="width: 100%"
            ></i-input>
          </FormItem>
          <FormItem prop="comfirmPassword">
            <i-input
              v-model="formRegister.comfirmPassword"
              type="password"
              placeholder="请再次输入密码"
              style="width: 100%"
            ></i-input>
          </FormItem>
          <FormItem prop="email">
            <i-input
              v-model="formRegister.email"
              type="text"
              placeholder="请输入您的常用邮箱"
              style="width: 100%"
            ></i-input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              style="width: 100%"
              @click="handleSubmit('formRegister')"
              long
              :loading="loading"
            >快速注册</Button>
          </FormItem>
        </Form>
        <Form
          ref="changePwd"
          :model="changePwd"
          :rules="ruleRegister"
          v-show="modle == 'changePwd'"
        >
          <FormItem prop="email">
            <i-input
              v-model="changePwd.email"
              type="text"
              placeholder="请输入您的注册邮箱"
              style="width: 100%"
            ></i-input>
          </FormItem>
          <FormItem prop="password">
            <i-input
              v-model="changePwd.password"
              type="password"
              placeholder="请输入密码"
              style="width: 100%"
            ></i-input>
          </FormItem>
          <FormItem prop="comfirmPassword">
            <i-input
              v-model="changePwd.comfirmPassword"
              type="password"
              placeholder="请再次输入密码"
              style="width: 100%"
            ></i-input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              style="width: 100%"
              @click="handleSubmit('changePwd')"
              long
              :loading="loading"
            >提交</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import config from '@/config';
  import {
    BASEURL
  } from 'api/config'
  import {
    saveMessage
  } from 'utils/tool.js'
  const reg = /^(?=.*?\d)(?=.*?[A-Za-z])[\dA-Za-z]{8,}$/ //检验密码
  export default {
    data () {
      let _this = this
      return {
        loading: false,
        isLogin: true,
        modle: 'formLogin',
        showtext: "欢迎登录",
        showChangePwd: true,
        formLogin: {
          username: '',
          password: '',
          captcha: ''
        },
        changePwd: {
          password: "",
          comfirmPassword: "",
          email: ""
        },

        ruleInline: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          captcha: [
            {
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请填写验证码'))
                } else {
                  if (!_this.$verify.validate(value)) {
                    callback(new Error('请输入正确的验证码'))
                  } else {
                    callback()
                  }
                }
              }
            }
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
                if (value !== this[this.modle]['password']) {
                  callback(new Error('新密码输入不一致，请重新确认'))
                } else {
                  callback()
                }
              }
            }
          }],
          email: [{
            required: true,
            trigger: 'blur',
            message: '请输入邮箱'
          }]
        },
      };
    },
    computed: {},
    watch: {
      isLogin: function () {
        console.log(this.isLogin)
        this.modle = this.isLogin ? 'formLogin' : 'formRegister'
      },

      modle: function () {
        let map = {
          formLogin: "欢迎登录",
          formRegister: "注册新用户",
          changePwd: "修改密码" 
        }
        this.showtext = map[this.modle]
      }
    },

    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'formLogin') {
              this.userLogin()
            } else if (name === 'formRegister') {
              this.userRegister()
            } else if (name === 'changePwd') {
              this.usernameSendUpdatePassword()
            } 
          } else {
            this.$Message.error('请填写正确再提交!');
          }
        });
      },

      handleShowModel(modle) {
        this.modle = modle;
      },

      userLogin () {
        const data = {
          loginName: this.formLogin.username,
          loginPassword: this.formLogin.password,
          verifyCode: this.formLogin.captcha
        };
        this.loading = true;
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
            saveMessage('tokenId', data.data.tokenId)
            saveMessage('userId', data.data.userId)
            saveMessage('permissionList', JSON.stringify(data.data.permissionList))
            this.$router.push({path: data.data.permissionList[0].uiPath});
          } else {
            this.$Message.warning(data.message);
            this.changeCaptcha(); //更新验证码
          }
          this.loading = false;
        }).catch(err => {
          console.log('err', err)
          this.changeCaptcha(); //更新验证码
          this.loading = false;
        })
      },
      userRegister () {
        const data = {
          loginName: this.formRegister.username,
          loginPassword: this.formRegister.password,
          email: this.formRegister.email
        };
        this.loading = true;
        axios({
          url: `${BASEURL}/user/register`,
          method: 'post',
          data, 
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res => {
          console.log('res', res)
          const { data } = res
          if(data.code === 'SUCCESS') {
            this.$Message.success('注册成功，请到邮箱认证');
            this.isLogin = false
          } else {
            this.$Message.warning(data.message);
            this.changeCaptcha(); //更新验证码
          }
          this.loading = false;
        }).catch(err => {
          console.log('err', err)
          this.loading = false;
        })
      },

      usernameSendUpdatePassword () {
        const data = {
          loginPassword: this.changePwd.password,
          email: this.changePwd.email
        };
        this.loading = true;
        axios({
          url: `${BASEURL}/user/sendUpdatePassword`,
          method: 'post',
          data, 
          headers: {'Content-Type': 'application/json;charset=UTF-8'}
        }).then(res => {
          console.log('res', res)
          const { data } = res
          if(data.code === 'SUCCESS') {
            this.$Message.success('发送成功，请到邮箱认证');
            this.isLogin = false
          } else {
            this.$Message.warning(data.message);
            this.changeCaptcha(); //更新验证码
          }
          this.loading = false;
        }).catch(err => {
          console.log('err', err)
          this.loading = false;
        })
      },

      changeCaptcha () {
        this.formLogin.captcha = '';
        this.$verify.refresh()
      },
    },

    created () {
      if(this.$route.query['msg']){
        this.$Message.success(this.$route.query['msg'])
      }
    },

    mounted () {
      this.$verify.gverify('v_container'); //验证码初始化
      window.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          this.handleSubmit('formLogin');
        }
      });
      saveMessage('tokenId', '')
      saveMessage('userId', '')
    },
    components: {}
  };
</script>
