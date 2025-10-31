// Importation du framework Express
const express = require('express');
// Creation de l'application Express
const app = express();
// Definition du port du serveur
const port = 3000;

// Activation du parser JSON pour les requetes  
app.use(express.json());

// Liste des cours
let items = [
    { id: 1, name: 'JavaScript Course', category: 'JS', price: 99.99 },
    { id: 2, name: 'Python Course', category: 'Python', price: 89.99 },
    { id: 3, name: 'Node.js Course', category: 'JS', price: 79.99 }
];


// Obtenir tous les elements, Filtrer par categorie avec category et Limiter les resultats avec limit
app.get('/items', (req, res) => {
    // Creer une copie du tableau items pour eviter de modifier les donnees originales
    let result = [...items];
    
    // Filtrer les elements par categorie si le parametre category est present
    if (req.query.category) {
        result = result.filter(item => 
            item.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }
    
    // Limiter le nombre de resultats si le parametre limit est present
    if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        if (!isNaN(limit) && limit > 0) {
            result = result.slice(0, limit);
        }
    }
    
    res.json(result);
});

// retournera l'element avec l'ID en cours
app.get('/items/:id', (req, res) => {
    // Convertir le parametre ID de l'URL de string en nombre
    const id = parseInt(req.params.id);
    // Rechercher l'element avec l'ID correspondant
    const item = items.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({ error: 'Element non trouve' });
    }
    
    res.json(item);
});

// Ajouter un nouvel element
app.post('/items', (req, res) => {
    // Valider le corps de la requete
    if (!req.body || !req.body.name || !req.body.category || !req.body.price) {
        return res.status(400).json({ error: 'Corps de la requete invalide. Champs requis: name, category, price' });
    }
    
    // Creer un nouvel element avec un ID auto-incremente
    const newItem = {
        id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price
    };

    items.push(newItem);
    res.status(201).json(newItem);
});

// Supprimer un element (ID)
app.delete('/items/:id', (req, res) => {
    // Convertir l'ID en nombre
    const id = parseInt(req.params.id);
    // Trouver l'index de l'element dans le tableau
    const index = items.findIndex(item => item.id === id);
    
    // Si l'element n'existe pas, retourner une erreur 404
    if (index === -1) {
        return res.status(404).json({ error: 'Element non trouve' });
    }
    
    items.splice(index, 1);
    res.status(200).json({ message: 'Element supprime avec succes' });
});

// Demarrer le serveur et ecouter sur le port=3000
app.listen(port, () => {
    console.log(`Serveur demarre sur http://localhost:${port}`);
});