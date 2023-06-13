<template>
    <div class="flex h-full align-items-center justify-content-center">
        <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6 max-w-30rem">
            <div class="text-5xl font-monomaniac mb-2 text-center">Node<span class="text-primary">Core</span></div>
            <Divider class="mb-3" style="background-color: rgba(255, 255, 255, 0.25); height: 1px;"></Divider>
            <div class="bg-red-600 py-3 px-2 mb-3 flex align-items-center gap-2 fadein animation-duration-300" v-if="error">
                <i class="pi pi-info-circle" style="font-size: 2rem"></i>
                <p class="m-0">{{ msg }}</p>
            </div>
            <div>
                <label class="block text-900 font-medium mb-2">User</label>
                <InputText type="text" v-model="user.user" class="w-full mb-3" />

                <label class="block text-900 font-medium mb-2">Password</label>
                <InputText type="password" v-model="user.pw" class="w-full mb-3" />

                <div class="flex align-items-center justify-content-between mb-5">
                    <div class="flex align-items-center">
                        <Checkbox :binary="true" v-model="user.rememberMe" class="mr-2"></Checkbox>
                        <label>Remember me</label>
                    </div>
                </div>
                <Button label="Sign In" icon="pi pi-user" class="w-full" @click="loginWithPw(user);"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import Divider from "primevue/divider";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

import { loginWithPw } from "@/bin/auth";

export default {
    name: "login",

    data() {
        let user = ref({
            rememberMe: true,
            user: "",
            pw: "",
        });

        return {
            user,
            loginWithPw,
            msg: "",
            error: false
        }
    },

    methods: {
        enter(event) {
            if(event.key === "Enter") {
                this.loginWithPw(this.user);
            }
        }
    },

    mounted() {
        this.$EVENT.on("loginError", (msg) => {
            this.msg = msg;
            this.error = true;
        });
    },

    created() {
        document.addEventListener("keydown", this.enter);
    },

    unmounted() {
        document.removeEventListener("keydown", this.enter);
    },

    components: {
        Button,
        Divider,
        Checkbox,
        InputText,
    }
}

</script>