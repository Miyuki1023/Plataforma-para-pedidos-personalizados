<script setup lang="ts">
import ChallengesList from '../molecules/ChallengesList.vue'
</script>

<template>
  <section class="challenges">
    <ChallengesList />

    <img src="../../assets/challenges-section2.png" class="mockup" />
  </section>
</template>

<style scoped>
.challenges {
  background: #eadccf;
  padding: 100px 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: 120px;
  border-bottom-right-radius: 120px;
}

.mockup {
  width: 500px;
}

@media (max-width: 900px) {
  .challenges {
    flex-direction: column;
    gap: 50px;
  }
}
</style>