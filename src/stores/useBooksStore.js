import { create } from 'zustand';
import { mockBooks } from '@/utils/mockData';

const useBooksStore = create((set, get) => {
  const storedBooks = localStorage.getItem('books');
  const initialBooks = storedBooks ? JSON.parse(storedBooks) : mockBooks;
  
  if (!storedBooks) {
    localStorage.setItem('books', JSON.stringify(mockBooks));
  }
  
  return {
    books: initialBooks,
    
    addBook: (book) => {
      const newBook = {
        ...book,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedBooks = [...get().books, newBook];
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      set({ books: updatedBooks });
      return newBook;
    },
    
    updateBook: (bookId, updates) => {
      const updatedBooks = get().books.map(book =>
        book.id === bookId ? { ...book, ...updates } : book
      );
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      set({ books: updatedBooks });
    },
    
    deleteBook: (bookId) => {
      const updatedBooks = get().books.filter(book => book.id !== bookId);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      set({ books: updatedBooks });
    },
    
    getBookById: (bookId) => {
      return get().books.find(book => book.id === bookId);
    }
  };
});

export default useBooksStore;
