<template>
  <v-app>
    <v-app-bar
  app
  color="black"
  dark
  density="comfortable"
  flat
  absolute
>
  <v-container>
    <v-toolbar-title class="text-grey">Yet Another Forex</v-toolbar-title>
  </v-container>
</v-app-bar>


    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.text-grey {
  color: #ccc;
}
</style>
