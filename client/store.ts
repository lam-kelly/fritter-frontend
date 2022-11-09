import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    followees: [],
    searchResults: [],
    searchedUser: null,
    wordMasks: [],
    endorsedFreets: [],
  },
  getters: {
    endorsedFreetIds (state) {
      return state.endorsedFreets.map(endorsedObj => endorsedObj.freet);
    },
    followeesFreets (state) {
      return state.freets.filter(freet => state.followees.map(followee => followee.followee).includes(freet.author))
    }
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateSearchResults(state, users) {
      /**
       * Update the stored search results to the provided users.
       * @param user - users to store
       */
      state.searchResults = users;
    },
    updateSearchedUser(state, username) {
      /**
       * Update the stored username to search for to the provided username.
       * @param username - username to store
       */
      state.searchedUser = username;
    },
    clearFollowees(state) {
      /**
       * Request the server for the currently available freets.
       */
      state.followees = [];
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshFollowees(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.username ? `/api/follows?follower=${state.username}` : '/api/follows';
      const res = await fetch(url).then(async r => r.json());
      state.followees = res;
    },
    async refreshWordMasks(state) {
      /**
       * Request the server for the currently available freets.
       */
      if (state.username) {
        const url = `/api/word-mask`
        const res = await fetch(url).then(async r => r.json());
        state.wordMasks = res;
      }
      else {
        state.wordMasks = [];
      }
    },
    async refreshEndorsedFreets(state) {
      /**
       * Request the server for the freets endorsed by the logged in user.
       */
      if (state.username) {
        const url = `/api/endorse?endorser=${state.username}`
        const res = await fetch(url).then(async r => r.json());
        state.endorsedFreets = res;

      }
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
