<template>
   <div class="container">
      <!-- 表格操作 -->
      <div class="header">
         <el-button @click="elShow.mask.add = true">新增</el-button>
      </div>
      <!-- 新增角色 -->
      <div class="mask" v-show="elShow.mask.add" @click.self="elShow.mask.add = false">
         <div class="editRole">
            <el-form v-model="addRole" label-suffix=" :">
               <!-- 姓名 -->
               <el-form-item label="姓名" prop="name">
                  <el-input v-model="addRole.name" />
               </el-form-item>
               <!-- 性别 -->
               <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="addRole.sex">
                     <el-radio value=true>男</el-radio>
                     <el-radio value=false>女</el-radio>
                  </el-radio-group>
               </el-form-item>
               <!-- 替身 -->
               <el-form-item label="替身名" prop="standName">
                  <el-input v-model="addRole.standName" />
               </el-form-item>
               <!-- 替身能力 -->
               <el-form-item label="替身能力" prop="standPower">
                  <el-input v-model="addRole.standPower" />
               </el-form-item>
               <!-- 座右铭 -->
               <el-form-item label="座右铭" prop="motto">
                  <el-input type="text" v-model="addRole.motto" />
               </el-form-item>
            </el-form>
            <el-button @click="insertRole()" :loading="elLoading.addLoading">确 认</el-button>
         </div>
      </div>
      <!-- 角色表 -->
      <el-table :data="roleList" stripe>
         <el-table-column prop="name" label="姓名" align="center" />
         <el-table-column prop="sex" label="性别" width="70" />
         <el-table-column prop="standName" label="替身名" align="center" width="150" />
         <el-table-column prop="standPower" label="替身能力" align="center" width="200" />
         <el-table-column prop="motto" label="座右铭" width="400" align="center" />
         <el-table-column porp="id" label="操作" align="center">
            <template #default="data">
               <el-button type="primary" @click='editBox(data.row)'>编辑</el-button>
               <el-button type="danger" @click='deleteRole(data.row,data.$index)' :loading='elLoading.delete[data.$index]'>删除</el-button>
            </template>
         </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination layout="prev, pager, next" :total="roleCount" :page-size="8" v-model:current-page="currentPage" @current-change="getRole(currentPage)" />
      <!-- 编辑角色 -->
      <div class="mask" v-show="elShow.mask.edit" @click.self="elShow.mask.edit=false">
         <div class="editRole">
            <el-form v-model="editRole" label-suffix=" :">
               <!-- 姓名 -->
               <el-form-item label="姓名" prop="name">
                  <el-input v-model="editRole.name" />
               </el-form-item>
               <!-- 性别 -->
               <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="editRole.sex">
                     <el-radio value='男'>男</el-radio>
                     <el-radio value='女'>女</el-radio>
                  </el-radio-group>
               </el-form-item>
               <!-- 替身 -->
               <el-form-item label="替身名" prop="standName">
                  <el-input v-model="editRole.standName" />
               </el-form-item>
               <!-- 替身能力 -->
               <el-form-item label="替身能力" prop="standPower">
                  <el-input v-model="editRole.standPower" />
               </el-form-item>
               <!-- 座右铭 -->
               <el-form-item label="座右铭" prop="motto">
                  <el-input type="text" v-model="editRole.motto" />
               </el-form-item>
            </el-form>
            <el-button @click="saveRole()" :loading="elLoading.editLoading">保 存</el-button>
         </div>
      </div>
   </div>
</template>


<script setup>
import { reactive, ref, onMounted } from "vue"
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
/* data */
let roleCount = ref()
let currentPage = ref()
const baseURL = '/rotation/api/content'
const addRole = reactive({
   id: -1,
   name: '',
   sex: '',
   standName: '',
   standPower: '',
   motto: ''
})
const editRole = reactive({
   id: -1,
   name: '',
   sex: '',
   standName: '',
   standPower: '',
   motto: '',
   roleIndex: -1
})
const elLoading = reactive({
   delete: [false, false, false, false, false, false, false, false],
   edit: false,
   add: false
})
const elShow = reactive({
   mask: { add: false, edit: false }
})
const roleList = reactive([
   { id: 0, name: '乔尼.乔斯达', sex: '男', standName: '牙', standPower: '追踪爪弹', motto: '就只差一步了！我现在还只是『负数』！我只是想让自己从『负数』变为『零』而已啊', status: 1 },
   { id: 1, name: '杰洛.齐贝林', sex: '男', standName: '铁球破坏者', standPower: '骑兵回旋', motto: '在叫马来之前，要不要干一杯呢？……就为『触网而弹起的网球』干杯,如何?不行吗?那...就敬下一个『遗体』吧...', status: 1 },
   { id: 2, name: '空条承太郎', sex: '男', standName: '白金之星', standPower: '暂停时间', motto: '真是够了（やれやれだぜ）', status: 1 },
   { id: 3, name: '乔瑟夫.乔斯达', sex: '男', standName: '紫色隐者', standPower: '念写', motto: '我最讨厌的两个词就是『努力』和『加油』', status: 1 },
   { id: 4, name: '乔鲁诺.乔巴纳', sex: '男', standName: '黄金体验', standPower: '赋予非生物生命', motto: '所谓觉悟,就是在漆黑的荒野上,开辟出一条理应前进的光明大道', status: 0 },
   { id: 5, name: '布加拉提', sex: '男', standName: '钢链手指', standPower: '在任何物体上开拉链', motto: '你做好觉悟了吗？我早就准备好了', status: 1 },
   { id: 6, name: '迪亚波罗', sex: '男', standName: '绯红之王', standPower: '削减时间,预知未来', motto: '这是一场『试炼』,我认为这是一场让我战胜过去的『试炼』,我接受了,只有在战胜那不成熟的过去后,人才能有所成长...你不也是一样吗?', status: 1 },
   { id: 7, name: '法尼.瓦伦泰', sex: '男', standName: '恶行易施', standPower: '让不同世界同时存在于同一地点', motto: '吾心吾行澄如明镜，所作所为皆属正义', status: 1 },
])


/* method */
async function getRole(pageNo) {
   const response = await axios.get(baseURL + '/getRole', { params: { pageNo } })
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      return
   }
   roleList.splice(0, roleList.length)
   response.data.dataList.roleList.forEach((item) => { item.sex = item.sex == true ? '男' : '女' })
   roleList.push(...response.data.dataList.roleList)
   elLoading.delete.splice(0, elLoading.length)
   for (let i = 0; i < response.data.dataList.roleList.length; i++)
      elLoading.delete.push(false)
   roleCount.value = response.data.dataList.roleCount
}
function deleteRole(role, index) {
   ElMessageBox.confirm('确定删除' + role.name + '吗?', '删除角色',
      {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning',
         customStyle: { width: "550px", height: "135px" },
         confirmButtonClass: 'messageBox_confirm',
         cancelButtonClass: 'messageBox_cancel'
      }).then(async () => {
         elLoading.delete[index] = true
         const response = await axios.post(baseURL + '/deleteRole', {}, { params: { uid: role.id } })
         if (response.data.status != 200) {
            ElMessage.error({ message: response.data.msg })
            elLoading.delete[index] = false
            return
         }
         roleList.splice(index, 1)
         ElMessage.success({ 'message': '删除成功', duration: 1000 })
      }).catch(() => {
         console.log('取消')
      })
}
function editBox(data) {
   elShow.mask.edit = true
   Object.assign(editRole, data)
   editRole.roleIndex = roleList.indexOf(data)
}
async function saveRole() {
   editRole.sex = editRole.sex == '男' ? true : false
   elLoading.edit = true
   const response = await axios.post(baseURL + "/editRole", editRole)
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      elShow.mask.edit = false
      elLoading.edit = false
      return
   }
   Object.assign(roleList[editRole.roleIndex], editRole)
   elShow.mask.edit = false
   elLoading.edit = false
   ElMessage.success({ message: '修改成功', duration: 1000 })
}
async function insertRole() {
   elLoading.add = true
   const response = await axios.post(baseURL + "/addRole", addRole)
   if (response.data.status != 200) {
      ElMessage.error({ message: response.data.msg })
      elShow.mask.add = false
      elLoading.add = false
      return
   }
   elShow.mask.add = elLoading.add = false
   ElMessage.success({ message: '添加成功' })
}


/* 钩子 */
onMounted(() => {
   getRole(1)
})
</script>


<style lang='less' scoped>
@keyframes slide-in-top {
   0% {
      transform: translateY(-1000px);
      opacity: 0;
   }
   100% {
      transform: translateY(0);
      opacity: 1;
   }
}
.messageBox_cancel {
   &:hover {
      color: white;
      background-color: rgba(128, 128, 128, 0.138);
   }
}
.messageBox_confirm {
   background-color: #10a37ecf;
   &:hover {
      background-color: #10a37eea;
   }
}
.editRole {
   width: 32%;
   height: 57%;
   background-color: #fff;
   border-radius: 3%;
   padding-left: 80px;
   padding-top: 60px;
   box-sizing: border-box;
   position: relative;
   animation: slide-in-top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
   .el-input {
      width: 80%;
      --el-input-focus-border-color: #10a37e;
   }
   .el-button:nth-child(2) {
      position: absolute;
      bottom: 15%;
      left: 40%;
      --el-button-bg-color: #10a37ecf;
      --el-button-text-color: white;
      --el-button-hover-bg-color: #33af90d2;
      --el-button-hover-text-color: white;
   }
}
.header {
   height: 6%;
   width: 100%;
   background-color: #e7f0e9;
   .el-button {
      margin-top: 15px;
      margin-left: 30px;
      --el-button-bg-color: #10a37ed8;
      --el-button-text-color: white;
      --el-button-hover-bg-color: #33af90d2;
      --el-button-hover-text-color: white;
   }
}
.el-table {
   width: 95%;
   margin: 0 auto;
   margin-top: 20px;
   border-radius: 8px;
   opacity: 0.8;
   .el-button:nth-child(1) {
      width: 23%;
      height: 100%;
      font-size: 90%;
      --el-button-active-bg-color: #10a37ed8;
      --el-button-bg-color: #10a37ed8;
      --el-button-text-color: white;
      --el-button-hover-bg-color: #33af90d2;
      --el-button-hover-text-color: white;
   }
   .el-button:nth-child(2) {
      width: 23%;
      height: 10%;
      font-size: 90%;
   }
}
.el-pagination {
   --el-pagination-bg-color: #e7f0e9;
   --el-pagination-button-disabled-bg-color: #e7f0e9;
   --el-pagination-hover-color: rgba(0, 128, 0, 0.456);
   width: 220px;
   margin: 0 auto;
   margin-top: 30px;
}
.el-radio {
   --el-radio-input-border-color-hover: #10a37e;
   ::v-deep(.el-radio__input.is-checked + .el-radio__label) {
      color: #10a37e;
   }
   ::v-deep(.el-radio__input.is-checked .el-radio__inner) {
      background-color: #10a37e;
      border-color: #10a37e;
   }
}
.container {
   width: 100%;
   height: 100%;
}
</style>