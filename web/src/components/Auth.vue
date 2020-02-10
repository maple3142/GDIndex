<template>
	<div class="auth">
		<v-btn
			v-if="isSignIn"
			@click="handleClickSignOut"
			class="auth__out"
		>
			Выйти
		</v-btn>
		<v-dialog v-model="cond" persistent max-width="280">
			<v-card class="text-center">
				<v-card-title class="headline justify-center">Авторизация</v-card-title>
				<v-card-text>Пожалуйста, войдите в Google-аккаунт для продолжения.</v-card-text>
				<v-card-actions class="justify-center">
					<v-btn
						v-if="!isSignIn"
						@click="handleClickSignIn"
					>
						Войти
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
/* eslint-disable */
export default {
	name: "Auth",
	data() {
		return {
			isSignIn: false,
			cond: false
		};
	},
	methods: {
		handleClickSignIn() {
			this.$gAuth
				.signIn()
				.then(GoogleUser => {
					//on success do something
					this.isSignIn = this.$gAuth.isAuthorized;
					this.cond = false;
				})
				.catch(error => {
					//on fail do something
				});
		},
		handleClickSignOut() {
			this.$gAuth
				.signOut()
				.then(() => {
					//on success do something
					this.isSignIn = this.$gAuth.isAuthorized;
					this.cond = true;
				})
				.catch(error => {
					//on fail do something
				});
		}
	},
	mounted() {
		let that = this;
		let checkGauthLoad = setInterval(function() {
			that.isSignIn = that.$gAuth.isAuthorized;

			if (that.$gAuth.isInit) {
				that.cond = !that.isSignIn;
				clearInterval(checkGauthLoad);
			}
		}, 1);
	}
};
</script>

<style lang="scss" scoped>
.auth {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 10;

	&__out {
		position: absolute;
		top: 10px;
		right: 10px;
	}
}
</style>
