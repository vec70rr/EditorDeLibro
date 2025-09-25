// El único cambio está en la primera línea.
const { Octokit } = await import("octokit");

// Configuración del Repositorio.
const GITHUB_OWNER = 'vec70rr';
const GITHUB_REPO = 'EditorDeLibro';
const GITHUB_BRANCH = 'main';

module.exports = async (req, res) => {
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
    const parentCommitSha = refData.object.sha;

    const { data: commitData } = await octokit.rest.git.getCommit({
        owner: GITHUB_OWNER, repo: GITHUB_REPO, commit_sha: parentCommitSha,
    });
    const baseTreeSha = commitData.tree.sha;

    const { data: manifestData } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, path: 'simuladores/manifest.json',
    });
    const manifestContent = Buffer.from(manifestData.content, 'base64').toString('utf8');
    const manifestJson = JSON.parse(manifestContent);

    manifestJson.push({ name, file: fileName });
    const updatedManifestContent = JSON.stringify(manifestJson, null, 2);

    const { data: newTree } = await octokit.rest.git.createTree({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      base_tree: baseTreeSha,
      tree: [
        { path: `simuladores/${fileName}`, mode: '100644', content: code },
        { path: 'simuladores/manifest.json', mode: '100644', content: updatedManifestContent }
      ],
    });

    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      message: `feat: Añadir nuevo simulador '${name}' vía API`,
      tree: newTree.sha,
      parents: [parentCommitSha],
    });

    await octokit.rest.git.updateRef({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      ref: `heads/${GITHUB_BRANCH}`,
      sha: newCommit.sha,
    });

    res.status(200).json({ message: '¡Simulador subido y desplegado con éxito!' });

  } catch (error) {
    console.error("Error detallado en la función serverless:", error);
    res.status(500).json({ message: 'Error en el servidor al subir el simulador.', error: error.message });
  }
};