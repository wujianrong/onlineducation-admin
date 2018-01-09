<template>
	<div>
		<div class="admin_title">
			{{$route.meta.title}}
		</div>
		<data-tables v-loading="loading" :data="data" :pagination-def="paginationDef" :table-props="tableProps" :show-action-bar="false" :custom-filters="customFilters">

			<el-row slot="custom-tool-bar" style="margin-bottom: 10px" class="class_el_row margin-top-sm">

				<el-col :span="2" class="delete_comment">
					<el-button type="primary" @click="$router.push({name: 'addsort'})">新建分类</el-button>
				</el-col>
				<el-col :span="16" :offset="6" class="text-align-right">
					<el-input v-model="customFilters[0].vals" prefix-icon="el-icon-erp-icon-ic_search" placeholder="搜索分类名称" class="class_input_width">
					</el-input>
				</el-col>
			</el-row>
			<el-table-column width="85" prop="index" label="编号" key="index" sortable="custom">
				<template slot-scope="scope">
                    <div>{{scope.$index  + 1}}</div>
             </template>
			</el-table-column>
			<el-table-column prop="name" label="分类名称" key="name" sortable="custom">
				<template slot-scope="scope">
					<p class="blue font_weight">{{scope.row.name}}</p>
				</template>
			</el-table-column>
	<!-- 		<el-table-column prop="founder" label="创建人" key="founder" sortable="custom">
				<template slot-scope="scope">
					<p class="blue">{{scope.row.founder}}</p>
				</template>
			</el-table-column> -->
			<el-table-column prop="created_at" label="创建时间" key="created_at" sortable="custom">
				<template slot-scope="scope">
					<p>{{scope.row.created_at}}</p>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="135">
				<template slot-scope="scope">
					<el-dropdown split-button @click="customButtonsForRowone(scope.row)" @command="customButtonsForRowtwo">
						编辑
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command='{command: "a",scope:scope}'>删除分类</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</data-tables>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				data: [],
				customFilters: [{
					vals: '',
					props: ['name'],
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
				}
			}
		},
		methods: {
			customButtonsForRowone(row) {
				let id = row.id
				this.$router.push({
					name: 'editsort',
					params: {
						id
					}
				})
			},
			previewcolshow() {
				this.$router.push({
					name: 'addsort'
				})
			},
			customButtonsForRowtwo(row) {
				if(row.command == "a") {
					this.$confirm('真的要删除此课程吗？', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.loading = true
						axios.get('/admin/genre/'+ row.scope.row.id + '/delete').then(res => {
							if(res.data.status){
								this.$message.success(res.data.message);
								this.data.splice(row.scope.$index, 1)
							}else {
								this.$message.error(res.data.message);
							}
							this.loading = false

						}).catch(error => {
							this.loading = false
						})
					}).catch(() => {

					})
					
				}
			},
			gettabledata() { //分类管理表格数据
				this.loading = true
				axios.get('/admin/genre/lists').then(res => {
					this.data = res.data
					this.loading = false
				}).catch(error => {
					this.loading = false
				})
			},
			deletecol(id) { //删除分类
				
			}
		},
		mounted: function() {
			this.gettabledata()  
		}
	}
</script>
<style scoped>
.delete_comment{text-align:left}
.demo-table-expand{font-size:0}
.demo-table-expand label{width:90px;color:#99a9bf}
.demo-table-expand .el-form-item{margin-right:0;margin-bottom:0;width:50%}
.class_el_row{margin-bottom:10px;padding:10px;background:#F5F5F5;border-radius:4px}
.el-table td,.el-table th{padding:12px 0 12px 10px}
.class_input_width{width:14rem}
</style>