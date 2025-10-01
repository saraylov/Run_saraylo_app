<script>
  import ActivityRings from './ActivityRings.svelte';
</script>

<div class="demo-container">
  <h1>Демонстрация компонента активности</h1>
  <p>Компонент из трех концентрических полуколец с углом охвата 270 градусов</p>
  
  <div class="rings-demo">
    <ActivityRings size={250} strokeWidth={20} />
  </div>
</div>

<style>
  .demo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    gap: 1rem;
  }
  
  .rings-demo {
    margin: 2rem 0;
  }
  
  h1 {
    color: white;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    max-width: 600px;
    text-align: center;
  }
</style>