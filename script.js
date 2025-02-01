document.getElementById('submitButton').addEventListener('click', function () {
  const following_file = document.getElementById('following').files[0];
  const followers_file = document.getElementById('followers').files[0];
  const outputDiv = document.getElementById('output');

  if (following_file && followers_file) {
    outputDiv.innerHTML = '<p>Comparando arquivos...</p>';

    const extractInstagramLinks = (content) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      return links
        .map(link => link.href) 
        .filter(href => href.startsWith('https://www.instagram.com/')); 
    };

    const processFile = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const content = e.target.result;
          const links = extractInstagramLinks(content);
          resolve(links);
        };
        reader.readAsText(file);
      });
    };

    Promise.all([processFile(following_file), processFile(followers_file)]).then(([linksFollowing, linksFollowers]) => {
      const setFollowing = new Set(linksFollowing); 
      const setFollowers = new Set(linksFollowers);

      const commonLinks = [...setFollowing].filter(link => !setFollowers.has(link));

      if (commonLinks.length > 0) {
        outputDiv.innerHTML = `<p>Encontrados ${commonLinks.length} perfis que não seguem de volta:</p>`;
        commonLinks.forEach(link => {
          outputDiv.innerHTML += `<li><a target="_blank" href="${link}">${link.slice(26)}</a></li>`;
        });
      } else {
        outputDiv.innerHTML = '<p>Todos seguem de volta.</p>';
      }
    });
  } else {
    outputDiv.innerHTML = '<p>Por favor, selecione os dois arquivos antes de clicar em "Enviar".</p>';
  }
});
