<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-grey">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn icon="arrow_back_ios" @click="$router.go(-1)" flat />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
