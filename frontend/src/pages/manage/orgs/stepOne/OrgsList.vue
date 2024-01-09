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
              <div class="text-subtitle2 text-grey-7 q-mt-sm">
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

        <q-card-section class="q-py-none">
          <q-icon name="handshake" size="sm" color="grey-7" />
          {{ item.registration_name }}
        </q-card-section>
        <q-card-section> {{ item.province }} - {{ item.city }} </q-card-section>

        <q-separator />

        <q-card-actions class="row justify-between">
          <q-btn flat label="نمایش و تأیید" color="accent" />

          <div>
            <q-btn
              v-if="item.status === 'needs_edit'"
              outline
              :color="manageOrgStatus.needs_edit.color"
              :label="manageOrgStatus.needs_edit.label"
            />
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { manageOrgStatus } from "src/stores/states";

const props = defineProps(["list"]);
const emits = defineEmits(["on-new-org"]);
</script>

<style lang="sass" scoped></style>
