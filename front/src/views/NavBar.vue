<button class="dark-mode-btn" @click="toggleDarkMode">
  <img class="icon" :alt="darkModeStore.isDark ? 'Modo Claro' : 'Modo Escuro'" :src="darkModeIcon" />
</button>
<router-link v-if="isUserLoggedIn" to="/wishlist" class="wishlist-link">
  <img class="icon" alt="Favoritos" :src="darkModeStore.isDark ? favoriteIconWhite : favoriteIcon" />
  <span v-if="favoritesCount > 0" class="favorites-badge">{{ favoritesCount }}</span>
</router-link> 