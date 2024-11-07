<template>
  <div id="app">
    <div id="native">
      <h1>Video Embed Native Test App</h1>

      <input
        v-model="videoUrl"
        type="text"
        placeholder="Enter YouTube, Vimeo, or Vidyard Video URL"
      />
      <button @click="loadVideo">Load Video</button>

      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="['vimeo', 'youtube'].includes(type)">
        <VideoPlayer
          :videoId="currentVideoId"
          :url="embedVideoUrl"
          ratio="16:9"
        />
      </div>

      <div v-if="['vidyard', 'loom'].includes(type)">
        <iframe
          :src="embedVideoUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import VideoPlayer from "./components/VideoPlayer.vue";

enum VideoType {
  YOUTUBE = "youtube",
  VIMEO = "vimeo",
  VIDYARD = "vidyard",
  LOOM = "loom",
}
export default {
  components: {
    VideoPlayer,
  },
  data() {
    return {
      videoUrl: "",
      currentVideoId: "",
      selectedPlatform: "",
      embedVideoUrl: "",
      error: "",
      type: null,
    };
  },
  methods: {
    loadVideo() {
      const url = this.videoUrl.trim();

      // Reset error and currentVideoId for new input
      this.error = "";
      this.currentVideoId = null;
      this.type = this.extractVideoType(url);
      this.setVideoId(url, this.type);

      if (!this.currentVideoId) {
        this.error = "Could not extract video ID from the URL.";
      }
    },

    setVideoId(url: string, type: VideoType) {
      switch (type) {
        case VideoType.YOUTUBE:
          this.selectedPlatform = "youtube";
          this.currentVideoId = this.extractYouTubeId(url);
          this.embedVideoUrl = `https://www.youtube.com/embed/${this.currentVideoId}`;
          break;
        case VideoType.VIMEO:
          this.selectedPlatform = "vimeo";
          this.currentVideoId = this.extractVimeoId(url);
          this.embedVideoUrl = `https://player.vimeo.com/video/${this.currentVideoId}`;
          break;
        case VideoType.VIDYARD:
          this.selectedPlatform = "vidyard";
          this.currentVideoId = this.extractVidyardId(url);
          this.embedVideoUrl = `https://play.vidyard.com/${this.currentVideoId}`;
          break;
        case VideoType.LOOM:
          this.selectedPlatform = "loom";
          this.currentVideoId = this.extractLoomId(url);
          this.embedVideoUrl = `https://www.loom.com/embed/${this.currentVideoId}`;
          break;
        default:
          this.error =
            "Invalid URL. Please enter a valid YouTube, Vimeo, or Vidyard URL.";
      }
    },
    extractVideoType(url: string) {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        return VideoType.YOUTUBE;
      } else if (url.includes("vimeo")) {
        return VideoType.VIMEO;
      } else if (url.includes("vidyard")) {
        return VideoType.VIDYARD;
      } else if (url.includes("loom")) {
        return VideoType.LOOM;
      }
    },

    extractYouTubeId(url: string) {
      const youtubeRegex =
        /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(youtubeRegex);
      return match ? match[1] : null;
    },
    extractVimeoId(url: string) {
      const vimeoRegex =
        /vimeo\.com\/(?:channels\/\w+\/|groups\/\w+\/videos\/|video\/|)(\d+)/;
      const match = url.match(vimeoRegex);
      return match ? match[1] : null;
    },
    extractVidyardId(url: string) {
      const vidyardRegex = /play\.vidyard\.com\/([a-zA-Z0-9_-]+)/;
      const match = url.match(vidyardRegex);
      return match ? match[1] : null;
    },
    extractLoomId(url) {
      const loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/;
      const match = url.match(loomRegex);
      return match ? match[1] : null;
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 20px;
}
input {
  padding: 8px;
  font-size: 16px;
  margin-right: 8px;
}
button {
  padding: 8px 16px;
  font-size: 16px;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
