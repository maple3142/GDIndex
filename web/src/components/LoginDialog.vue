<template>
	<v-dialog v-model="cond" persistent max-width="500">
		<v-card>
			<v-card-title class="headline">Require Authentiaction</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col>
							<v-text-field
								label="Username"
								required
								v-model="user"
								:error="wrong"
							></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-text-field
								label="Password"
								type="password"
								required
								v-model="pass"
								:error="wrong"
							></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<div class="flex-grow-1"></div>
				<v-btn color="green darken-1" text @click="doLogin">
					Login
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
//import api from '../api'

export default {
	props: {
		cond: Boolean
	},
	data() {
		return {
			user: '',
			pass: '',
			wrong: false
		}
	},
	methods: {
		doLogin() {
			const { user, pass } = this
			const tok = btoa(user + ':' + pass)
			fetch(window.props.api, {
				headers: {
					Authorization: 'Basic ' + tok
				},
				credentials: 'omit'
			})
				.then(r => {
					if (r.status === 200) {
						localStorage.token = tok
						// eslint-disable-next-line
						location.href = location.href
					}
					this.wrong = true
				})
				.catch(err => console.log(err))
		}
	}
}
</script>
