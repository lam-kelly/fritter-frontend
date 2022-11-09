<template>
    <main>
      <section>
        <header>
          <h2>Word Masks for @{{ $store.state.username }}</h2>
        </header>
        <section v-if="$store.state.wordMasks.length">
          <WordMaskComponent
            v-for="wordMask in $store.state.wordMasks"
            :key="wordMask.id"
            :wordMask="wordMask"
          />
        </section>
        <section v-else>
          <h3>You currently have no word masks</h3>
        </section>
      </section>
      <section>
        <CreateWordMask />
      </section>
    </main>
  </template>

  <script>
  import WordMaskComponent from '@/components/WordMask/WordMaskComponent.vue';
  import CreateWordMask from '@/components/WordMask/CreateWordMask.vue';

  export default {
    name: 'WordMaskPage',
    components: {WordMaskComponent, CreateWordMask},
    mounted() {
      // get all the followers of a user
      
      console.log(this.$store.state.wordMasks)
      this.$store.commit('refreshWordMasks');
    }
  };
  </script>