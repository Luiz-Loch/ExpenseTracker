import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './vuetify-global.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'expenseTracker',
      themes: {
        expenseTracker: {
          dark: false,
          colors: {
            primary: '#1e293b',
            secondary: '#64748b',
            accent: '#1e293b',
            background: '#f8f9fc',
            surface: '#ffffff',
            error: '#ef4444',
            info: '#3b82f6',
            success: '#22c55e',
            warning: '#f59e0b',
            'on-primary': '#ffffff',
            'on-secondary': '#ffffff',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        rounded: 'lg',
      },
      VCard: {
        rounded: 'lg',
        variant: 'outlined',
      },
      VNavigationDrawer: {
        elevation: 0,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify)
})
