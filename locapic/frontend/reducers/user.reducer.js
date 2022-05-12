export default function (user = {}, action) {
   switch (action.type) {
      case 'SET_USER':
         return action.user;
      default:
         return user;
   }
}