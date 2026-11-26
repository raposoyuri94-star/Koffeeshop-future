import React from 'react';

const photos = [
  { file: 'iced-coffee.png', title: 'Café gelado' },
  { file: 'iced-matcha-latte.png', title: 'Matcha latte' },
  { file: 'crispy-chicken.png', title: 'Crispy chicken' },
  { file: 'tuna-avo.png', title: 'Tuna avo' },
  { file: 'Koffee 2.jpeg', title: 'Uma pausa para o café' },
  { file: 'Koffee 5.jpg', title: 'À mesa com a Koffé' },
];

export default function GallerySection({ onOpenImage }) {
  return (
    <section id="gallery" className="gallery section-space" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Galeria</h2>
      <p>Um pouco do que vai no copo e à mesa.</p>
      <div className="gallery-grid">
        {photos.map(photo => {
          const src = `${import.meta.env.BASE_URL}images/${encodeURIComponent(photo.file)}`;
          return (
            <figure key={photo.file}>
              <button type="button" aria-label={`Ver foto: ${photo.title}`} aria-haspopup="dialog"
                onClick={event => {
                  const image = event.currentTarget.querySelector('img');
                  onOpenImage({ src, title: photo.title, alt: photo.title, width: image.naturalWidth || undefined, height: image.naturalHeight || undefined });
                }}>
                <img src={src} alt={photo.title} loading="lazy" />
              </button>
              <figcaption>{photo.title}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
