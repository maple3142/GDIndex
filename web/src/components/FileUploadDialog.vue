<template>
	<v-dialog :persistent="uploading" v-model="innerShow" max-width="500">
		<v-card v-if="!uploading">
			<v-card-title class="headline">
				<span>{{ $t('fileUpload') }}</span>
				<v-switch
					v-model="uploadFromUrl"
					class="ml-4 mt-0 pt-0 title-switch"
					:label="$t('urlUpload')"
				>
				</v-switch>
			</v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col v-if="uploadFromUrl">
							<v-text-field
								:label="$t('urlUpload')"
								v-model="url"
								:error="showError"
								:messages="$t('bigFileUploadWarning')"
							></v-text-field>
						</v-col>
						<v-col v-else>
							<v-file-input
								:label="$t('fileToUpload')"
								v-model="file"
								prepend-icon=""
								prepend-inner-icon="$file"
								:error="showError"
							></v-file-input>
						</v-col>
					</v-row>
					<v-row>
						<v-col>
							<v-text-field
								:label="$t('fileName')"
								v-model="fileName"
							></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<div class="flex-grow-1"></div>
				<v-btn
					color="primary"
					@click="upload"
					v-text="$t('upload')"
					text
				></v-btn>
			</v-card-actions>
		</v-card>
		<v-card v-else>
			<v-card-title
				class="headline"
				v-text="$t('uploading')"
			></v-card-title>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col>
							<p
								class="text-right mb-0"
								v-text="progressMessage"
							></p>
							<v-progress-linear :value="progress">
							</v-progress-linear>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>
<script>
const isUrl = u => {
	try {
		new URL(u)
		return true
	} catch (e) {
		return false
	}
}
export default {
	props: {
		value: Boolean,
		uploadUrl: String
	},
	data() {
		return {
			innerShow: this.value,
			file: null,
			fileName: '',
			url: '',
			uploadFromUrl: false,
			showError: false,
			uploading: false,
			progress: 0
		}
	},
	computed: {
		progressMessage() {
			if (this.progress < 100) {
				return this.$t('uploading')
			}
			return this.$t('serverProcessing')
		}
	},
	watch: {
		innerShow(v) {
			this.$emit('input', v)
		},
		value(v) {
			if (v) {
				Object.assign(this.$data, this.$options.data.apply(this))
			}
			this.innerShow = v
		},
		file() {
			this.updateFileName()
		},
		url() {
			this.updateFileName()
		},
		uploadFromUrl() {
			this.updateFileName()
		}
	},
	methods: {
		updateFileName() {
			if (this.uploadFromUrl) {
				this.fileName = decodeURIComponent(this.url.split('/').pop())
			} else if (this.file) {
				this.fileName = this.file.name
			}
		},
		upload() {
			const valid = this.uploadFromUrl
				? isUrl(this.url)
				: this.file instanceof File
			if (!valid) {
				this.showError = true
				return
			}
			const xhr = new XMLHttpRequest()
			xhr.upload.onprogress = e => {
				if (!e.lengthComputable) return
				this.progress = Math.round((e.loaded / e.total) * 100)
			}
			xhr.upload.onload = () => {
				this.progress = 100
			}
			xhr.onload = () => {
				this.$emit('uploaded')
			}
			let body = ''
			const u = new URL(this.uploadUrl)
			u.pathname += '/' + encodeURIComponent(this.fileName)
			if (this.uploadFromUrl) {
				u.searchParams.set('url', this.url)
				this.progress = 100
			} else {
				body = this.file
			}
			xhr.open('PUT', u.href)
			if (localStorage.token) {
				xhr.setRequestHeader(
					'Authorization',
					'Basic ' + localStorage.token
				)
			}
			xhr.send(body)
			this.uploading = true
		}
	}
}
</script>
<style>
.title-switch .v-messages {
	display: none;
}
.title-switch .v-input__slot {
	margin-bottom: 0px !important;
}
</style>
