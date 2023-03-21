<!--
* @description  数值分布-设定数值区间
* @fileName  setting
* @author 张忠迪
* @date 2023-03-17 16:44:16
!-->

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.field-desc{
  flex: 0 0 none;
}
.field-description {
  flex: 1 1 auto;
}
.footer {
  text-align: center;
}
</style>

<template>
  <template v-if="route.name === 'RangeSetting'">
    <div class="field-header">
      <span class="caption">{{ data.caption }}</span>
      <span class="title">{{ data.title }}</span>
    </div>
    <div class="field-list">
      <div class="box-field" v-for="(v, k) in data.picked" :key="k">
        <span class="field-desc">{{
          v.name
        }}</span>
        <span class="field-desc">{{ v.desc }}</span>
        <span class="field-range">
          <span v-if="form.rangeMode === '1'">范围:{{ form.rangeFrom }} ~ {{ form.rangeTo }} [步长: {{ form.rangeStep }}]</span>
          <span v-else>离散</span>
        </span>
        <Button type="primary" class="field-action" @click="onSetting">设定</Button>
      </div>
    </div>
    <div class="footer">
      <Button type="primary" @click="prev">上一步</Button>
      <Button type="primary" @click="next"
        >下一步</Button
      >
    </div>
    <el-dialog v-model="dialogFormVisible" align-center width="400px" :show-close="false">
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <span :id="titleId" :class="titleClass">设定区间-{{ data.picked[0].name }}</span>
        </div>
      </template>
      <el-form ref="settingForm" :model="form">
        <el-form-item label="模式选择" :label-width="formLabelWidth" prop="rangeMode">
          <el-radio-group v-model="form.rangeMode">
            <el-radio label="0">离散值</el-radio>-
            <el-radio label="1">连续值</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.rangeMode === '1'" label="起始" :label-width="formLabelWidth" prop="rangeFrom">
          <el-input type="number" v-model.number="form.rangeFrom" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.rangeMode === '1'" label="步长" :label-width="formLabelWidth" prop="rangeStep">
          <el-input type="number" v-model.number="form.rangeStep" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="form.rangeMode === '1'" label="中止" :label-width="formLabelWidth" prop="rangeTo">
          <el-input type="number" v-model.number="form.rangeTo" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <Button @click="cancel">取消</Button>
          <Button type="primary" @click="dialogFormVisible = false">
            确定
          </Button>
        </span>
      </template>
    </el-dialog>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from "vue" 
import { useRoute, useRouter } from "vue-router";
import { useParamsStore } from '@/store/params.store'
import { getFields, startTask } from '../service'
import { DateTime } from "luxon";
import type { FormInstance, FormRules } from 'element-plus'

const route = useRoute()
const tm = DateTime.local().toFormat("MMddHHmm");

const store = useParamsStore()
const data = reactive({
  caption: '设定数值区间',
  title: `数值分布#${tm}`,
  picked: [],
  id: ''
})
if(store.picked && store.picked.length) {
  data.picked = store.picked
  localStorage.setItem('picked', JSON.stringify(store.picked))
} else {
  data.picked = JSON.parse(localStorage.getItem('picked'))
}

const router = useRouter()

const prev = () => {
  router.go(-1);
};

const next = () => {
  const store = useParamsStore()
  if(form.rangeMode === '1') {
    store.setting = {
      mode: form.rangeMode,
      from: form.rangeFrom,
      step: form.rangeStep,
      to: form.rangeTo
    }
  } else {
    store.setting = {
      mode: '0'
    }
  }
  localStorage.setItem('setting', JSON.stringify(store.setting))
  router.push({
    name: 'GobalArgument'
  })
}

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
  rangeMode: '1',
  rangeFrom: 0,
  rangeStep: 10,
  rangeTo: 100
})

const onSetting = () => {
  dialogFormVisible.value = true
}

// 弹框
const settingForm = ref<FormInstance>()
const cancel = () => {
  settingForm.value.clearValidate()
  settingForm.value.resetFields()
  dialogFormVisible.value = false
}

</script>
