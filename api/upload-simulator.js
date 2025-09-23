import { Octokit } from "octokit";

// Configuración del Repositorio. Reemplaza con tu usuario y nombre de repo.
const GITHUB_OWNER = 'vec70rr'; // Tu usuario de GitHub
const GITHUB_REPO = 'EditorDeLibro'; // El nombre de tu repositorio
const GITHUB_BRANCH = 'main'; // O 'master'

// Esta es la función serverless que se ejecutará en Vercel
export default async function handler(req, res) {
  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { name, code, fileName } = req.body;

    // Validar datos de entrada
    if (!name || !code || !fileName || !fileName.endsWith('.js')) {
      return res.status(400).json({ message: 'Faltan datos o el nombre de archivo es inválido.' });
    }

    // Autenticar con la API de GitHub usando el token secreto
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // --- Proceso de Commit a través de la API ---

    // 1. Obtener el commit más reciente para saber desde dónde ramificar
    const { data: refData } = await octokit.rest.git.getRef({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}`,
    });
    const parentSha = refData.object.sha;

    // 2. Obtener el contenido actual del manifest.json
    const { data: manifestData } = await octokit.rest.repos.getContent({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, path: 'simuladores/manifest.json',
    });
    const manifestContent = Buffer.from(manifestData.content, 'base64').toString('utf8');
    const manifestJson = JSON.parse(manifestContent);

    // 3. Añadir el nuevo simulador al manifest
    manifestJson.push({ name, file: fileName });
    const updatedManifestContent = JSON.stringify(manifestJson, null, 2);

    // 4. Crear los nuevos "archivos" (blobs) y el nuevo "árbol" de directorios
    const { data: newTree } = await octokit.rest.git.createTree({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      base_tree: parentSha, // Importante: basarse en el estado actual
      tree: [
        // El nuevo archivo del simulador
        {
          path: `simuladores/${fileName}`,
          mode: '100644',
          type: 'blob',
          content: code,
        },
        // El manifest.json actualizado
        {
          path: 'simuladores/manifest.json',
          mode: '100644',
          type: 'blob',
          content: updatedManifestContent,
        }
      ],
    });

    // 5. Crear el nuevo commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      message: `feat: Añadir nuevo simulador '${name}'`,
      tree: newTree.sha,
      parents: [parentSha],
    });

    // 6. Actualizar la rama para que apunte al nuevo commit (hacer el "push")
    await octokit.rest.git.updateRef({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      ref: `heads/${GITHUB_BRANCH}`,
      sha: newCommit.sha,
    });

    // 7. Enviar respuesta de éxito
    res.status(200).json({ message: '¡Simulador subido y desplegado con éxito!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al subir el simulador.', error: error.message });
  }
}