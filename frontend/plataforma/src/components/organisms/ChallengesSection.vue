<script setup lang="ts">
import ChallengesList from '../molecules/ChallengesList.vue'
</script>

<template>
  <section class="challenges">
    <div class="challenges-content">
      <h1 class="challenges-title">
        Superando desafíos, creando <span>momentos inolvidables</span>
      </h1>
      <ChallengesList />
    </div>

    <img src="../../assets/challenges-section2.png" class="mockup" />
  </section>
</template>

<style scoped>
.challenges { 
  position: relative;
  padding: 5rem 8%; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5rem;
}

.challenges-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.challenges-title {
  font-family: var(--heading);
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--text-h);
  line-height: 1.1;
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.challenges-title span {
  color: var(--primary);
}

/* Decorative background element */
.challenges::before {
  content: '';
  position: absolute;
  top: -80px;
  left: -80px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 154, 60, 0.1) 0%, transparent 70%); /* Uses --accent */
  pointer-events: none;
  z-index: 0;
}

.challenges::after {
  content: '';
  position: absolute;
  bottom: -60px;
  right: -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(175, 52, 57, 0.08) 0%, transparent 70%); /* Uses --primary */
  pointer-events: none;
  z-index: 0;
}

.challenges > * { /* Ensure content is above pseudo-elements */
  position: relative;
  z-index: 1;
}

.mockup {
  width: 500px;
  max-width: 100%;
  height: auto;
  flex-shrink: 0; /* Prevent mockup from shrinking too much */
}

@media (max-width: 900px) {
  .challenges {
    flex-direction: column;
    gap: 3rem; /* Adjusted gap for mobile */
    padding: 4rem 5%; /* Adjusted padding for mobile */
    border-radius: 30px; /* Smaller border-radius for mobile */
  }

  .challenges-content {
    text-align: center;
    align-items: center;
  }

  .mockup {
    width: 100%;
    max-width: 400px;
    order: -1; /* La imagen aparece arriba en móviles */
  }
}

@media (max-width: 600px) {
  .challenges {
    padding: 3rem 1rem; /* Even smaller padding for very small screens */
    gap: 2rem;
    border-radius: 20px;
  }
}
</style>