<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <button 
      v-if="!createWordMask"
      @click="addWordMask"
    >
      Add Word Mask
  </button>
  <form 
    v-else
  >
    <div>
      <h3>Create a Word Mask</h3>
      <article>
        <div
          v-for="field in fields"
          :key="field.id"
        >
          <label :for="field.id">{{ field.label }}:</label>
          <input
            :name="field.id"
            :value="field.value"
            @input="field.value = $event.target.value"
          >
        </div>
      </article>
      <div class="inline">
        <button 
          class="inline"
          @click="submitWordMask"
        >
          Create a Word Mask
        </button>
        <button 
          class="inline"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>
  
<script>
export default {
  name: 'CreateWordMask',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      createWordMask: false,
      url: '/api/word-mask', // Url to submit form to
      method: 'POST', // Form request method
      hasBody: true, // Whether or not form request has a body
      refreshWordMasks: false,
      fields: [
          {id: 'censoredWord', label: 'Word to Censor', value: ''},
          {id: 'replacementWord', label: 'Replacement Word', value: ''}
      ],
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: () => {
        const message = 'Successfully created word mask!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  methods: {
    cancel() {
      this.createWordMask = false;
    },
    addWordMask() {
      this.createWordMask = true;
    },
    async submitWordMask() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshWordMasks')

        this.callback();
        
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      this.createWordMask = false;
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
    font-family: inherit;
    font-size: inherit;
}

.inline {
  width: 50%;
  display: inline;
}
</style>
