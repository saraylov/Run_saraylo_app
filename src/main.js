import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

console.log('Main.js executing - mounting full Svelte app');

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app