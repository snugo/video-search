let fuse;
let data = [];
let currentFilter = 'all';

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
	
	    // Remove active class from all buttons
	    document.querySelectorAll('#filters button').forEach(b => b.classList.remove('active'));
	
	    // Add active class to clicked button
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
  if (currentFilter === 'solo') {
    return results.filter(v => v['is_accompaniment'] === 'FALSE');
  } else if (currentFilter === 'accompaniment') {
    return results.filter(v => v['is_accompaniment'] === 'TRUE');
  }
  return results;
}

function displayResults(results) {
  const list = document.getElementById('results');
  list.innerHTML = '';
  results.forEach(video => {
    const isAccompaniment = video['is_accompaniment'] === 'TRUE';
    const typeLabel = isAccompaniment ? 'Accompaniment' : 'Piano Solo';

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
      <strong>${video['song_title']}</strong> by ${video['artist']}<br/>
      <em>${typeLabel}</em><br/>
      ${tutorialLink}
      ${sheetMusic}
      ${easyVersion}
    `;
    list.appendChild(li);
  });
}


loadData();
