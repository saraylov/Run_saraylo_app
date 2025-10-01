<script>
  let count = $state(0);
  
  function increment() {
    count++;
  }
</script>

<div>
  <h1>Test Component</h1>
  <p>Count: {count}</p>
  <button on:click={increment}>Increment</button>
</div>

<style>
  div {
    padding: 20px;
    text-align: center;
  }
  
  h1 {
    color: #41B6E6;
  }
  
  button {
    background-color: #db3eb1;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #c2359d;
  }
</style>