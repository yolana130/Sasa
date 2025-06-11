import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Product {
  id?: string;
  name: string;
  image: string;
  category: string;
  subcategory: string;
  price?: string;
  description?: string;
  createdAt?: Date;
}

const COLLECTION_NAME = 'products';

// Obtener todos los productos de una categoría
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// Agregar un nuevo producto
export const addProduct = async (product: Omit<Product, 'id'>): Promise<string | null> => {
  try {
    const productData = {
      ...product,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), productData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

// Actualizar un producto existente
export const updateProduct = async (id: string, product: Partial<Product>): Promise<boolean> => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, product);
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Obtener todas las subcategorías de una categoría
export const getSubcategoriesByCategory = async (category: string): Promise<string[]> => {
  try {
    const products = await getProductsByCategory(category);
    const subcategories = [...new Set(products.map(p => p.subcategory))];
    return subcategories;
  } catch (error) {
    console.error('Error getting subcategories:', error);
    return [];
  }
};