<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h2>Welcome @{{ $store.state.username }}</h2>
      </header>
      <CreateFreetForm />
    </section>
    <section v-else>
      <header>
        <h2>Welcome to Fritter!</h2>
      </header>
      <article>
        <h3>
          <router-link to="/login">
            Sign in
          </router-link>
          to create, edit, and delete freets.
        </h3>
      </article>
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Additionally filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <button v-if="seeFolloweesFreets"
        @click="switchView"
      >
        Deactivate filter and See All Freets
      </button>
      <button v-else
        @click="switchView"
      >
        Activate filter to See Your Followees' Freets
      </button>
      <section
        v-if="seeFolloweesFreets && $store.getters.followeesFreets.length"
      >
        <FreetComponent
          v-for="freet in $store.getters.followeesFreets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <section
        v-else-if="!seeFolloweesFreets && $store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
    this.$store.commit("refreshEndorsedFreets");
    this.$store.commit("refreshWordMasks")
    // console.log("in freet page")
    // console.log(this.$store.state.endorsedFreets);
  },
  data() {
    return {
      seeFolloweesFreets: false,
    };
  },
  methods: {
    switchView() {
      this.seeFolloweesFreets = !this.seeFolloweesFreets
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
