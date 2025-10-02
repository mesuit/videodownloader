async function search() {
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return alert("Enter a search query");

  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!data.status || !data.result || data.result.length === 0) {
    resultsDiv.innerHTML = "<p>No results found</p>";
    return;
  }

  data.result.forEach(item => {
    const div = document.createElement("div");
    div.className = "result";

    div.innerHTML = `
      <h3>${item.title}</h3>
      <img src="${item.thumbnail}" alt="${item.title}"/>
      <p>Views: ${item.views || "?"} | Duration: ${item.duration || "?"} | Published: ${item.published || "?"}</p>
      <button onclick="download('${item.id}', '${item.url}')">⬇ Download MP4</button>
    `;

    resultsDiv.appendChild(div);
  });
}

async function download(id, url) {
  const res = await fetch(`/api/download?id=${id}&url=${encodeURIComponent(url)}`);
  const data = await res.json();

  if (data.status && data.download) {
    window.open(data.download, "_blank");
  } else {
    alert("❌ Download not available");
  }
}
