document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const zipFile = document.getElementById('zipInput').files[0];
    const zipLabel = document.getElementById('zipLabel');

    if (!zipFile) {
        alert("Por favor, selecciona el archivo .zip");
        return;
    }

    try {
        const jszip = new JSZip();
        const contenidoZip = await jszip.loadAsync(zipFile);
        
        // Buscamos los archivos sin importar en qué carpeta estén (Instagram cambia rutas a veces)
        const followersPath = Object.keys(contenidoZip.files).find(path => path.endsWith('followers_1.json'));
        const followingPath = Object.keys(contenidoZip.files).find(path => path.endsWith('following.json'));

        if (!followersPath || !followingPath) {
            alert("No encontré los archivos necesarios. Asegúrate de que sea el ZIP original de Instagram.");
            zipLabel.style.color = "#ff4b4b"; // Rojo si falla
            return;
        }

        zipLabel.style.color = "#4ade80"; // Verde si lo encuentra

        // Extraer el texto de los archivos dentro del ZIP
        const followersStr = await contenidoZip.files[followersPath].async("string");
        const followingStr = await contenidoZip.files[followingPath].async("string");

        const dataFollowers = JSON.parse(followersStr);
        const dataFollowing = JSON.parse(followingStr);

        // Lógica de comparación (ajustada a la estructura de Instagram)
        const seguidores = new Set(dataFollowers.map(item => item.string_list_data[0].value));
        const noSiguen = dataFollowing.relationships_following.filter(item => !seguidores.has(item.title));

        // Actualizar el contador y la lista
        document.getElementById('totalCount').textContent = noSiguen.length;
        const listaResultados = document.getElementById('list');
        listaResultados.innerHTML = "";
        
        noSiguen.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.title;
            listaResultados.appendChild(li);
        });

        document.getElementById('result').classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert("Hubo un error al procesar el ZIP. Intenta de nuevo.");
    }
});
