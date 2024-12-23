export type Book = {
  id: string; // Correspond à "ITEMID"
  title: string; // Correspond à "Titre"
  author: string; // Correspond à "Auteur"
  coverUrl: string; // Vous devrez générer une URL ou utiliser un placeholder
  views: number; // Si non applicable, mettre une valeur par défaut
  date: string; // Correspond à "D_CREATION"
  location: string; // Correspond à "Locale"
};
export const _books: Book[] = [
  {
    id: '2039446',
    title: 'Economie internationale',
    author: 'Paul R. Krugman, Maurice Obstfeld trad. par Achille Hannequart et Fabienne Leloup',
    coverUrl: '/covers/economie-internationale.jpg', // Placeholder
    views: 0, // Valeur par défaut
    date: '2011-08-01',
    location: 'Carthage-IHEC',
  },
  {
    id: '1302422',
    title: 'Ordonnancement et gestion de production',
    author: 'Pierre Lamy',
    coverUrl: '/covers/ordonnancement-gestion.jpg', // Placeholder
    views: 0, // Valeur par défaut
    date: '2010-09-29',
    location: 'Carthage-IHEC',
  },
];
