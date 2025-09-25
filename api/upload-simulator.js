const { Octokit } = require("octokit");

// Configuración del Repositorio. Reemplaza con tu usuario y nombre de repo si son diferentes.
const GITHUB_OWNER = 'vec70rr'; // Tu usuario de GitHub
const GITHUB_REPO = 'EditorDeLibro'; // El nombre de tu repositorio
const GITHUB_BRANCH = 'main'; // O 'master'

// Esta es la función serverless que se ejecutará en Vercel
module.exports = async (req, res) => {
  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { name, code, fileName } = req.body;

    if (!name || !code || !fileName || !fileName.endsWith('.js')) {
      return res.status(400).json({ message: 'Faltan datos o el nombre de archivo es inválido.' });
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // --- Proceso de Commit a través de la API ---

    const { data: refData } = await octokit.rest.git.getRef({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}`,
    });
    const parentSha = refData.object.sha;

    // Obtener el manifest.json para evitar sobreescribirlo si hay un commit intermedio
    // (Esta es una mejora de robustez)
    let manifestJson;
    let manifestSha;
    try {
        const { data: manifestData } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER, repo: GITHUB_REPO, path: 'simuladores/manifest.json',
        });
        manifestSha = manifestData.sha;
        const manifestContent = Buffer.from(manifestData.content, 'base64').toString('utf8');
        manifestJson = JSON.parse(manifestContent);
    } catch(e) {
        // Si el manifest no existe, creamos uno nuevo
        manifestJson = [];
    }

    manifestJson.push({ name, file: fileName });
    const updatedManifestContent = JSON.stringify(manifestJson, null, 2);

    const treePayload = [
      { path: `simuladores/${fileName}`, mode: '100644', type: 'blob', content: code },
      { path: 'simuladores/manifest.json', mode: '100644', type: 'blob', content: updatedManifestContent }
    ];

    const { data: tree } = await octokit.rest.git.createTree({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      base_tree: refData.object.sha,
      tree: treePayload,
    });

    const { data: commit } = await octokit.rest.git.createCommit({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      message: `feat: Añadir nuevo simulador '${name}' vía API`,
      tree: tree.sha,
      parents: [parentSha],
    });

    await octokit.rest.git.updateRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `heads/${GITHUB_BRANCH}`,
      sha: commit.sha,
    });

    res.status(200).json({ message: '¡Simulador subido y desplegado con éxito!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al subir el simulador.', error: error.message });
  }
};