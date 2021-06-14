window.addEventListener('load', async () => {
  if(navigator.serviceWorker) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker Successfully', reg)
    } catch (e) {
      console.log('Service worker registration failed')
    }
  }

  await loadPosts()
})


async function loadPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20')
  const data = await res.json()

  const container = document.querySelector('#posts')
  container.innerHTML = data.map(toCard).join('\n')
}

function toCard(post) {
  return `
    <div class="card">
      <div class="card-title">
        ${post.title}
      </div>
      <div class="card-body">
        ${post.body}
      </div>
    </div>
  `
}
