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
      embedVideoUrl: "",
      error: "",
      type: null,
    };
  },
  methods: {
    loadVideo() {
      const url = this.videoUrl.trim();
      this.error = "";
      this.currentVideoId = null;
      this.type = this.extractVideoType(url);
      this.setVideoIdAndEmbedUrl(url, this.type);

      if (!this.currentVideoId) {
        this.error = "Could not extract video ID from the URL.";
      }
    },

    setVideoIdAndEmbedUrl(url: string, type: VideoType) {
      this.currentVideoId = this.extractVideoId(url, type);

      switch (type) {
        case VideoType.YOUTUBE:
          this.embedVideoUrl = `https://www.youtube.com/embed/${this.currentVideoId}`;
          break;
        case VideoType.VIMEO:
          this.embedVideoUrl = `https://player.vimeo.com/video/${this.currentVideoId}`;
          break;
        case VideoType.VIDYARD:
          this.embedVideoUrl = `https://play.vidyard.com/${this.currentVideoId}`;
          break;
        case VideoType.LOOM:
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
    extractVideoId(url: string, type: VideoType) {
      const youtubeRegex =
          /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        vimeoRegex =
          /vimeo\.com\/(?:channels\/\w+\/|groups\/\w+\/videos\/|video\/|)(\d+)/,
        vidyardRegex = /play\.vidyard\.com\/([a-zA-Z0-9_-]+)/,
        loomRegex = /loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/;
      switch (type) {
        case VideoType.YOUTUBE:
          return url.match(youtubeRegex)[1] ?? null;
        case VideoType.VIMEO:
          return url.match(vimeoRegex)[1] ?? null;
        case VideoType.VIDYARD:
          return url.match(vidyardRegex)[1] ?? null;
        case VideoType.LOOM:
          return url.match(loomRegex)[1] ?? null;
      }
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
