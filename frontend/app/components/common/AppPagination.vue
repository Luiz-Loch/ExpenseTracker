<template>
  <div
    v-if="totalItems > 0"
    class="d-flex justify-space-between align-center px-4 py-3"
    style="border-top: 1px solid rgba(0,0,0,0.08)"
  >
    <div class="text-body-2 text-medium-emphasis">
      Mostrando {{ paginationFrom }} a {{ paginationTo }} de {{ totalItems }} resultados
    </div>
    <v-pagination
      v-model="page"
      :length="totalPages"
      :total-visible="5"
      density="comfortable"
      rounded="lg"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  totalItems: number,
  itemsPerPage: number,
}>();

const page = defineModel<number>('currentPage', { required: true });

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage))
);

const paginationFrom = computed(() => {
  if (props.totalItems === 0) {
    return 0;
  }
  return (page.value - 1) * props.itemsPerPage + 1;
});

const paginationTo = computed(() =>
  Math.min(page.value * props.itemsPerPage, props.totalItems)
);
</script>
