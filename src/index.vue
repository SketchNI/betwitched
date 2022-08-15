<template>
    <form id="streamer_data" @submit.prevent="saveChanges">
        <label for="streamer" class="flex items-center space-x-2 text-zinc-100">
            <span>Edit Block List</span>
            <span class="text-zinc-400">(One name per line)</span>
        </label>
        <textarea name="streamer" id="streamer" v-model="form.streamers"></textarea>

        <button type="submit" id="save">Save</button>
    </form>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "index",

  data() {
    return {
      form: {
        streamers: []
      }
    }
  },

  created() {
    this.getStreamers();
  },

  methods: {
    saveChanges() {
        let data = this.form.streamer.trim().split("\n");
        let json = JSON.stringify({"streamers": data.filter(item => { return item; })});
        chrome.storage.sync.set({
          streamers: json
        })
    },

    getStreamers() {
      chrome.storage.sync.get("streamers", function (streamers) {
        let s = JSON.parse(streamers.streamers).streamers
        if (s.length > 0) {
          let twitchers = s;
          for (let i = 0; i < twitchers.length; i++) {
            this.form.streamers.append(twitchers[i] + "\n");
          }
        }
      });
    }
  }
});
</script>

<style scoped>
#streamer {
    @apply border border-zinc-700 bg-zinc-900 p-4 rounded-md h-72 w-96 block text-white mt-3;
    @apply transition duration-150 ease-in;
    @apply focus:outline-none focus:bg-zinc-800;
}
</style>
