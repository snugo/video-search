let fuse;
let data = [];
let currentFilter = 'all';
let selectedArtist = null;

const clearArtistBtn = document.getElementById('clear-artist');

clearArtistBtn.addEventListener('click', () => {
  selectedArtist = null;
  clearArtistBtn.style.display = 'none';
  handleSearch();
});

async function loadData() {
  const res = await fetch('videos.json');
  data = await res.json();

  fuse = new Fuse(data, {
    keys: ['song_title', 'artist'],
    threshold: 0.3,
  });

  document.getElementById('search').addEventListener('input', handleSearch);
  document.querySelectorAll('#filters button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');

        // Update active button style
        document.querySelectorAll('#filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        handleSearch();
      });
    });



  displayResults(data); // show all on load
}

function handleSearch() {
  const query = document.getElementById('search').value;
  const results = query ? fuse.search(query).map(r => r.item) : data;
  const filtered = applyFilter(results);
  displayResults(filtered);
}

function applyFilter(results) {
  return results.filter(v => {
    const matchesType =
      currentFilter === 'all' ||
      v['type'] === currentFilter;

    const matchesArtist =
      !selectedArtist || v['artist'] === selectedArtist;

    return matchesType && matchesArtist;
  });
}

function displayResults(results) {
  const list = document.getElementById('results');
  const countDisplay = document.getElementById('result-count');

  list.innerHTML = '';
  countDisplay.innerText = `${results.length} result${results.length !== 1 ? 's' : ''} found`;
  results.forEach(video => {
    let typeLabel = '';

    if (video['type'] === 'ACC') {
      typeLabel = 'Accompaniment';
    } else if (video['type'] === 'ARR') {
      typeLabel = 'Arrangement';
    } else if (video['type'] === 'CLA') {
      typeLabel = 'Classical';
    }

    const tutorialLink = video['tbh_video_link'] && video['tbh_video_title']
      ? `Tutorial: <a href="${video['tbh_video_link']}" target="_blank">${video['tbh_video_title']}</a><br/>`
      : '';

    const sheetMusic = video['sheet_music_link']
      ? `Sheet music: <a href="${video['sheet_music_link']}" target="_blank">${video['sheet_music_link']}</a><br/>`
      : '';

    const easyVersion = (video['easy_video_link'] && video['easy_video_title'])
      ? `Easy version: <a href="${video['easy_video_link']}" target="_blank">${video['easy_video_title']}</a><br/>`
      : '';

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${video['song_title']}</strong> by 
      <a href="#" class="artist-link" data-artist="${video['artist']}">${video['artist']}</a><br/>
      <em>${typeLabel}</em><br/>
      ${tutorialLink}
      ${sheetMusic}
      ${easyVersion}
    `;
    list.appendChild(li);
  });
}


loadData();

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('artist-link')) {
    e.preventDefault();
    selectedArtist = e.target.getAttribute('data-artist');

    document.getElementById('search').value = ''; // clear search

    // Keep the solo/accompaniment filter, just re-apply the highlight
    document.querySelectorAll('#filters button').forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-filter') === currentFilter) {
        b.classList.add('active');
      }
    });

    // Show the clear artist filter button if needed
    document.getElementById('clear-artist').style.display = 'inline-block';

    handleSearch();
  }
});