<!-- Default page that also displays freets -->

<template>
    <main>
      <section>
      <header>
        <div class="left">
          <section v-if="$store.state.username">
            <span>
              <h2>Users that @{{ $store.state.username }} follow</h2>
            </span>
          </section>
          <section v-else>
            <header>
              <h2>Please 
                <router-link to="/login">
                  sign in 
                </router-link>
              to see your followers
              </h2>
            </header>
          </section>
        </div>
        <div class="right">
          <SearchUsersForm
            ref="searchUsersForm"
            value="username"
            placeholder="Find user"
            button="Get users"
          />
        </div>
      </header>  
      </section>
      <section>
      <header v-if="$store.state.username">
        <div>
          <section
            v-if="$store.state.followees.length"
          >
            
            <FollowsUserComponent
              v-for="followee in $store.state.followees"
              :key=followee._id
              :followerObj=followee
            />
          </section>
          <section
            v-else
          >
            <h3>You currently are not following anyone</h3>
          </section>
        </div>
        <div>
          <section v-if="$store.state.searchResults.length">
            <h4>Search Results...</h4>
            <SearchResultComponent
              v-for="user in $store.state.searchResults"
              :key="user.id"
              :user="user"
            />
          </section>
        </div>
      </header>
    </section>
    </main>
  </template>
  
  <script>
  import FollowsUserComponent from '@/components/Follower/FollowsUserComponent.vue';
  import SearchUsersForm from '@/components/Search/SearchUsersForm.vue';
  import SearchResultComponent from '@/components/Search/SearchResultComponent.vue';
  
  export default {
    name: 'ProfilePage',
    components: {FollowsUserComponent, SearchUsersForm, SearchResultComponent},
    mounted() {
      // get all the followers of a user
      this.$store.commit('refreshFollowees');
      this.$store.commit('updateSearchResults', []);
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

.space-between {
  display: flex;
  justify-content: space-between;
}

  </style>
  