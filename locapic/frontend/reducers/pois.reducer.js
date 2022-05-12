export default function (pois = [], action) {
   switch (action.type) {
      case 'ADD_POI':
         let newPois = [...pois, action.poi];
         return newPois;
      case 'REMOVE_POI':
         let newPois2 = pois.filter((poi) => poi.title !== action.title);
         return newPois2;
      case 'SET_POIS':
         return action.pois;
      default:
         return pois;
   }
}