<template>
  <div
    class="video-player-container"
    :class="{ compact }"
    data-external="video-player-container-element"
  >
    <media-player
      ref="player"
      :src="source"
      playsinline
      :duration="mediaDuration"
      :controls-delay="3000"
      :data-display-controls="controls"
      stream-type="on-demand"
      cross-origin="anonymous"
    >
      <media-poster
        v-if="thumbUrl"
        :src="thumbUrl"
        class="vds-poster"
      ></media-poster>
      <media-provider> </media-provider>
      <media-video-layout color-scheme="light" no-audio-gain>
      </media-video-layout>
    </media-player>
  </div>
</template>

<script lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  defineComponent,
} from "vue";
import "vidstack/player/styles/default/theme.css";
import "vidstack/player/styles/default/layouts/video.css";

import "vidstack/player";
import "vidstack/player/layouts/default";
import "vidstack/player/ui";

import "vidstack/bundle";

export default defineComponent({
  props: {
    url: { type: String, default: null },
    controls: { type: Boolean, default: true },
    autoplay: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    playOnHover: { type: Boolean, default: false },
    ratio: { type: String, default: "16 / 9" },
    thumbUrl: { type: String, default: null },
    compact: { type: Boolean, default: false },
    videoId: { type: String, default: null },
  },
  setup(props) {
    const player = ref<any | null>(null);
    const mediaDuration = ref(0);

    const setPoster = (value: string) => {
      if (player.value) {
        player.value.poster = value;
      }
    };

    watch(
      () => props.thumbUrl,
      () => setPoster(props.thumbUrl)
    );

    const isExternalVideo = computed(() => true);

    const source = computed(() => {
      if (isExternalVideo.value) {
        return props.url;
      }
    });

    onMounted(() => {
      if (props.ratio && player.value) {
        player.value.style.aspectRatio = props.ratio;
      }

      const currentDuration = player.value?.state?.duration;
      if (!currentDuration && !isExternalVideo.value) {
        setTimeout(() => {
          mediaDuration.value = 200;
        }, 300);
      }
    });

    onBeforeUnmount(() => {
      if (player.value) {
        player.value.destroy();
      }
    });

    return {
      player,
      mediaDuration,
      setPoster,
      isExternalVideo,
      source,
    };
  },
});
</script>

<style lang="scss" scoped>
.video-player-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  &.compact {
    width: 80%;
  }

  video {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>

<style lang="scss">
.vds-video-layout {
  font-size: 16px;
}

[data-external-video="true"] {
  media-video-layout {
    .vds-loading-spinner,
    .vds-buffering-indicator {
      display: none;
    }
  }
}

[data-display-controls="false"] {
  media-controls {
    pointer-events: unset !important;
  }
  .vds-controls-group {
    visibility: hidden;
  }
  .vds-start-duration {
    visibility: hidden;
  }
}

[data-has-google-cast-support="false"] {
  .vds-google-cast-button {
    display: none;
  }
}

[data-media-player][data-layout="video"]:not([data-fullscreen]) {
  border: none;
}

media-player {
  z-index: 0;
  border: none;
}

video::-internal-media-controls-overlay-cast-button {
  display: none;
}

[data-media-player] {
  contain: layout;
}

iframe.vds-youtube[data-no-controls] {
  height: 100%;
}
</style>
