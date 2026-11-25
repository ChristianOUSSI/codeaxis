// Endpoint 404 générique — cible des rewrites vercel.json pour masquer
// les dossiers internes (scripts/, tools/) qui ne doivent pas être servis.
module.exports = function handler(req, res) {
  res.status(404).json({ error: 'not_found' });
};
