<template>
	<v-dialog v-model="show" max-width="700">
		<template v-slot:activator="{ on }">
			<v-btn
				v-if="enabled"
				v-text="$t('aria2RPCSettings')"
				color="primary"
				@click="onShow"
				id="btn-show"
			></v-btn>
		</template>
		<v-card>
			<v-card-title class="headline">
				<span>{{ $t('aria2RPCSettings') }}</span>
			</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-text-field
							:label="$t('aria2RPCHost')"
							v-model="rpcHost"
						></v-text-field>
					</v-row>
					<v-row>
						<v-text-field
							:label="$t('aria2RPCPort')"
							v-model="rpcPort"
						></v-text-field>
					</v-row>
					<v-row>
						<v-text-field
							:label="$t('aria2RPCHost')"
							v-model="rpcPath"
						></v-text-field>
					</v-row>
					<v-row>
						<v-text-field
							:label="$t('aria2RPCToken')"
							v-model="rpcToken"
						></v-text-field>
					</v-row>
					<v-row>
						<v-text-field
							:label="$t('aria2RPCDownloadPath')"
							v-model="downloadPath"
						></v-text-field>
					</v-row>
				</v-container>
				<template>
					<v-alert dense type="info" v-if="testStatus === 0">
						{{ $t('aria2Testing') }}
					</v-alert>
					<v-alert dense type="success" v-if="testStatus === 1">
						{{ $t('aria2TestSucceed', { version: testVersion }) }}
					</v-alert>
					<v-alert dense type="error" v-if="testStatus === 2">
						{{
							$t('aria2TestFailed', { reason: testFailedReason })
						}}
					</v-alert>
				</template>
			</v-card-text>
			<v-card-actions id="actions">
				<v-btn
					color="primary"
					@click="test"
					v-text="$t('aria2TestConnection')"
					text
				></v-btn>
				<v-btn
					color="primary"
					@click="save"
					v-text="$t('save')"
					text
				></v-btn>
				<v-btn @click="close" v-text="$t('close')" text></v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import aria2 from '../aria2'

export default {
	data() {
		return {
			show: false,
			enabled: window.props.download_aria2,
			rpcHost: '',
			rpcPort: 6800,
			rpcPath: '/jsonrpc',
			rpcToken: '',
			downloadPath: '',
			testStatus: -1,
			testVersion: '',
			testFailedReason: ''
		}
	},
	computed: {},
	methods: {
		onShow: function() {
			this.load()
			this.show = true
		},
		load: function() {
			this.rpcHost = aria2.getRpcHost()
			this.rpcPort = aria2.getRpcPort()
			this.rpcPath = aria2.getRpcPath()
			this.rpcToken = aria2.getRpcToken()
			this.downloadPath = aria2.getDownloadPath()
		},
		save: function() {
			aria2.setRpcHost(this.rpcHost)
			aria2.setRpcPort(this.rpcPort)
			aria2.setRpcPath(this.rpcPath)
			aria2.setRpcToken(this.rpcToken)
			aria2.setDownloadPath(this.downloadPath)
		},
		test: function() {
			this.save()

			this.testStatus = 0
			aria2.test().then(
				result => {
					this.testStatus = 1
					this.testVersion = result.version
				},
				reason => {
					this.testStatus = 2
					this.testFailedReason = reason
				}
			)
		},
		close: function() {
			this.show = false
		}
	}
}
</script>
<style>
#actions {
	justify-content: flex-end;
}

#btn-show {
	margin-right: 10px;
}
</style>
