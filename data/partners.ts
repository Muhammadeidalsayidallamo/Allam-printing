import type { Partner } from '../types';

const optimize = (url: string, width: number, quality = 85) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=${quality}&output=webp`;

// Using placeholder logos from a service. In a real app, these would be local SVGs.
export const partners: Partner[] = [
    { id: 1, name: "Nike", logo: optimize("logo.clearbit.com/nike.com", 128) },
    { id: 2, name: "Adidas", logo: optimize("logo.clearbit.com/adidas.com", 128) },
    { id: 3, name: "Puma", logo: optimize("logo.clearbit.com/puma.com", 128) },
    { id: 4, name: "Zara", logo: optimize("logo.clearbit.com/zara.com", 128) },
    { id: 5, name: "H&M", logo: optimize("logo.clearbit.com/hm.com", 128) },
    { id: 6, name: "Levi's", logo: optimize("logo.clearbit.com/levis.com", 128) },
    { id: 7, name: "Lacoste", logo: optimize("logo.clearbit.com/lacoste.com", 128) },
    { id: 8, name: "Tommy Hilfiger", logo: optimize("logo.clearbit.com/tommy.com", 128) },
    { id: 9, name: "Calvin Klein", logo: optimize("logo.clearbit.com/calvinklein.com", 128) },
    { id: 10, name: "The North Face", logo: optimize("logo.clearbit.com/thenorthface.com", 128) },
    { id: 11, name: "Under Armour", logo: optimize("logo.clearbit.com/underarmour.com", 128) },
    { id: 12, name: "New Balance", logo: optimize("logo.clearbit.com/newbalance.com", 128) },
    { id: 13, name: "Concrete", logo: optimize("logo.clearbit.com/concrete.com.eg", 128) },
    { id: 14, name: "Ravin", logo: optimize("logo.clearbit.com/ravinjeans.com", 128) },
    { id: 15, name: "Town Team", logo: optimize("logo.clearbit.com/townteam.com", 128) },
    { id: 16, name: "Daly Dress", logo: optimize("logo.clearbit.com/dalydress.com", 128) },
    { id: 17, name: "Defacto", logo: optimize("logo.clearbit.com/defacto.com", 128) },
    { id: 18, name: "LC Waikiki", logo: optimize("logo.clearbit.com/lcwaikiki.com", 128) },
    { id: 19, name: "Dice", logo: optimize("logo.clearbit.com/dicestores.com", 128) },
    { id: 20, name: "Mobaco Cottons", logo: optimize("logo.clearbit.com/mobaco.com", 128) },
];