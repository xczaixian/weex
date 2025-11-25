<template>
  <div class="page-outer">
    <div class="full-page">
      <div class="app-icon-outer">
        <div class="app-icon"></div>
      </div>
      <div class="phone-number">{{ phoneNumber }}</div>
      <div class="phone-number-hint">华为账号绑定号码</div>
      <div class="hw-login-button-outer" @click="clickHwidbtn">
        <hl-hwidbtn
          class="hw-login-button"
          :class="`${agreementChecked ? '' : 'hw-login-button-disable'}`"
        ></hl-hwidbtn>
        <div class="hw-login-button-overlay" v-if="!agreementChecked"></div>
      </div>
      <div class="other-login-button">其他方式登录</div>
      <div class="agreement-hint">
        <div
          class="agreement-check"
          @click="agreementChecked = !agreementChecked"
        >
          <div v-if="agreementChecked" class="agreement-checked"></div>
          <div v-else class="agreement-not-checked"></div>
        </div>
        <div class="agreement-links-outer">
          <span>
            <span class="agreement-plain">已阅读并同意</span>
            <span class="agreement-link">{{ agreementList[0].name }}</span>
            <span class="agreement-link">{{ agreementList[1].name }}</span>
            <span class="agreement-plain">和</span>
            <span class="agreement-link" @click="jumpPage('loginPagePDF')">{{
              agreementList[2].name
            }}</span>
            <span class="agreement-plain">。</span>
          </span>
        </div>
      </div>
    </div>
    <div class="dialog-overlay-outer" v-if="showDialog">
      <div class="dialog-overlay">
        <div class="dialog-overlay-title">用户协议与隐私条款</div>
        <div class="dialog-overlay-links-outer">
          <span>
            <span class="agreement-plain">已阅读并同意</span>
            <span class="agreement-link">{{ agreementList[0].name }}</span>
            <span class="agreement-link">{{ agreementList[1].name }}</span>
            <span class="agreement-plain">和</span>
            <span class="agreement-link" @click="jumpPage('loginPagePDF')">{{
              agreementList[2].name
            }}</span>
            <span class="agreement-plain">。</span>
          </span>
        </div>
        <div class="dialog-overlay-buttons">
          <div class="cancel-button" @click="showDialog = false">取消</div>
          <div class="hw-login-button-in-dialog">
            <div class="hw-login-button-in-dialog-inner">同意并登录</div>
            <hl-hwidbtn class="hw-login-button-in-dialog-overlay"></hl-hwidbtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const weexModule = weex.requireModule("weexModule");
import screenMixin from "@/mixin/screenMixin";
import { pushPage } from "@/utils/index.js";

export default {
  mixins: [screenMixin],
  data() {
    return {
      agreementChecked: false,
      agreementList: [
        {
          name: "《XXXX用户协议》",
        },
        {
          name: "《XXXX隐私协议》",
        },
        {
          name: "《华为账号用户认证协议》",
        },
      ],
      phoneNumber: "***********",
      showDialog: false,
    };
  },
  async created() {
    this.setScreen({
      isOpen: true,
      showStatusMsg: true,
      statusMsgColor: 0,
    });
  },
  mounted() {
    const callback = (res) => {
      if (res?.result === "success") {
        try {
          const data = JSON.parse(res.data);
          const phoneNumber =
            data.data?.extraInfo?.quickLoginAnonymousPhone || "***********";
          this.phoneNumber = phoneNumber;
        } catch (e) {
          // error
        }
      }
    };

    weexModule.callNative("quickLoginAnonymousPhone", {}, callback);
  },
  methods: {
    jumpPage(page, params = {}) {
      let newParams = params;
      pushPage(page, newParams);
    },
    clickHwidbtn() {
      if (!this.agreementChecked) {
        this.showDialog = true;
      }
    },
  },
};
</script>

<style scoped>
.page-outer {
  height: 100%;
  width: 100%;
}

.full-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f4;

  height: 100%;
  width: 100%;
}

.app-icon-outer {
  margin: 30% 0 15%;
}

.app-icon {
  width: 150px;
  height: 150px;
  border-radius: 40px;
  background-color: #ccc;
}

.hw-login-button-outer {
  width: 90%;
  background-color: #b00;
  color: white;
  height: 80px;
  border-radius: 40px;
  text-align: center;
  line-height: 80px;
  margin: 15px;
}

.hw-login-button {
  width: 100%;
  height: 100%;
}

.hw-login-button-disable {
  pointer-events: none;
}

.hw-login-button-overlay {
  display: relative;
  width: 100%;
  height: 100%;
  left: 0;
  top: -80px;
  background-color: transparent;
}

.other-login-button {
  width: 90%;
  background-color: #ddd;
  height: 80px;
  border-radius: 40px;
  text-align: center;
  line-height: 80px;
  margin: 15px;
}

.phone-number {
  font-size: 72px;
  font-weight: bold;
  padding: 5px;
}

.phone-number-hint {
  font-size: 28px;
  color: gray;
  margin: 10px 0 60px;
}

.agreement-hint {
  margin-top: auto;
  padding: 40px 20px;
  height: 160px;
  color: gray;
  display: flex;
  flex-direction: row;
}

.agreement-check {
  width: 40px;
  height: 40px;
  margin: 20px;
}

.agreement-not-checked {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid gray;
}

.agreement-checked {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #d00;
  border: 1px solid gray;
}

.agreement-links-outer {
  width: 90%;
}

.agreement-plain {
  font-size: 28px;
  color: gray;
}

.agreement-link {
  font-size: 28px;
  color: black;
}

.dialog-overlay-outer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #00000088;
}

.dialog-overlay {
  background-color: white;
  position: absolute;
  top: 35%;
  height: 30%;
  width: 90%;
  left: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5%;
  border-radius: 40px;
  justify-content: space-around;
}

.dialog-overlay-title {
  font-size: 48px;
  padding: 20px;
}

.dialog-overlay-links-outer {
  padding: 20px;
}

.dialog-overlay-buttons {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
}

.cancel-button {
  width: 40%;
  background-color: #ddd;
  height: 80px;
  border-radius: 40px;
  text-align: center;
  line-height: 80px;
  margin: 15px;
}

.hw-login-button-in-dialog {
  width: 40%;
  background-color: #d00;
  height: 80px;
  border-radius: 40px;
  margin: 15px;
}

.hw-login-button-in-dialog-inner {
  width: 100%;
  height: 100%;
  color: white;
  text-align: center;
  line-height: 80px;
}

.hw-login-button-in-dialog-overlay {
  opacity: 0;
  width: 100%;
  height: 80px;
  position: relative;
  top: -80px;
  left: 0;
}
</style>
