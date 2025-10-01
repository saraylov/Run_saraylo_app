/**
 * Authentication Service for handling user sessions and authentication state
 */

class AuthService {
  constructor() {
    this.STORAGE_KEY = 'auth_data';
    this.TOKEN_EXPIRY_HOURS = 24; // Token valid for 24 hours
  }

  /**
   * Save authentication data to localStorage
   * @param {Object} userData - User data from Telegram
   */
  saveAuthData(userData) {
    try {
      const authData = {
        user: userData,
        timestamp: Date.now(),
        expiry: Date.now() + (this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)
      };
      
      // Encrypt the data before storing (basic obfuscation)
      const encryptedData = btoa(JSON.stringify(authData));
      localStorage.setItem(this.STORAGE_KEY, encryptedData);
      return true;
    } catch (error) {
      console.error('Failed to save auth data:', error);
      return false;
    }
  }

  /**
   * Get authentication data from localStorage
   * @returns {Object|null} Auth data if valid, null otherwise
   */
  getAuthData() {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (!storedData) return null;

      // Decrypt the data
      const decryptedData = JSON.parse(atob(storedData));
      
      // Check if data is expired
      if (Date.now() > decryptedData.expiry) {
        this.clearAuthData();
        return null;
      }
      
      return decryptedData;
    } catch (error) {
      console.error('Failed to get auth data:', error);
      this.clearAuthData();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated and session is valid
   */
  isAuthenticated() {
    const authData = this.getAuthData();
    return !!authData && !!authData.user;
  }

  /**
   * Clear authentication data from localStorage
   */
  clearAuthData() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  /**
   * Logout user and clear all auth data
   */
  logout() {
    this.clearAuthData();
  }

  /**
   * Validate Telegram user data
   * @param {Object} userData - User data from Telegram
   * @returns {boolean} True if user data is valid
   */
  validateUserData(userData) {
    // Basic validation - check if required fields exist
    if (!userData) return false;
    if (!userData.id) return false;
    if (!userData.first_name) return false;
    if (!userData.auth_date) return false;
    if (!userData.hash) return false;
    
    // Check if auth_date is recent (within 1 hour)
    const authTime = new Date(userData.auth_date * 1000);
    const now = new Date();
    const timeDiff = Math.abs(now - authTime);
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff <= 1;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;