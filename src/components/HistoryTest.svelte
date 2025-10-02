<script>
  import HistoryPage from './HistoryPage.svelte';
  
  function handleBack() {
    console.log('Back button clicked');
  }
  
  function handleSettings() {
    console.log('Settings button clicked');
  }
</script>

<div class="test-container">
  <h1>Workout History Test</h1>
  <HistoryPage onBack={handleBack} onSettings={handleSettings} />
</div>

<style>
  .test-container {
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, #000000 0%, #41B6E6 50%, #db3eb1 100%);
  }
  
  h1 {
    text-align: center;
    color: white;
    padding: 1rem;
    margin: 0;
  }
</style>