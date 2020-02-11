<template>
	<v-dialog v-model="cond" persistent max-width="280">
		<v-card class="text-center">
			<v-card-title class="headline justify-center">Авторизация</v-card-title>
			<v-card-text v-if="!fail">Пожалуйста, войдите в Google-аккаунт для продолжения.</v-card-text>
			<v-card-text v-else>Данный аккаунт не имеет доступа в базу знаний.</v-card-text>
			<v-card-actions class="justify-center">
				<v-btn
					v-if="!fail"
					@click="handleClickSignIn"
				>
					Войти
				</v-btn>
				<v-btn
					v-else
					@click="handleClickSignIn"
				>
					Сменить
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "Auth",
	data() {
		return {
			cond: false,
			fail: false
		};
	},
	methods: {
		handleClickSignIn() {
			this.$gAuth
				.signIn()
				.then(GoogleUser => {
					if (GoogleUser.getBasicProfile().U3.split('@')[1] == 'baby-club.ru') {
						this.fail = this.cond = false;
						this.$router.push('/file_viewer');
					} else {
						this.$gAuth.signOut().then(() => {
							this.fail = true;
						})
					}
				})
		}
	},
	mounted() {
		let that = this;
		let checkGauthLoad = setInterval(function() {
			if (that.$gAuth.isInit) {
				that.cond = !that.$gAuth.isAuthorized;
				that.$gAuth.isAuthorized ? that.$router.push('/file_viewer') : '';
				clearInterval(checkGauthLoad);
			}
		}, 1);
	}
};
</script>
