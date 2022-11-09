<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
      
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ transformFreet(freet.content) }}
    </p>
    <div>
      <button 
        v-if="isEndorsed()"
        @click="submitUnendorsement"
      >
        Unendorse
      </button>
      <button 
        v-if="!isEndorsed()"
        @click="submitEndorsement"
      >
        Endorse
      </button>
    </div>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
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
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      draft: this.freet.content, // Potentially-new content for this freet
      freetContent: this.freet.content,
      editing: false, // Whether or not this freet is in edit mode
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  mounted() {
    this.transformFreet(this.freet.content)
    // console.log("mounted")
    // console.log(this.$store.state.endorsedFreets)
    // console.log(this.$store.state.endorsedFreets.length)
  },
  methods: {
    isEndorsed() {
      console.log(this.freet._id)
      // console.log("in endorse")
      // console.log(this.$store.getters.endorsedFreetIds)
      // console.log(this.$store.getters.endorsedFreetIds)
      // console.log(this.$store.getters.endorsedFreetIds.includes(this.freet._id))
      return this.$store.getters.endorsedFreetIds.includes(this.freet._id);
      // return this.$store.state.endorsedFreets.filter(freetId => this.freet._id).length ? true : false;
    },
    transformFreet(content) {
      let freetContent = content;
      for (let i=0; i<this.$store.state.wordMasks.length; i++) {
        freetContent = freetContent.replace(new RegExp(this.$store.state.wordMasks[i].censoredWord, 'g'), this.$store.state.wordMasks[i].replacementWord);
      }
      return freetContent;
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        url: `/api/freets/${this.freet._id}`,
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        url: `/api/freets/${this.freet._id}`,
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    submitEndorsement() {
      /**
       * Endorse a freet
       */
      console.log("here")
      console.log(this.freet._id)
      const params = {
        url: `/api/endorse`,
        method: 'POST',
        message: 'Successfully endorsed freet!',
        body: JSON.stringify({freetId: this.freet._id}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    submitUnendorsement() {
      /**
       * Unendorse a freet
       */
      console.log("in unendorse method, " + this.freet._id)
      const params = {
        url: `/api/endorse/${this.freet._id}`,
        method: 'DELETE',
        message: 'Successfully unendorsed freet!',
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(params.url, options);
        if (!r.ok) {
          const res = await r.json();
          console.log("error");
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');
        console.log("refreshing endorsements");
        this.$store.commit('refreshEndorsedFreets');
        console.log("after committing");
        console.log(this.$store.state.endorsedFreets.length)

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
