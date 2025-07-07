const apiKey = "YOUR_YOUTUBE_API_KEY"; // Replace this!
const suggestionsBox = document.getElementById("suggestions");

async function getSuggestions(query) {
  if (!query) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  const url = `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(
    query
  )}`;

  const res = await fetch(url);
  const data = await res.json();
  const suggestions = data[1];

  suggestionsBox.innerHTML = "";
  suggestionsBox.classList.remove("hidden");

  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.textContent = suggestion;
    li.className = "p-2 hover:bg-gray-200 cursor-pointer";
    li.onclick = () => searchSong(suggestion);
    suggestionsBox.appendChild(li);
  });
}

async function searchSong(query) {
  suggestionsBox.classList.add("hidden");
  document.getElementById("search").value = query;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      query
    )}&key=${apiKey}&type=video&videoCategoryId=10&maxResults=1`
  );

  const data = await res.json();
  const video = data.items[0];

  if (!video) {
    alert("No song found!");
    return;
  }

  const videoId = video.id.videoId;
  const title = video.snippet.title;

  document.getElementById("songTitle").textContent = title;
  document.getElementById("nowPlaying").classList.remove("hidden");

  // Use 3rd party audio stream API (example proxy)
  const audioUrl = `https://youtube-mp3.audioextractor.io/api/yt/audio/${videoId}`;
  document.getElementById("audioPlayer").src = audioUrl;
}
