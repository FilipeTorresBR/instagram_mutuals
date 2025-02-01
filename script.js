document.getElementById('submitButton').addEventListener('click', function () {
  const file1 = document.getElementById('following').files[0];
  const file2 = document.getElementById('followers').files[0];
  const outputDiv = document.getElementById('output');

  if (file1 && file2) {
    outputDiv.innerHTML = '<p>Comparando arquivos...</p>';

    const extractInstagramLinks = (content) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      return links
        .map(link => link.href) // Extrai os href
        .filter(href => href.startsWith('https://www.instagram.com/')); // Filtra URLs do Instagram
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

    // Processar os dois arquivos
    Promise.all([processFile(file1), processFile(file2)]).then(([linksFile1, linksFile2]) => {
      const setFile1 = new Set(linksFile1); // Conjunto de links do arquivo 1
      const setFile2 = new Set(linksFile2); // Conjunto de links do arquivo 2

      // Interseção dos dois conjuntos
      const commonLinks = [...setFile1].filter(link => !setFile2.has(link));

      // Exibir os resultados
      if (commonLinks.length > 0) {
        outputDiv.innerHTML = `<p>Encontrados ${commonLinks.length} links em comum:</p>`;
        commonLinks.forEach(link => {
          outputDiv.innerHTML += `<a target="_blank" href="${link}">${link}</a><br>`;
        });
      } else {
        outputDiv.innerHTML = '<p>Nenhum link em comum foi encontrado.</p>';
      }
    });
  } else {
    outputDiv.innerHTML = '<p>Por favor, selecione os dois arquivos antes de clicar em "Comparar".</p>';
  }
});
