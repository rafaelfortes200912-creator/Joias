"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Banner } from "@/src/data/banners";

export default function BannerCarrossel({ banners }: { banners: Banner[] }) {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAtual((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, [banners.length]);

  return (
    <section className="relative h-[400px] overflow-hidden rounded-b-3xl mb-8">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === atual ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img src={banner.imagem} alt={banner.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">{banner.titulo}</h2>
            <p className="text-gray-200 text-lg max-w-xl mx-auto mb-6">{banner.subtitulo}</p>
            <Link href="#produtos" className="inline-block bg-[#D4AF37] text-black font-bold px-6 py-3 rounded-full hover:bg-[#c19a2e] transition-colors">
              {banner.textoBotao}
            </Link>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setAtual(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === atual ? "w-8 bg-[#D4AF37]" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}