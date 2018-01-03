<template>
  <el-dialog :title="title" :visible="showMainDialog" :beforeClose="handleClose">
    <el-form :model="mainDialogData" :rules="rules" :ref="formName" label-width="100px">
      <el-form-item label="活动名称" prop="name">
        <el-input 
          :value="mainDialogData.name"
          @input="handleUpdateMainDialogData('name', $event)"
        ></el-input>
      </el-form-item>

      <el-form-item label="活动区域" prop="region">
        <el-select 
          :value="mainDialogData.region" 
          @input="handleUpdateMainDialogData('region', $event)"
          placeholder="请选择活动区域"
        >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker 
              type="date" 
              placeholder="选择日期" 
              :value="mainDialogData.date1" 
              @input="handleUpdateMainDialogData('date1', $event)"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker 
              type="fixed-time" 
              placeholder="选择时间" 
              :value="mainDialogData.date2" 
              @input="handleUpdateMainDialogData('date2', $event)"
              style="width: 100%;"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="即时配送" prop="delivery">
        <el-switch 
          on-text="" 
          off-text="" 
          :value="mainDialogData.delivery"
          @input="handleUpdateMainDialogData('delivery', $event)"
        ></el-switch>
      </el-form-item>

      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group 
          :value="mainDialogData.type"
          @input="handleUpdateMainDialogData('type', $event)"
        >
          <el-checkbox label="1" name="type">美食/餐厅线上活动</el-checkbox>
          <el-checkbox label="2" name="type">地推活动</el-checkbox>
          <el-checkbox label="3" name="type">线下主题活动</el-checkbox>
          <el-checkbox label="4" name="type">单纯品牌曝光</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group 
          :value="mainDialogData.resource"
          @input="handleUpdateMainDialogData('resource', $event)"
        >
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="活动形式" prop="desc">
        <el-input 
          type="textarea" 
          :value="mainDialogData.desc"
          @input="handleUpdateMainDialogData('desc', $event)"
        ></el-input>
      </el-form-item>
      
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex';
  import { NAMESPACE, UPDATE_MAIN_DIALOG_DATA } from '../../store/modules/{{pageNameLower}}';

  export default {
    name: 'MainDialog',
    data() {
      return {
        formName: 'mainDialog',
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' },
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' },
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' },
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
          ],
        },
      };
    },
    computed: {
      ...mapState({
        showMainDialog: state => state[NAMESPACE].showMainDialog,
        mainDialogData: state => state[NAMESPACE].mainDialogData,
      }),
      title() {
        return this.mainDialogData && this.mainDialogData.id ? '编辑账号信息' : '创建账号';
      },
    },
    methods: {
      ...mapActions(NAMESPACE, [
        'search',
        'openMainDialog',
        'closeMainDialog',
        'createMain',
      ]),
      ...mapMutations(NAMESPACE, {
        updateMainDialogData: UPDATE_MAIN_DIALOG_DATA,
      }),
      handleClose() {
        this.closeMainDialog();
        const form = this.$refs[this.formName];
        if (form) {
          form.clearValidate();
        }
      },
      handleUpdateMainDialogData(key, value) {
        this.updateMainDialogData({
          ...this.mainDialogData,
          [key]: value,
        });
      },
      handleSubmit() {
        const form = this.$refs[this.formName];
        form.validate().then((valid) => {
          if (valid) {
            this.createMain(this.mainDialogData).then((data) => {
              if (data) {
                this.handleClose();
                this.search();
              }
            });
          }
        });
      },
    },
  };
</script>
