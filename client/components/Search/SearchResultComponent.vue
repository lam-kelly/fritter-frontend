<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article>
      <header>
        <div>
          @{{ user.username }}
          <button v-if="userInFollowees(user)"
            @click="submitUnfollow"
          >
            🚫 Unfollow
          </button>
          <button v-else
            @click="submitFollow"
          >
            ✅ Follow
          </button>
        </div>
      </header>
      <section class="alerts">
        <article
          v-for="(status, alert, index) in alerts"
          :key="index"
          :class="status"
        >
          <p>{{ alert }}</p>
        </article>
      </section>
    </article>
  </template>
  
  <script>
  export default {
    name: 'SearchResultComponent',
    props: {
      user: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        alerts: {} // Displays success/error messages encountered during freet modification
      };
    },
    methods: {
      submitUnfollow() {
        /**
         * Allows the logged in user to unfollow the specified user
         */
        const params = {
          method: 'DELETE',
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully unfollowed this user!', status: 'success'
            });
          }
        };
        this.request(params);
      },
      submitFollow() {
        /**
         * Allows the logged in user to follow the specified user
         */
        const params = {
          method: 'POST',
          body: JSON.stringify({'followee': this.user.username}),
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully followed this user!', status: 'success'
            });
          }
        };
        this.request(params);
      },
      async request(params) {
        /**
         * Submits a request to the followers endpoint
         * @param params - Options for the request
         * @param params.body - Body for the request, if it exists
         * @param params.callback - Function to run if the the request succeeds
         */
        const options = {
          method: params.method, headers: {'Content-Type': 'application/json'}
        };
        if (params.body) {
          options.body = params.body;
        }
  
        try {
          const r = (params.method === 'DELETE') ? await fetch(`/api/follows/${this.user.username}`, options) : await fetch(`/api/follows`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }

          this.$store.commit('setFollowees');
  
          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
      userInFollowees(user) {
        for (var i=0; i<this.$store.state.followees.length; i++) {
          // console.log("in loop")
          // console.log(this.$store.state.followees[i].followee)
            if (user.username === this.$store.state.followees[i].followee) {
                // console.log(this.$store.state.followees[i])
                return true;
            }
        }
        console.log("false")
        return false;
      }
    }
  };
  </script>
  
  <style scoped>
  .freet {
      border: 1px solid #111;
      padding: 20px;
      position: relative;
  }
  </style>
