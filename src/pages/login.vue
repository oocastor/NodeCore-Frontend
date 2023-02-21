<template>
    <div class="flex h-full align-items-center justify-content-center">
        <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6 max-w-30rem">
            <div class="text-center text-900 text-6xl font-medium font-grandHotel">nodeup</div>
            <Divider class="mb-5"></Divider>
            <div>
                <label class="block text-900 font-medium mb-2">Username</label>
                <InputText type="text" v-model="user.username" class="w-full mb-3" />

                <label class="block text-900 font-medium mb-2">Password</label>
                <InputText type="password" v-model="user.pwd" class="w-full mb-3" />

                <div class="flex align-items-center justify-content-between mb-5">
                    <div class="flex align-items-center">
                        <Checkbox :binary="true" v-model="user.rememberMe" class="mr-2"></Checkbox>
                        <label>Remember me</label>
                    </div>
                </div>
                <Button label="Sign In" icon="pi pi-user" class="w-full" @click="test();"></Button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    name: "login",

    data() {
        let user = ref({
            rememberMe: false,
            username: "",
            pwd: "",
        });

        return {
            user
        }
    },

    methods: {
        test() {
            console.log(this.user);
        }
    }
}

</script>