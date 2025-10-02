<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';

  // Mock data for connected Bluetooth devices
  let devices = [
    {
      id: 1,
      name: "Samsung Galaxy Watch 4",
      type: "smartwatch",
      connected: true,
      battery: 85,
      lastConnected: "2023-06-15T14:30:00",
      icon: "/icons/smartwatch.png"
    },
    {
      id: 2,
      name: "Xiaomi Mi Band 7",
      type: "fitness_tracker",
      connected: true,
      battery: 60,
      lastConnected: "2023-06-15T12:15:00",
      icon: "/icons/fitness-band.png"
    },
    {
      id: 3,
      name: "Apple Watch Series 8",
      type: "smartwatch",
      connected: false,
      battery: 0,
      lastConnected: "2023-06-10T09:45:00",
      icon: "/icons/smartwatch.png"
    },
    {
      id: 4,
      name: "Fitbit Versa 3",
      type: "fitness_tracker",
      connected: true,
      battery: 45,
      lastConnected: "2023-06-15T10:20:00",
      icon: "/icons/fitness-band.png"
    }
  ];

  // Function to format date
  function formatLastConnected(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' в ' + date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Function to get device type label
  function getDeviceTypeLabel(type) {
    return type === 'smartwatch' ? 'Смарт-часы' : 'Фитнес-браслет';
  }

  // Function to get battery color based on level
  function getBatteryColor(level) {
    if (level > 70) return '#41B6E6'; // Miami Blue
    if (level > 30) return '#db3eb1'; // Miami Pink
    return '#FF0000'; // Red
  }

  // Function to simulate connecting to a device
  function connectToDevice(deviceId) {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      device.connected = true;
      device.battery = Math.floor(Math.random() * 40) + 60; // Simulate battery level
      device.lastConnected = new Date().toISOString();
    }
  }

  // Function to simulate disconnecting from a device
  function disconnectDevice(deviceId) {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
      device.connected = false;
      device.battery = 0;
    }
  }

  // Function to scan for new devices
  function scanForDevices() {
    // In a real app, this would trigger a Bluetooth scan
    alert('Поиск устройств... (в демонстрационных целях это симуляция)');
    
    // Simulate finding a new device
    setTimeout(() => {
      devices = [
        ...devices,
        {
          id: devices.length + 1,
          name: "Garmin Forerunner 245",
          type: "fitness_tracker",
          connected: false,
          battery: 0,
          lastConnected: null,
          icon: "/icons/fitness-band.png"
        }
      ];
    }, 1500);
  }

  // Function to extract brand name from device name
  function getBrandName(deviceName) {
    const brands = [
      { name: 'Samsung', pattern: /^Samsung\s+/ },
      { name: 'Xiaomi', pattern: /^Xiaomi\s+/ },
      { name: 'Apple', pattern: /^Apple\s+/ },
      { name: 'Fitbit', pattern: /^Fitbit\s+/ },
      { name: 'Garmin', pattern: /^Garmin\s+/ }
    ];
    
    for (const brand of brands) {
      if (brand.pattern.test(deviceName)) {
        return brand.name;
      }
    }
    return null;
  }

  // Function to get brand logo path
  function getBrandLogo(brandName) {
    const brandLogos = {
      'Samsung': '/brand-logos/samsung.svg',
      'Xiaomi': '/brand-logos/xiaomi.svg',
      'Apple': '/brand-logos/apple.svg',
      'Fitbit': '/brand-logos/fitbit.svg',
      'Garmin': '/brand-logos/garmin.svg'
    };
    return brandLogos[brandName] || null;
  }

  // Function to get model name (without brand)
  function getModelName(deviceName) {
    const brand = getBrandName(deviceName);
    if (brand) {
      const brands = [
        { name: 'Samsung', pattern: /^Samsung\s+/ },
        { name: 'Xiaomi', pattern: /^Xiaomi\s+/ },
        { name: 'Apple', pattern: /^Apple\s+/ },
        { name: 'Fitbit', pattern: /^Fitbit\s+/ },
        { name: 'Garmin', pattern: /^Garmin\s+/ }
      ];
      
      const brandPattern = brands.find(b => b.name === brand)?.pattern;
      if (brandPattern) {
        return deviceName.replace(brandPattern, '');
      }
    }
    return deviceName;
  }

  // Props using Svelte 5 runes
  const { onBack, onSettings } = $props();
</script>

<Header title="Устройства" showSettingsButton={true} onSettings={onSettings} />

<div class="devices-container">
  <!-- Connected Devices Section -->
  <div class="glass-panel">
    <h2 class="section-title">Подключенные устройства</h2>
    <div class="devices-list">
      {#each devices.filter(d => d.connected) as device}
        <div class="device-card connected">
          <div class="device-icon">
            <img src={device.icon} alt={getDeviceTypeLabel(device.type)} />
          </div>
          <div class="device-info">
            <h3 class="device-name">
              {#if getBrandName(device.name)}
                <img src={getBrandLogo(getBrandName(device.name))} alt={getBrandName(device.name)} class="brand-logo" />
                {getModelName(device.name)}
              {:else}
                {device.name}
              {/if}
            </h3>
            <p class="device-type">{getDeviceTypeLabel(device.type)}</p>
            <div class="device-status">
              <span class="status-indicator connected"></span>
              <span class="status-text">Подключено</span>
            </div>
            <div class="battery-info">
              <span class="battery-label">Батарея:</span>
              <div class="battery-bar">
                <div 
                  class="battery-level" 
                  style="width: {device.battery}%; background-color: {getBatteryColor(device.battery)};"
                ></div>
              </div>
              <span class="battery-percent">{device.battery}%</span>
            </div>
            <p class="last-connected">Последнее подключение: {formatLastConnected(device.lastConnected)}</p>
          </div>
          <div class="device-actions">
            <button class="action-button disconnect" on:click={() => disconnectDevice(device.id)}>
              Отключить
            </button>
          </div>
        </div>
      {/each}
      
      {#if devices.filter(d => d.connected).length === 0}
        <div class="no-devices">
          <p>Нет подключенных устройств</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Disconnected Devices Section -->
  <div class="glass-panel">
    <h2 class="section-title">Доступные устройства</h2>
    <div class="devices-list">
      {#each devices.filter(d => !d.connected) as device}
        <div class="device-card disconnected">
          <div class="device-icon">
            <img src={device.icon} alt={getDeviceTypeLabel(device.type)} />
          </div>
          <div class="device-info">
            <h3 class="device-name">
              {#if getBrandName(device.name)}
                <img src={getBrandLogo(getBrandName(device.name))} alt={getBrandName(device.name)} class="brand-logo" />
                {getModelName(device.name)}
              {:else}
                {device.name}
              {/if}
            </h3>
            <p class="device-type">{getDeviceTypeLabel(device.type)}</p>
            <div class="device-status">
              <span class="status-indicator disconnected"></span>
              <span class="status-text">Не подключено</span>
            </div>
            {#if device.lastConnected}
              <p class="last-connected">Последнее подключение: {formatLastConnected(device.lastConnected)}</p>
            {/if}
          </div>
          <div class="device-actions">
            <button class="action-button connect" on:click={() => connectToDevice(device.id)}>
              Подключить
            </button>
          </div>
        </div>
      {/each}
      
      {#if devices.filter(d => !d.connected).length === 0}
        <div class="no-devices">
          <p>Нет доступных устройств</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Scan Button -->
  <button class="scan-button" on:click={scanForDevices}>
    Поиск устройств
  </button>
</div>

<style>
  .devices-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    padding: 1.25rem 0;
    margin-top: 80px; /* Space for fixed header */
  }

  /* Glass panel effect - consistent with app styling */
  .glass-panel {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(0.625rem);
    -webkit-backdrop-filter: blur(0.625rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.18);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 
      0 0.5rem 2.5rem rgba(0, 0, 0, 0.25),
      inset 0 0 1.25rem rgba(255, 255, 255, 0.15),
      inset 0 -0.125rem 0.25rem rgba(255, 255, 255, 0.1),
      inset 0 0.125rem 0.25rem rgba(255, 255, 255, 0.15);
    position: relative;
    z-index: 15;
  }

  .section-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.3rem;
    color: white;
    font-weight: 600;
    text-align: center;
  }

  .devices-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .device-card {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    backdrop-filter: blur(0.3125rem);
    border: 0.0625rem solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .device-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .device-icon {
    width: 50px;
    height: 50px;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .device-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .device-info {
    flex: 1;
  }

  .device-name {
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
  }

  .device-type {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .device-status {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }

  .status-indicator.connected {
    background-color: #41B6E6; /* Miami Blue */
  }

  .status-indicator.disconnected {
    background-color: #db3eb1; /* Miami Pink */
  }

  .status-text {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .battery-info {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .battery-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    margin-right: 0.5rem;
  }

  .battery-bar {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-right: 0.5rem;
  }

  .battery-level {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .battery-percent {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
    min-width: 35px;
  }

  .last-connected {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .device-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 100px;
  }

  .action-button.connect {
    background: rgba(65, 182, 230, 0.2);
    color: #41B6E6;
    border: 1px solid rgba(65, 182, 230, 0.5);
  }

  .action-button.connect:hover {
    background: rgba(65, 182, 230, 0.3);
  }

  .action-button.disconnect {
    background: rgba(219, 62, 177, 0.2);
    color: #db3eb1;
    border: 1px solid rgba(219, 62, 177, 0.5);
  }

  .action-button.disconnect:hover {
    background: rgba(219, 62, 177, 0.3);
  }

  .no-devices {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .scan-button {
    background: linear-gradient(135deg, #41B6E6, #db3eb1);
    color: white;
    border: none;
    border-radius: 0.75rem;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.2);
  }

  .scan-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
  }

  .scan-button:active {
    transform: translateY(0);
  }

  /* Responsive design */
  @media (max-width: 48rem) { /* 768px */
    .devices-container {
      padding: 1rem 0;
      gap: 1rem;
    }

    .glass-panel {
      padding: 1.25rem;
    }

    .device-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .device-icon {
      margin-right: 0;
      margin-bottom: 1rem;
    }

    .device-actions {
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
    }

    .action-button {
      flex: 1;
      margin: 0 0.25rem;
    }
  }

  @media (max-width: 30rem) { /* 480px */
    .devices-container {
      padding: 0.75rem 0;
      gap: 0.75rem;
    }

    .section-title {
      font-size: 1.1rem;
    }

    .device-name {
      font-size: 1rem;
    }

    .device-type {
      font-size: 0.8rem;
    }

    .action-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      min-width: 80px;
    }

    .scan-button {
      padding: 0.8rem;
      font-size: 0.9rem;
    }
  }

  .brand-logo {
    height: 1.2em;
    width: auto;
    vertical-align: middle;
    margin-right: 0.5em;
    border-radius: 4px;
  }
</style>