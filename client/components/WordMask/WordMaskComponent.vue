<!-- Reusable component representing a single word mask and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article class="word-mask">
      <header>
        <textarea
          v-if="editing"
          class="content"
          :value="censoredWordDraft"
          @input="censoredWordDraft = $event.target.value"
        />
        <textarea
          v-if="editing"
          class="content"
          :value="replacementWordDraft"
          @input="replacementWordDraft = $event.target.value"
        />
        <p
          v-else
          class="content"
        >
          {{wordMask.censoredWord}} -->
          {{wordMask.replacementWord}}
        </p>
        <div class="actions">
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
          <button @click="deleteWordMask">
            🗑️ Delete
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
    name: 'WordMaskComponent',
    props: {
      wordMask: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        editing: false,
        censoredWordDraft: this.wordMask.censoredWord,
        replacementWordDraft: this.wordMask.replacementWord,
        alerts: {} // Displays success/error messages encountered during word mask modification
      };
    },
    methods: {
      startEditing() {
      /**
       * Enables edit mode on this word mask.
       */
      this.editing = true; // Keeps track of if a word mask is being edited
      this.replacementWordDraft = this.wordMask.replacementWord;
      this.censoredWordDraft = this.wordMask.censoredWord;
    },
    stopEditing() {
      /**
       * Disables edit mode on this word mask.
       */
      this.replacementWordDraft = this.wordMask.replacementWord;
      this.censoredWordDraft = this.wordMask.censoredWord;
      this.editing = false;
    },
    deleteWordMask() {
      /**
       * Deletes this word mask.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted word mask!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    addWordMask() {
      /**
       * Add this word mask.
       */
      const params = {
        method: 'POST',
        message: 'Successfully edited word mask!',
        body: JSON.stringify({censoredWord: this.censoredWordDraft, replacementWord: this.replacementWordDraft}),
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted word mask!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates word mask to have the submitted draft content.
       */
      if (this.wordMask.replacementWord === this.replacementWordDraft && this.wordMask.censoredWord === this.censoredWordDraft) {
        const error = 'Error: Edited word mask should be different than current word mask.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PUT',
        message: 'Successfully edited word mask!',
        body: JSON.stringify({censoredWord: this.censoredWordDraft, replacementWord: this.replacementWordDraft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the word mask's endpoint
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
        const r = await fetch(`/api/word-mask/${this.wordMask._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshWordMasks');

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
  .word-mask {
      border: 1px solid #111;
      padding: 20px;
      position: relative;
  }
  </style>
