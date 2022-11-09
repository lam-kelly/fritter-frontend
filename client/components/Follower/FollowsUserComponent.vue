<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article
    >
      <header>
        <div>
          @{{ followerObj.followee }}
          <button
            @click="submitUnfollow"
          >
            🚫 Unfollow
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
    name: 'FollowsUserComponent',
    props: {
      // Data from the stored followerObj
      followerObj: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        // editing: false, // Whether or not this freet is in edit mode
        // draft: this.freet.content, // Potentially-new content for this freet
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
          const r = await fetch(`/api/follows/${this.followerObj.followee}`, options);
          if (!r.ok) {
            const res = await r.json();
            throw new Error(res.error);
          }

          this.$store.commit('refreshFollowees');
  
          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      }
    }
  };
  </script>
 
