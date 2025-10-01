<script>
  import { onMount } from 'svelte';
  
  // Счетчик для демонстрации сохранения состояния
  let counter = 0;
  
  // Сообщение для редактирования
  let message = 'Привет, это демонстрация горячей перезагрузки!';
  
  // Функция для увеличения счетчика
  function incrementCounter() {
    counter++;
  }
  
  // Функция для сброса счетчика
  function resetCounter() {
    counter = 0;
  }
  
  // Логируем монтирование компонента
  onMount(() => {
    console.log('HotReloadDemo component mounted');
  });
</script>

<div class="hot-reload-demo">
  <h2>Демонстрация горячей перезагрузки</h2>
  
  <div class="counter-section">
    <p>Счетчик (сохраняется при горячей перезагрузке): {counter}</p>
    <button on:click={incrementCounter}>Увеличить</button>
    <button on:click={resetCounter}>Сбросить</button>
  </div>
  
  <div class="message-section">
    <p>Редактируемое сообщение:</p>
    <input type="text" bind:value={message} placeholder="Отредактируй меня!" />
    <p class="message-display">{message}</p>
  </div>
  
  <div class="instructions">
    <h3>Инструкции:</h3>
    <ol>
      <li>Запустите сервер разработки: <code>npm run dev</code></li>
      <li>Откройте этот компонент в браузере</li>
      <li>Измените текст в этом файле (.svelte)</li>
      <li>Измените стили в соответствующем CSS файле</li>
      <li>Обратите внимание, что изменения отображаются мгновенно</li>
      <li>Счетчик сохраняет свое значение при горячей перезагрузке</li>
    </ol>
  </div>
</div>

<style>
  .hot-reload-demo {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 0.125rem solid rgba(255, 255, 255, 0.25);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 
      0 0.75rem 3rem rgba(0, 0, 0, 0.3),
      inset 0 0 2rem rgba(255, 255, 255, 0.2),
      inset 0 -0.25rem 0.5rem rgba(255, 255, 255, 0.15),
      inset 0 0.25rem 0.5rem rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 15;
    overflow: hidden;
    margin: 1rem 0;
  }
  
  .counter-section, .message-section {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
  }
  
  button {
    background: rgba(65, 182, 230, 0.2);
    backdrop-filter: blur(0.3125rem);
    -webkit-backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(65, 182, 230, 0.5);
    border-radius: 0.5rem;
    color: white;
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  button:hover {
    background: rgba(65, 182, 230, 0.3);
    transform: translateY(-0.125rem);
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    margin: 0.5rem 0;
    border-radius: 0.5rem;
    border: 0.0625rem solid rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.2);
    color: white;
  }
  
  .message-display {
    font-style: italic;
    color: #41B6E6;
    margin-top: 0.5rem;
  }
  
  code {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: monospace;
  }
  
  ol {
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.5rem 0;
  }
</style>