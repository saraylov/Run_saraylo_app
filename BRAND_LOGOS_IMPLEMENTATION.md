# Brand Logos Implementation for Device Names

## Overview
This implementation replaces brand names in device names with their corresponding logos on the Bluetooth Devices page.

## Implementation Details

### 1. Brand Logo Files
Brand logos are stored in the `public/brand-logos/` directory as SVG files:
- samsung.svg
- xiaomi.svg
- apple.svg
- fitbit.svg
- garmin.svg

### 2. Supported Brands
The following brands are currently supported:
- Samsung
- Xiaomi
- Apple
- Fitbit
- Garmin

### 3. How It Works
1. The device name is parsed using regular expressions to extract the brand name
2. If the brand is supported, the brand logo is displayed instead of the brand name
3. The model name (remaining part) is displayed as usual

### 4. Code Implementation
The implementation is in `src/components/BluetoothDevices.svelte`:

#### Functions Added:
- `getBrandName(deviceName)` - Extracts brand name from device name using regex patterns
- `getBrandLogo(brandName)` - Returns path to brand logo
- `getModelName(deviceName)` - Returns model name without brand using regex replacement

#### UI Changes:
- Added `.brand-logo` CSS class for styling brand logos
- Modified device name display to show logo + model name
- Added proper styling for brand logos to ensure they display correctly

### 5. Adding New Brands
To add support for a new brand:

1. Create a new SVG logo in `public/brand-logos/` with the brand name in lowercase (e.g., `newbrand.svg`)
2. Update both `getBrandName` and `getModelName` functions to include the new brand in their respective arrays
3. Update the `getBrandLogo` function to include the new brand in the brandLogos object

### 6. Example
Before: "Samsung Galaxy Watch 4"
After: [Samsung Logo] Galaxy Watch 4

## Future Improvements
1. Replace placeholder SVGs with actual brand logos
2. Add support for more brands
3. Implement better brand detection for complex brand names
4. Add loading states for brand logos
5. Implement fallback for when brand logos fail to load

## Styling Notes
The brand logos are styled with the following CSS properties:
- `height: 1.2em` to match the text size
- `width: auto` to maintain aspect ratio
- `vertical-align: middle` to align with text
- `margin-right: 0.5em` to provide spacing between logo and model name
- `border-radius: 4px` for a subtle rounded corner effect