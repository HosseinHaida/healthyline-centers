<template>
  <div class="container">
    <div
      class="row items-center q-py-sm q-mb-lg justify-between"
      style="border-bottom: 1px solid #f2f2f2; border-top: 1px solid #f2f2f2"
    >
      <div class="flex q-gutter-sm items-center">
        <q-btn
          flat
          dense
          label="فیلتر"
          icon="filter_alt"
          class="q-px-sm q-py-none q-mr-md"
        />
      </div>

      <div>
        تعداد مراکز ثبت شده
        <q-chip dense square>
          {{ e2p(props.list.length) }}
        </q-chip>
      </div>
    </div>

    <div class="row q-gutter-sm">
      <div
        class="col-xs-12 col-md-3 q-pa-xs"
        v-for="(item, i) in props.list"
        :key="i"
      >
        <q-card flat bordered>
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">{{ item.registration_name }}</div>
                <div class="text-subtitle2 text-grey-6 q-mt-sm">
                  <q-icon name="person" />
                  {{ item.login_first_name + " " + item.login_last_name }}
                </div>
                <div class="text-subtitle2 text-grey-6">
                  <q-icon name="phone" />
                  {{ item.login_phone }}
                </div>
              </div>

              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item clickable>
                        <q-item-section class="text-negative">
                          حذف مرکز
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            {{ item.province }} - {{ item.city }}
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat label="ویرایش" color="accent" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-xs-12 col-md-3 q-pa-xs" style="min-height: 100%">
        <q-card
          flat
          bordered
          class="full-height row items-center justify-center cursor-pointer add-new-entity-card-btn"
          @click="emits('on-new-org')"
        >
          <q-icon name="add" color="grey" size="xl" flat />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { e2p } from "src/stores/helpers";
const props = defineProps(["list"]);
const emits = defineEmits(["on-new-org"]);
</script>

<style lang="scss" scoped></style>
