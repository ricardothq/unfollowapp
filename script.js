// Función para validar el nombre del archivo
const validarArchivo = (inputElement, nombreCorrecto) => {
    const label = inputElement.previousElementSibling; // Selecciona el <label> que está justo arriba
    const archivo = inputElement.files[0];

    if (!archivo) return;

    if (archivo.name === nombreCorrecto) {
        label.classList.remove('text-error');
        label.classList.add('text-success');
    } else {
        label.classList.remove('text-success');
        label.classList.add('text-error');
    }
};

// Escuchamos cuando el usuario selecciona archivos
document.getElementById('followersInput').addEventListener('change', function() {
    validarArchivo(this, 'followers_1.json');
});

document.getElementById('followingInput').addEventListener('change', function() {
    validarArchivo(this, 'following.json');
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
    const followersFile = document.getElementById('followersInput').files[0];
    const followingFile = document.getElementById('followingInput').files[0];

    if (!followersFile || !followingFile) {
        alert("Por favor, sube ambos archivos JSON.");
        return;
    }

    const readJson = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(JSON.parse(e.target.result));
            reader.readAsText(file);
        });
    };

    const dataFollowers = await readJson(followersFile);
    const dataFollowing = await readJson(followingFile);

    // Lógica similar a la que usamos en Python
    const seguidores = new Set(dataFollowers.map(item => item.string_list_data[0].value));
    
    const listaResultados = document.getElementById('list');
    listaResultados.innerHTML = "";
    
    const noSiguen = dataFollowing.relationships_following.filter(item => !seguidores.has(item.title));

    document.getElementById('totalCount').textContent = noSiguen.length;

    noSiguen.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.title;
        listaResultados.appendChild(li);
    });

    document.getElementById('result').classList.remove('hidden');
});