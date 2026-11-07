const video = document.querySelector('video');
let seekableSource;
let latestChapter;

function loadSeekableVideo() {
  if (seekableSource) return seekableSource;
  seekableSource = fetch(video.src).then(async response => {
    if (!response.ok) throw new Error('Could not load video.');
    const url = URL.createObjectURL(await response.blob());
    await new Promise((resolve, reject) => {
      video.addEventListener('loadedmetadata', resolve, {once:true});
      video.addEventListener('error', reject, {once:true});
      video.src = url;
    });
  }).catch(error => {
    seekableSource = undefined;
    throw error;
  });
  return seekableSource;
}

for (const chapter of document.querySelectorAll('[data-time]')) {
  chapter.addEventListener('click', async () => {
    latestChapter = chapter;
    const time = Number(chapter.dataset.time);
    if (!video.seekable.length || video.seekable.end(video.seekable.length-1) < time) {
      try { await loadSeekableVideo(); } catch { return; }
    }
    if (latestChapter !== chapter) return;
    video.currentTime = time;
    video.play().catch(() => {});
  });
}
