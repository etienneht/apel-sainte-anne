// src/app/services/image.service.ts
import { Injectable } from '@angular/core';
import imageCompression from 'browser-image-compression';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  // Options par défaut pour la compression
  private compressionOptions = {
    maxSizeMB: 5, // Taille maximale de l'image en MB
    maxWidthOrHeight: 1920, // Largeur/hauteur maximale
    useWebWorker: true, // Utiliser un WebWorker
  };

  // Compresser une image et la convertir en WebP
  async compressAndConvertToWebP(file: File): Promise<File> {
    try {
      // Compression de l'image
      const compressedFile = await imageCompression(file, this.compressionOptions);

      // Conversion en WebP à l'aide d'un Canvas
      const webPBlob = await this.convertToWebP(compressedFile);

      // Créer un fichier WebP
      const webPFile = new File([webPBlob], `${file.name.split('.')[0]}.webp`, {
        type: 'image/webp',
      });

      return webPFile;
    } catch (error) {
      console.error('Erreur lors de la compression/conversion de l’image', error);
      throw error;
    }
  }

  // Convertir un fichier d'image en WebP
  private async convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject('Impossible de créer le contexte Canvas');
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Convertir le Canvas en WebP Blob
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject('Conversion en WebP échouée');
            },
            'image/webp',
            0.9 // Qualité (0.1 à 1.0)
          );
        };

        img.onerror = (err) => reject(err);
      };

      reader.onerror = (err) => reject(err);

      // Lire le fichier en tant que DataURL
      reader.readAsDataURL(file);
    });
  }
}
