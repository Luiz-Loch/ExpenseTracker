<template>
  <tr>
    <td>
      <v-chip
        size="small"
        variant="tonal"
        :color="displayColor"
      >
        {{ category.name }}
      </v-chip>
    </td>
    <td>
      <div
        class="d-inline-block rounded-circle"
        :style="{ width: '20px', height: '20px', backgroundColor: displayColor }"
      />
      <span class="ml-2 text-body-2 text-medium-emphasis">{{ category.color ?? 'Sem cor' }}</span>
    </td>
    <td class="text-no-wrap">{{ formatDate(category.createdAt) }}</td>
    <td class="text-center">
      <v-btn icon variant="text" size="small" @click="$emit('edit', category)">
        <v-icon size="20">mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn icon variant="text" size="small" color="error" @click="$emit('delete', category)">
        <v-icon size="20">mdi-trash-can-outline</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CATEGORY_DEFAULT_COLOR, type CategoryResponse } from '~/types/category'

const { formatDate } = useFormatDate();

const props = defineProps<{
  category: CategoryResponse,
}>();

const displayColor = computed<string>(() => props.category.color ?? CATEGORY_DEFAULT_COLOR);

defineEmits<{
  edit: [category: CategoryResponse],
  delete: [category: CategoryResponse],
}>();
</script>
