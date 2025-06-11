<script setup>


</script>

<template>
  <h2>مشخصات فردی</h2>
  <a-form
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 14 }"

  >
    <a-row gutter="[16, 0]">
      <!-- Right column -->
      <a-col :xs="24" :md="12">
        <a-form-item label="نام" name="firstName" :rules="[ { required: true } ]">
          <a-input  />
        </a-form-item>

        <a-form-item label="نام پدر" name="fatherName" :rules="[ { required: true } ]">
          <a-input/>
        </a-form-item>

        <a-form-item label="سریال شناسنامه" name="idSerial" :rules="[ { required: true } ]">
          <a-input />
        </a-form-item>

        <a-form-item label="تاریخ تولد" name="birthDate" :rules="[ { required: true } ]">
          <a-date-picker
              style="width: 100%;"
              placeholder="انتخاب تاریخ"
          />
        </a-form-item>

        <a-form-item label="جنسیت" name="gender" :rules="[ { required: true } ]">
          <a-select  placeholder="انتخاب کنید">
            <a-select-option value="male">مرد</a-select-option>
            <a-select-option value="female">زن</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>

      <!-- Left column -->
      <a-col :xs="24" :md="12">
        <a-form-item label="نام خانوادگی" name="lastName" :rules="[ { required: true } ]">
          <a-input />
        </a-form-item>

        <a-form-item label="شماره ملی" name="nationalId" :rules="[ { required: true } ]">
          <a-input />
        </a-form-item>

        <a-form-item label="شماره شناسنامه" name="shenasnamehNo" :rules="[ { required: true } ]">
          <a-input />
        </a-form-item>

        <a-form-item label="محل تولد" name="birthPlace" :rules="[ { required: true } ]">
          <a-input  />
        </a-form-item>
      </a-col>
    </a-row>

    <h2>مشخصات تماس</h2>
    <a-row gutter="[16, 0]">
      <a-col :xs="24" :md="12">
        <a-form-item label="ایمیل" name="email" :rules="[ { type: 'email', message: 'ایمیل نامعتبر!' } ]">
          <a-input  />
        </a-form-item>

        <a-form-item label="شماره موبایل" name="mobile" :rules="[ { required: true } ]">
          <a-input />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-form-item label="تلفن ثابت" name="phone">
          <a-input  />
        </a-form-item>

        <a-form-item label="کد پستی" name="postalCode">
          <a-input />
        </a-form-item>

        <a-form-item label="آدرس منزل" name="address">
          <a-input  />
        </a-form-item>
      </a-col>
    </a-row>

    <h2>عنوان شغلی</h2>
    <a-form-item label="نام سازمان" name="company">
      <a-input x />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 6, span: 14 }">
      <a-button type="primary" html-type="submit">
        ارسال
      </a-button>
    </a-form-item>
  </a-form>
</template>

<style>
body {
  margin: 0;
  padding: 24px;
  font-family: Tahoma, sans-serif;
  background: #f5f7fa;
  direction: rtl;
}
#app {
  max-width: 800px;
  margin: auto;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
h2 {
  margin-top: 32px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 4px;
  color: #333;
}
</style>