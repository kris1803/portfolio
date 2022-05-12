
Locapic - Points d'interet et chat avec les autres users.

Application react Native de localisation en temps réel, avec possibilité de sauvegarder des points d'interêt sur la carte (sauvegardés dans le téléphone dans le local storage). 
Chat en temps réel avec les autres utilisateurs connectés.

Backend: express, socket.io.
Frontend: Redux, React native, Async Storage, react-native-elements, socket.io client.

Pour démarrer:
    - Changer l'adresse ip de 'localhost' à l'adresse ip interne du backend dans le fichier ChatScreen.js du frontend/screens.
    - Faire npm install et npm start dans les dossiers frontend et backend.
    - Pour tester l'app depuis un téléphone, scanner le qr code du terminal avec l'application Expo.

Socket.io is very unstable, so maybe using ws module will fix this.
