<template>
  <v-app>
    <v-main class="auth-background">
      <v-row no-gutters class="h-100">
        <!-- Left branding column -->
        <v-col cols="12" md="5" class="auth-branding d-none d-md-flex flex-column align-center justify-center">
          <v-icon size="64" color="white" class="mb-4">mdi-wallet-outline</v-icon>
          <h1 class="text-h3 font-weight-bold text-white">ExpenseTracker</h1>
          <p class="text-body-1 text-white mt-2" style="opacity: 0.8">
            Gestão financeira simples e eficiente
          </p>
        </v-col>

        <!-- Right form column -->
        <v-col cols="12" md="7" class="d-flex align-center justify-center pa-6">
          <div style="width: 100%; max-width: 420px;">
            <slot />
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
