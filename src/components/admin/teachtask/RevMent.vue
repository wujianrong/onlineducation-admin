<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<el-tabs v-model="activeName2" type="card" class="padding-top" @tab-click="handleClick">
			<el-tab-pane label="未精选" name="first">
				<data-tables v-loading="loading" :data="data_unb" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters" @selection-change="handleSelectionChange">

					<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">

						<el-col :span="11" class="delete_comment">
							<el-button type="primary" @click="cancelselect" :disabled="revdisabled">设为精选</el-button>
							<el-button @click="deleterev" :disabled="revdisabled">删除评论</el-button>
							<span class="delete_comment xuan" v-if="choice>0">已选中{{choice}}条评论</span>
						</el-col>
						<el-col :span="13" class="text-align-right">
							<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索课程名称" class="class_input_width">
							</el-input>
						</el-col>
					</el-row>
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="content" label="评论内容" key="content" sortable="custom">
					</el-table-column>
					<el-table-column prop="lesson" label="课程名称" key="lesson" sortable="custom" width="285">
						<template slot-scope="scope">
							<p>{{scope.row.lesson}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="guest.nickname" label="评论人" key="guest.nickname" sortable="custom" width="135">
						<template slot-scope="scope">
							<p class="blue">{{scope.row.guest}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="created_at" label="评论时间" key="created_at" sortable="custom" width="165">
						<template slot-scope="scope">
							<p>{{scope.row.created_at}}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="135">
						<template slot-scope="scope">
							<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
								精选
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command='{command: "a",scope:scope}'>删除评论</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</data-tables>
			</el-tab-pane>

			<el-tab-pane label="已精选" name="second">
				<data-tables v-loading="loading" :data="data_b" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters" @selection-change="handleSelectionChange">

					<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">

						<el-col :span="11" class="delete_comment">
							<el-button type="primary" @click="cancelselect" :disabled="revdisabled">取消精选</el-button>
							<el-button @click="deleterev" :disabled="revdisabled">删除评论</el-button>
							<span class="delete_comment xuan" v-if="choice>0">已选中{{choice}}条评论</span>
						</el-col>
						<el-col :span="13" class="text-align-right">
							<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索课程名称" class="class_input_width">
							</el-input>
						</el-col>
					</el-row>
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="content" label="评论内容" key="content" sortable="custom">
					</el-table-column>
					<el-table-column prop="lesson" label="课程名称" key="lesson" sortable="custom" width="285">
						<template slot-scope="scope">
							<p>{{scope.row.lesson}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="guest.nickname" label="评论人" key="guest.nickname" sortable="custom" width="135">
						<template slot-scope="scope">
							<p class="blue">{{scope.row.guest}}</p>
						</template>
					</el-table-column>
					<el-table-column prop="created_at" label="评论时间" key="created_at" sortable="custom" width="165">
						<template slot-scope="scope">
							<p>{{scope.row.created_at}}</p>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="135">
						<template slot-scope="scope">
							<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
								取消
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command='{command: "a",scope:scope}'>删除评论</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</data-tables>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import notcaresel from './../teachtask/revment/notcaresel.vue'
	import caresel from './../teachtask/revment/caresel.vue'
	export default {
		components: {
			notcaresel,
			caresel
		},
		data() {
			return {
				activeName2: 'first',
				//未精选的数据
				data_unb: [],
				//精选的数据
				data_b: [],
				nowpage: '未精选',
				customFilters: [{
					vals: '',
					props: ['lesson'],
				}],
				loading: false,
				tableProps: {
					border: false, //去掉边框
					// stripe: false  //去掉斑马纹
				},
				//分页设置
				paginationDef: {
					pageSize: 10,
					pageSizes: [10, 20, 50]
				},
				multipleSelection: [],
				choice: 0,
				revdisabled: true
			}
		},
		methods: {
			// 获取当前tab
			handleClick(tab, event) {
				this.nowpage = tab.label;
			},
			//评论管理表格数据
			gettabledata() {
				this.loading = true;
				this.data_unb = [];
				this.data_b = [];
				axios.get('/admin/discusse/lists').then(res => {
					for(var i in res.data) {
						if(res.data[i].is_better === 0) {
							this.data_unb.push(res.data[i]);
						} else if(res.data[i].is_better === 1) {
							this.data_b.push(res.data[i]);
						}
					}
					this.loading = false
				}).catch(error => {
					this.loading = false
				})
			},
			//获取勾选上的id集合
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this.choice = this.multipleSelection.length
				if(this.choice > 0) {
					this.revdisabled = false
				} else {
					this.revdisabled = true
				}
			},

			// 单个设置精选（取消精选）（调用处）
			customButtonsForRowone(row) {
				let sub = {}
				if(this.nowpage == '未精选') {
					sub.tips = '只有设为精选的评论才会在课程评论页上显示，真的要设为精选吗？'; //未精选和已精选两种提示语
					sub.url = '/admin/discusse/' + row.id + '/better'; //请求地址，未精选和已精选分别两个不同的地址
					sub.text = '未精选';

				} else if(this.nowpage == '已精选') {
					sub.tips = '真的要取消精选评论吗？取消后，在课程评论页将看不到此评论了！';
					sub.url = '/admin/discusse/' + row.id + '/un_better'
					sub.text = '已精选';
				}
				this.$confirm(sub.tips, '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.revmentset(sub);
					this.gettabledata();
				}).catch(() => {

				})
			},
			//单个精选评论（取消精选）
			revmentset(sub) {
				this.loading = true;
				axios.get(sub.url)
					.then((res) => {
						if(res.data.status) {
							this.loading = false;
							this.$message.success(res.data.message);
						} else {
							this.$message.warning(res.data.message);
						}

					})
					.catch((error) => {
						console.log(error)
					})
			},

			// 批量设置精选（取消精选）（调用处）
			cancelselect() {
				let sub = {};
				if(this.nowpage == '未精选') {
					sub.tips = '只有设为精选的评论才会在课程评论页上显示，真的要设为精选吗？'; //未精选和已精选两种提示语
					sub.text = '未精选';
					sub.url = '/admin/discusse/better_some' //批量设置精选的请求地址

				} else if(this.nowpage == '已精选') {
					sub.tips = '真的要取消精选评论吗？取消后，在课程评论页将看不到此评论了！';
					sub.text = '已精选';
					sub.url = '/admin/discusse/un_better_some' //批量取消精选的请求地址
				}
				this.$confirm(sub.tips, '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.loading = true;
					this.setrev(sub.url);
				}).catch(() => {

				})
			},
			//批量精选(取消精选)
			setrev(url) {
				// let multipleSelection = this.multipleSelection
				let multipleSelections = [];
				for(let i = 0; i < this.multipleSelection.length; i++) {
					multipleSelections.push(this.multipleSelection[i].id)
				}
				axios.post(url, {
					discusse_ids: multipleSelections
				}).then(res => {
					if(res.data.status) {
						this.gettabledata();
						this.$message.success(res.data.message);
					} else {
						this.$message.error(res.data.message);
					}
				}).catch(error => {
					this.loading = false
				})
			},

			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除此评论吗？', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.deletecol(row.scope)
					}).catch(() => {

					})

				}
			},

			//单个删除评论
			deletecol(row) {
				this.loading = true
				let id = row.row.id
				axios.get('/admin/discusse/' + id + '/delete').then(res => {
					this.gettabledata();
					if(res.data.status) {
						this.$message.success(res.data.message);
					} else {
						this.$message.error(res.data.message);
					}
				}).catch(error => {
					this.loading = false
					console.log(error);
				})
			},
			// 批量删除（调用处）
			deleterev() {
				this.$confirm('真的要删除评论吗？', '提醒', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.loading = true;
					this.removerev();
				}).catch(() => {

				})
			},
			//批量删除评论
			removerev() {
				let multipleSelection = this.multipleSelection
				axios.post('/admin/discusse/delete_some', {
					discusse_ids: multipleSelection
				}).then(res => {
					if(res.data.status) {
						this.$message.success(res.data.message);
						this.gettabledata();
					} else {
						this.$message.error(res.data.message);
					}
				}).catch(error => {
					this.loading = false;
					console.log(error);
				})
			}

		},
		mounted() {
			this.gettabledata()
		}
	}
</script>
<style scoped>
	.delete_comment {
		text-align: left
	}
	
	.xuan {
		line-height: 1;
		font-size: 14px;
		display: inline-block;
		margin-left: .3rem;
	}
	
	.demo-table-expand {
		font-size: 0
	}
	
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf
	}
	
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%
	}
	
	.class_el_row {
		margin-bottom: 10px;
		padding: 10px;
		background: #F5F5F5;
		border-radius: 4px
	}
	
	.el-table td,
	.el-table th {
		padding: 12px 0 12px 10px
	}
	
	.class_input_width {
		width: 14rem
	}
</style>