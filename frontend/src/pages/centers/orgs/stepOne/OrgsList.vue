<template>
  <div class="row">
    <div
      class="col-xs-12 col-md-3 q-pa-xs"
      v-for="(item, i) in props.list"
      :key="i"
    >
      <q-card flat bordered>
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{ item.name }}</div>
              <div>{{ item.size }}</div>
              <div class="text-subtitle2 text-grey-7 q-mt-sm q-mb-xs">
                <q-icon name="person" />
                {{ item.login_first_name + " " + item.login_last_name }}
              </div>
              <div class="text-subtitle2 text-grey-7">
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
                        حذف سازمان
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section> {{ item.province }} - {{ item.city }} </q-card-section>

        <q-separator />

        <q-card-actions class="row justify-between">
          <q-btn flat label="ویرایش" color="accent" />

          <div>
            <q-btn
              outline
              :color="orgStatus[item.status].color"
              :label="orgStatus[item.status].label"
            />
          </div>
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
</template>

<script setup>
import { orgStatus } from "src/stores/states";

const props = defineProps(["list"]);
const emits = defineEmits(["on-new-org"]);
</script>

<style lang="sass" scoped></style>
