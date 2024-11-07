<template>
  <div class="video-container">
    <iframe
      :src="`https://play.vidyard.com/${videoId}`"
      title="Vidyard video player"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    videoId: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
}
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
