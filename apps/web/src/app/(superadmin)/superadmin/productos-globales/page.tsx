'use client';

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/sidebar';
import { 
  Plus, Upload, Search, Edit2, Trash2, Image, 
  X, Save, Check, RefreshCw, Package, Globe
} from 'lucide-react';

interface GlobalProduct {
  id: string;
  category: string;
  nameEs: string;
  nameFr?: string;
  nameAr?: string;
  price: number;
  unitType: string;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
}

const defaultProducts = [
  { name_es: "Leche Centrale 1L", name_fr: "Lait Centrale 1L", name_ar: "حليب سنطرال 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Leche Jaouda 1L", name_fr: "Lait Jaouda 1L", name_ar: "حليب جودة 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Leche Chergui 1L", name_fr: "Lait Chergui 1L", name_ar: "حليب شركي 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Medio litro Centrale", name_fr: "Demi-litre Centrale", name_ar: "نصف لتر حليب سنطرال", category: "Lácteos", unit_type: "unid", price_mad: 3.50, barcode: "", image_url: "" },
  { name_es: "Raïbi Jamila", name_fr: "Raïbi Jamila", name_ar: "رايبي جميلة", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Raïbi Jaouda", name_fr: "Raïbi Jaouda", name_ar: "رايبي جودة", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Yogur Danone Fresa", name_fr: "Yaourt Danone Fraise", name_ar: "ياغورت دانون فريز", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Yogur Danone Vainilla", name_fr: "Yaourt Danone Vanille", name_ar: "ياغورت دانون فاني", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Yogur Jockey", name_fr: "Yaourt Jockey", name_ar: "ياغورت جوكي", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Danino", name_fr: "Danino", name_ar: "دانينو", category: "Lácteos", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Activia", name_fr: "Activia", name_ar: "أكتيفيا", category: "Lácteos", unit_type: "unid", price_mad: 3.00, barcode: "", image_url: "" },
  { name_es: "Queso La Vache qui rit (8 porc.)", name_fr: "Fromage La Vache qui rit (8 port.)", name_ar: "فرماج البقرة الضاحكة 8", category: "Lácteos", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Queso La Vache qui rit (16 porc.)", name_fr: "Fromage La Vache qui rit (16 port.)", name_ar: "فرماج البقرة الضاحكة 16", category: "Lácteos", unit_type: "unid", price_mad: 15.00, barcode: "", image_url: "" },
  { name_es: "Queso Kiri (6 porc.)", name_fr: "Fromage Kiri (6 port.)", name_ar: "فرماج كيري 6", category: "Lácteos", unit_type: "unid", price_mad: 9.50, barcode: "", image_url: "" },
  { name_es: "Queso Kiri (12 porc.)", name_fr: "Fromage Kiri (12 port.)", name_ar: "فرماج كيري 12", category: "Lácteos", unit_type: "unid", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Queso Or Blanc (16 porc.)", name_fr: "Fromage Or Blanc (16 port.)", name_ar: "فرماج أور بلون 16", category: "Lácteos", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Queso Rojo (por kilo)", name_fr: "Fromage Rouge Edam (au kilo)", name_ar: "الفرماج الأحمر بالكيلو", category: "Lácteos", unit_type: "kg", price_mad: 110.00, barcode: "", image_url: "" },
  { name_es: "Queso Bola Edam", name_fr: "Fromage Boule Edam", name_ar: "فرماج كورة إيدام", category: "Lácteos", unit_type: "unid", price_mad: 85.00, barcode: "", image_url: "" },
  { name_es: "Mantequilla Centrale 250g", name_fr: "Beurre Centrale 250g", name_ar: "زبدة سنطرال 250 غ", category: "Lácteos", unit_type: "unid", price_mad: 22.00, barcode: "", image_url: "" },
  { name_es: "Mantequilla Jbel (por kilo)", name_fr: "Beurre Jbel (au kilo)", name_ar: "زبدة جبل بالكيلو", category: "Lácteos", unit_type: "kg", price_mad: 95.00, barcode: "", image_url: "" },
  { name_es: "Margarina Familia 250g", name_fr: "Margarine Familia 250g", name_ar: "مارغرين فاميليا 250 غ", category: "Lácteos", unit_type: "unid", price_mad: 9.00, barcode: "", image_url: "" },
  { name_es: "Lben (Leche agria) 1L", name_fr: "Lben (Lait fermenté) 1L", name_ar: "لبن 1 لتر", category: "Lácteos", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Harina Blanca Extra (5kg)", name_fr: "Farine Blanche Extra (5kg)", name_ar: "دقيق أبيض ممتاز 5 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 38.00, barcode: "", image_url: "" },
  { name_es: "Harina Blanca (25kg)", name_fr: "Farine Blanche (25kg)", name_ar: "دقيق أبيض خنشة 25 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 170.00, barcode: "", image_url: "" },
  { name_es: "Harina Finot (5kg)", name_fr: "Farine Finot (5kg)", name_ar: "دقيق الفينو 5 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 45.00, barcode: "", image_url: "" },
  { name_es: "Harina de Trigo Integral (kg)", name_fr: "Farine de Blé Complet (kg)", name_ar: "دقيق الزرع بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Sémola Fina (kg)", name_fr: "Semoule Fine (kg)", name_ar: "السميدة الرقيقة بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 11.00, barcode: "", image_url: "" },
  { name_es: "Sémola Gruesa (kg)", name_fr: "Semoule Grosse (kg)", name_ar: "السميدة الغليظة بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 11.00, barcode: "", image_url: "" },
  { name_es: "Cuscús Dari Fino 1kg", name_fr: "Couscous Dari Fin 1kg", name_ar: "كسكس داري رقيق 1 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Cuscús Dari Medio 1kg", name_fr: "Couscous Dari Moyen 1kg", name_ar: "كسكس داري متوسط 1 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Cuscús Tria 1kg", name_fr: "Couscous Tria 1kg", name_ar: "كسكس تريا 1 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Cuscús a granel (kg)", name_fr: "Couscous en vrac (kg)", name_ar: "كسكس العبار بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 11.00, barcode: "", image_url: "" },
  { name_es: "Lentejas (kg)", name_fr: "Lentilles (kg)", name_ar: "العدس بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 16.00, barcode: "", image_url: "" },
  { name_es: "Lentejas Beldi (kg)", name_fr: "Lentilles Beldi (kg)", name_ar: "العدس البلدي بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 22.00, barcode: "", image_url: "" },
  { name_es: "Garbanzos (kg)", name_fr: "Pois chiches (kg)", name_ar: "الحمص بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Alubias Blancas / Loubia (kg)", name_fr: "Haricots blancs (kg)", name_ar: "اللوبيا البيضاء بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 17.00, barcode: "", image_url: "" },
  { name_es: "Guisantes Secos / Jilbana (kg)", name_fr: "Petits pois secs (kg)", name_ar: "الجلبانة يابسة بالكيلo", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 20.00, barcode: "", image_url: "" },
  { name_es: "Habas Secas / Foul (kg)", name_fr: "Fèves sèches (kg)", name_ar: "الفول يابس بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 15.00, barcode: "", image_url: "" },
  { name_es: "Arroz Blanco (kg)", name_fr: "Riz Blanc (kg)", name_ar: "الروز الأبيض بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Arroz Amarillo (kg)", name_fr: "Riz Jaune / Étuve (kg)", name_ar: "الروز كلاصي بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 16.00, barcode: "", image_url: "" },
  { name_es: "Arroz Cigala 1kg", name_fr: "Riz Cigala 1kg", name_ar: "أرز سيكالا 1 كلغ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Pasta Fideo Fino (kg)", name_fr: "Cheveux d'ange (kg)", name_ar: "الشعرية رقيقة بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Pasta Macarrones (kg)", name_fr: "Macaronis en vrac (kg)", name_ar: "المقارونية بالكيلو", category: "Legumbres y Harinas", unit_type: "kg", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Espagueti Tria 500g", name_fr: "Spaghetti Tria 500g", name_ar: "سباغيتي تريا 500 غ", category: "Legumbres y Harinas", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Lesieur 1L", name_fr: "Huile Lesieur 1L", name_ar: "زيت لوسيور 1 لتر", category: "Aceites", unit_type: "unid", price_mad: 19.50, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Lesieur 2L", name_fr: "Huile Lesieur 2L", name_ar: "زيت لوسيور 2 لتر", category: "Aceites", unit_type: "unid", price_mad: 38.00, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Lesieur 5L", name_fr: "Huile Lesieur 5L", name_ar: "زيت لوسيور 5 لتر", category: "Aceites", unit_type: "unid", price_mad: 95.00, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Lio 1L", name_fr: "Huile Lio 1L", name_ar: "زيت ليو 1 لتر", category: "Aceites", unit_type: "unid", price_mad: 18.50, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Lio 5L", name_fr: "Huile Lio 5L", name_ar: "زيت ليو 5 لتر", category: "Aceites", unit_type: "unid", price_mad: 92.00, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Hala 1L", name_fr: "Taille Hala 1L", name_ar: "زيت هالة 1 لتر", category: "Aceites", unit_type: "unid", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Aceite de mesa Cristal 1L", name_fr: "Taille Cristal 1L", name_ar: "زيت كريسطال 1 لتر", category: "Aceites", unit_type: "unid", price_mad: 18.50, barcode: "", image_url: "" },
  { name_es: "Aceite de Oliva (Litro a granel)", name_fr: "Taille d olive en vrac (L)", name_ar: "زيت العود باللتر", category: "Aceites", unit_type: "kg", price_mad: 85.00, barcode: "", image_url: "" },
  { name_es: "Aceite de Oliva Oued Souss 1L", name_fr: "Taille d olive Oued Souss 1L", name_ar: "زيت الزيتون واد سوس 1 لتر", category: "Aceites", unit_type: "unid", price_mad: 90.00, barcode: "", image_url: "" },
  { name_es: "Aceite de Oliva Al Horra 1L", name_fr: "Taille d olive Al Horra 1L", name_ar: "زيت الزيتون الحرة 1 لتر", category: "Aceites", unit_type: "unid", price_mad: 95.00, barcode: "", image_url: "" },
  { name_es: "Azúcar en Pilón / Qalb (2kg)", name_fr: "Sucre en Pain / Qalb (2kg)", name_ar: "قالب السكر 2 كلغ", category: "Azúcar y Té", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Azúcar Granulado / Sanida 1kg", name_fr: "Sucre Semoule 1kg", name_ar: "سكر سنيدة 1 كلغ", category: "Azúcar y Té", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Azúcar en Terrones 1kg", name_fr: "Sucre en Morceaux 1kg", name_ar: "سكر قطع 1 كلغ", category: "Azúcar y Té", unit_type: "unid", price_mad: 11.50, barcode: "", image_url: "" },
  { name_es: "Té Sultan Shaara 125g", name_fr: "Thé Sultan Chaara 125g", name_ar: "شاي سلطان شعرة 125 غ", category: "Azúcar y Té", unit_type: "unid", price_mad: 12.00, barcode: "", image_url: "" },
  { name_es: "Té Sultan Shaara 250g", name_fr: "Thé Sultan Chaara 250g", name_ar: "شاي سلطان شعرة 250 غ", category: "Azúcar y Té", unit_type: "unid", price_mad: 23.00, barcode: "", image_url: "" },
  { name_es: "Té Wright El Kamas 125g", name_fr: "Thé Wright El Kamas 125g", name_ar: "شاي رغيت الخماس 125 غ", category: "Azúcar y Té", unit_type: "unid", price_mad: 13.50, barcode: "", image_url: "" },
  { name_es: "Té Sbaa (El León) 200g", name_fr: "Thé Sbaa (Le Lion) 200g", name_ar: "شاي السبع 200 غ", category: "Azúcar y Té", unit_type: "unid", price_mad: 15.00, barcode: "", image_url: "" },
  { name_es: "Té Al Belar 200g", name_fr: "Thé Al Bollar 200g", name_ar: "شاي البلور 200 غ", category: "Azúcar y Té", unit_type: "unid", price_mad: 16.00, barcode: "", image_url: "" },
  { name_es: "Té Lipton Amarillo 100 bolsitas", name_fr: "Thé Lipton Jaune 100 sach.", name_ar: "شاي ليبتون 100 كيس", category: "Azúcar y Té", unit_type: "unid", price_mad: 35.00, barcode: "", image_url: "" },
  { name_es: "Hierbabuena / Na3na3 (Manojo)", name_fr: "Menthe / Na3na3 (Botte)", name_ar: "قبطة نعناع", category: "Hierbas", unit_type: "unid", price_mad: 1.50, barcode: "", image_url: "" },
  { name_es: "Absenta / Chiba (Manojo)", name_fr: "Absinthe / Chiba (Botte)", name_ar: "قبطة شيبة", category: "Hierbas", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Café Molido Samar 250g", name_fr: "Café moulu Samar 250g", name_ar: "قهوة سمر 250 غ", category: "Café", unit_type: "unid", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Café Molido Carrion 250g", name_fr: "Café moulu Carrion 250g", name_ar: "قهوة كاريون 250 غ", category: "Café", unit_type: "unid", price_mad: 19.00, barcode: "", image_url: "" },
  { name_es: "Café Molido Dubois 250g", name_fr: "Café moulu Dubois 250g", name_ar: "قهوة ديبوا 250 غ", category: "Café", unit_type: "unid", price_mad: 17.50, barcode: "", image_url: "" },
  { name_es: "Café Molido Astaa 250g", name_fr: "Café moulu Astaa 250g", name_ar: "قهوة أسطا 250 غ", category: "Café", unit_type: "unid", price_mad: 18.00, barcode: "", image_url: "" },
  { name_es: "Nescafé Classic 100g", name_fr: "Nescafé Classic 100g", name_ar: "نسكافيه كلاسيك 100 غ", category: "Café", unit_type: "unid", price_mad: 34.00, barcode: "", image_url: "" },
  { name_es: "Nescafé Classic (Sobre individual)", name_fr: "Nescafé Classic (Sachet)", name_ar: "صاشي نسكافيه صغير", category: "Café", unit_type: "unid", price_mad: 1.50, barcode: "", image_url: "" },
  { name_es: "Cacao en polvo Caobel 250g", name_fr: "Cacao en poudre Caobel 250g", name_ar: "كاوبيل 250 غ", category: "Desayuno", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Cacao Nesquik 300g", name_fr: "Cacao Nesquik 300g", name_ar: "نسكويك 300 غ", category: "Desayuno", unit_type: "unid", price_mad: 28.00, barcode: "", image_url: "" },
  { name_es: "Mermelada Aïcha Fresa 370g", name_fr: "Confiture Aïcha Fraise 370g", name_ar: "كونفيتير عيشة فريز 370 غ", category: "Desayuno", unit_type: "unid", price_mad: 14.50, barcode: "", image_url: "" },
  { name_es: "Mermelada Aïcha Albaricoque 370g", name_fr: "Confiture Aïcha Abricot 370g", name_ar: "كونفيتير عيشة مشماش 370 غ", category: "Desayuno", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Mermelada Vrac (kg)", name_fr: "Confiture Vrac (kg)", name_ar: "كونفيتير العبار بالكيلو", category: "Desayuno", unit_type: "kg", price_mad: 20.00, barcode: "", image_url: "" },
  { name_es: "Crema de Chocolate Maruja", name_fr: "Pâte à tartiner Maruja", name_ar: "شوكولا ماروجا للدهن", category: "Desayuno", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Nutella 400g", name_fr: "Nutella 400g", name_ar: "نوتيلا 400 غ", category: "Desayuno", unit_type: "unid", price_mad: 45.00, barcode: "", image_url: "" },
  { name_es: "Miel de Flores (Bote)", name_fr: "Miel de Fleurs (Pot)", name_ar: "عسل الزهور", category: "Desayuno", unit_type: "unid", price_mad: 30.00, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Sidi Ali 1.5L", name_fr: "Eau Sidi Ali 1.5L", name_ar: "ماء سيدي علي 1.5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 6.00, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Sidi Ali 5L", name_fr: "Eau Sidi Ali 5L", name_ar: "ماء سيدي علي 5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Ain Saiss 1.5L", name_fr: "Eau Ain Saiss 1.5L", name_ar: "ماء عين سايس 1.5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 5.50, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Ain Saiss 5L", name_fr: "Eau Ain Saiss 5L", name_ar: "ماء عين سايس 5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Sidi Harazem 1.5L", name_fr: "Eau Sidi Harazem 1.5L", name_ar: "ماء سيدي حرازم 1.5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 5.50, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Ain Atlas 1.5L", name_fr: "Eau Ain Atlas 1.5L", name_ar: "ماء عين أطلس 1.5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 5.50, barcode: "", image_url: "" },
  { name_es: "Agua Mineral Bahia 5L", name_fr: "Eau Bahia 5L", name_ar: "ماء باهية 5 لتر", category: "Bebidas", unit_type: "unid", price_mad: 10.00, barcode: "", image_url: "" },
  { name_es: "Agua con Gas Oulmès 1L", name_fr: "Eau Gazeuse Oulmès 1L", name_ar: "ماء والماس 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 6.50, barcode: "", image_url: "" },
  { name_es: "Agua con Gas Oulmès Lata", name_fr: "Eau Gazeuse Oulmès Canette", name_ar: "والماس كانيط", category: "Bebidas", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Coca-Cola Original 1L", name_fr: "Coca-Cola Original 1L", name_ar: "كوكاكولا 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Coca-Cola Original 2L", name_fr: "Coca-Cola Original 2L", name_ar: "كوكاكولا 2 لتر", category: "Bebidas", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Coca-Cola Lata 33cl", name_fr: "Coca-Cola Canette 33cl", name_ar: "كوكاكولا كانيط", category: "Bebidas", unit_type: "unid", price_mad: 5.50, barcode: "", image_url: "" },
  { name_es: "Coca-Cola Cristal Pequeña", name_fr: "Coca-Cola Verre (Petit)", name_ar: "كوكاكولا قرعة دجاج", category: "Bebidas", unit_type: "unid", price_mad: 3.00, barcode: "", image_url: "" },
  { name_es: "Hawai Tropical 1L", name_fr: "Hawai Tropical 1L", name_ar: "هاواي 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Hawai Lata 33cl", name_fr: "Hawai Canette 33cl", name_ar: "هاواي كانيط", category: "Bebidas", unit_type: "unid", price_mad: 5.50, barcode: "", image_url: "" },
  { name_es: "Poms Manzana 1L", name_fr: "Poms Pomme 1L", name_ar: "بومز 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Poms Lata 33cl", name_fr: "Poms Canette 33cl", name_ar: "بومز كانيط", category: "Bebidas", unit_type: "unid", price_mad: 5.50, barcode: "", image_url: "" },
  { name_es: "Sprite 1L", name_fr: "Sprite 1L", name_ar: "سبرايت 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Fanta Naranja 1L", name_fr: "Fanta Orange 1L", name_ar: "فانتا برتقال 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Schweppes Citron 1L", name_fr: "Schweppes Citron 1L", name_ar: "شويبس حامض 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 8.50, barcode: "", image_url: "" },
  { name_es: "Zumo Al Bustan Naranja 1L", name_fr: "Jus Al Bustan Orange 1L", name_ar: "عصير البستان برتقال 1 لتر", category: "Bebidas", unit_type: "unid", price_mad: 11.00, barcode: "", image_url: "" },
  { name_es: "Zumo Miami Naranja", name_fr: "Jus Miami Orange", name_ar: "عصير ميامي", category: "Bebidas", unit_type: "unid", price_mad: 3.00, barcode: "", image_url: "" },
  { name_es: "Tomate Concentrado Aïcha (Peq)", name_fr: "Tomate Concentrée Aïcha (Pt)", name_ar: "مطيشة الحك عيشة صغيرة", category: "Conservas", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Tomate Concentrado Aïcha (Med)", name_fr: "Tomate Concentrée Aïcha (Moy)", name_ar: "مطيشة الحك عيشة متوسطة", category: "Conservas", unit_type: "unid", price_mad: 12.00, barcode: "", image_url: "" },
  { name_es: "Tomate Concentrado Aïcha (Gde)", name_fr: "Tomate Concentrée Aïcha (Gde)", name_ar: "مطيشة الحك عيشة كبيرة", category: "Conservas", unit_type: "unid", price_mad: 22.00, barcode: "", image_url: "" },
  { name_es: "Atún Tam en Aceite", name_fr: "Thon Tam à lhuile", name_ar: "طون تام بالزيت", category: "Conservas", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Atún Mario en Aceite", name_fr: "Thon Mario à lhuile", name_ar: "طون ماريو بالزيت", category: "Conservas", unit_type: "unid", price_mad: 8.50, barcode: "", image_url: "" },
  { name_es: "Atún Isabel", name_fr: "Thon Isabel", name_ar: "طون إيزابيل", category: "Conservas", unit_type: "unid", price_mad: 9.50, barcode: "", image_url: "" },
  { name_es: "Atún Jolly", name_fr: "Thon Jolly", name_ar: "طون جولي", category: "Conservas", unit_type: "unid", price_mad: 7.50, barcode: "", image_url: "" },
  { name_es: "Sardinas en Aceite (Marilyn/Josiane)", name_fr: "Sardines à lhuile", name_ar: "سردين معلب بالزيت", category: "Conservas", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Sardinas en Tomate", name_fr: "Sardines à la sauce tomate", name_ar: "سردين معلب بمطيشة", category: "Conservas", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Caballa / Maquereau en lata", name_fr: "Maquereau en conserve", name_ar: "كابايلة معلبة", category: "Conservas", unit_type: "unid", price_mad: 6.50, barcode: "", image_url: "" },
  { name_es: "Maíz Dulce (Lata)", name_fr: "Maïs Doux (Boîte)", name_ar: "ذرة معلبة (الماييس)", category: "Conservas", unit_type: "unid", price_mad: 11.00, barcode: "", image_url: "" },
  { name_es: "Champiñones enteros (Lata)", name_fr: "Champignons entiers (Boîte)", name_ar: "شومبنيون معلب", category: "Conservas", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Levadura Royal (Polvo de hornear)", name_fr: "Levure Royal (Chimique)", name_ar: "خميرة الحلوى (حمراء)", category: "Cocina", unit_type: "unid", price_mad: 0.50, barcode: "", image_url: "" },
  { name_es: "Levadura de panadero Frita / Alsa", name_fr: "Levure Boulangère Idéal", name_ar: "خميرة العجينة", category: "Cocina", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Azúcar Vainillado Alsa", name_fr: "Sucre Vanillé Alsa", name_ar: "سكر فانيلا (بيضاء)", category: "Cocina", unit_type: "unid", price_mad: 0.50, barcode: "", image_url: "" },
  { name_es: "Cacao en polvo Ideal (Sobre)", name_fr: "Cacao poudre Idéal (Sachet)", name_ar: "كاكاو إيديال صاشي", category: "Cocina", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Sal Marina Fina (kg)", name_fr: "Sel Fin (kg)", name_ar: "الملحة رقيقة", category: "Especias (Attaria)", unit_type: "kg", price_mad: 2.00, barcode: "", image_url: "" },
  { name_es: "Pimienta Negra / Bzar (kg)", name_fr: "Poivre Noir / Bzar (kg)", name_ar: "ابزار كحل بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 95.00, barcode: "", image_url: "" },
  { name_es: "Comino / Kamoun (kg)", name_fr: "Cumin / Kamoun (kg)", name_ar: "الكامون البلدي بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 120.00, barcode: "", image_url: "" },
  { name_es: "Jengibre / Skinejbir (kg)", name_fr: "Gingembre / Skinejbir (kg)", name_ar: "سكينجبير بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 80.00, barcode: "", image_url: "" },
  { name_es: "Cúrcuma / Karkoum (kg)", name_fr: "Curcuma / Karkoum (kg)", name_ar: "الخرقوم عرق بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 60.00, barcode: "", image_url: "" },
  { name_es: "Pimentón / Tahmira (kg)", name_fr: "Paprika / Tahmira (kg)", name_ar: "التحميرة بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 50.00, barcode: "", image_url: "" },
  { name_es: "Canela en polvo / Qerfa (kg)", name_fr: "Cannelle en poudre / Qerfa (kg)", name_ar: "القرفة مطحونة بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 90.00, barcode: "", image_url: "" },
  { name_es: "Canela en rama (kg)", name_fr: "Cannelle en bâton (kg)", name_ar: "القرفة عواد بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 110.00, barcode: "", image_url: "" },
  { name_es: "Azafrán colorante (Sobre)", name_fr: "Colorant alimentaire (Sachet)", name_ar: "الزعفران الملون (كاغيط)", category: "Especias (Attaria)", unit_type: "unid", price_mad: 0.50, barcode: "", image_url: "" },
  { name_es: "Azafrán puro / Zaafran lhor (gramo)", name_fr: "Safran pur / Zaafran lhor (gramme)", name_ar: "الزعفران الحر بالغرام", category: "Especias (Attaria)", unit_type: "kg", price_mad: 30.00, barcode: "", image_url: "" },
  { name_es: "Ras el Hanout (kg)", name_fr: "Ras el Hanout (kg)", name_ar: "رأس الحانوت بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 150.00, barcode: "", image_url: "" },
  { name_es: "Sésamo / Jenjlan (kg)", name_fr: "Sésame / Jenjlan (kg)", name_ar: "الزنجلان بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 55.00, barcode: "", image_url: "" },
  { name_es: "Semillas de hinojo / Nafa3 (kg)", name_fr: "Graines de fenouil / Nafa3 (kg)", name_ar: "النافع بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 60.00, barcode: "", image_url: "" },
  { name_es: "Semillas de anís / Habat hlawa (kg)", name_fr: "Anis / Habat hlawa (kg)", name_ar: "حبة حلاوة بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 70.00, barcode: "", image_url: "" },
  { name_es: "Comino en grano (kg)", name_fr: "Cumin en grains (kg)", name_ar: "الكامون حبوب بالكيلو", category: "Especias (Attaria)", unit_type: "kg", price_mad: 110.00, barcode: "", image_url: "" },
  { name_es: "Galletas Henry's", name_fr: "Biscuits Henry's", name_ar: "هينريس بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Galletas Tonic", name_fr: "Biscuits Tonic", name_ar: "تونيك بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Galletas Tango", name_fr: "Biscuits Tango", name_ar: "طانكو بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Galletas Golden", name_fr: "Biscuits Golden", name_ar: "كولدن بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.50, barcode: "", image_url: "" },
  { name_es: "Galletas Momo", name_fr: "Biscuits Momo", name_ar: "مومو بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Galletas Tagger", name_fr: "Biscuits Tagger", name_ar: "طاكير بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.50, barcode: "", image_url: "" },
  { name_es: "Galletas Okey", name_fr: "Biscuits Okey", name_ar: "أوكي بيمو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Merendina", name_fr: "Merendina", name_ar: "ميراندينا", category: "Snacks", unit_type: "unid", price_mad: 1.50, barcode: "", image_url: "" },
  { name_es: "Genova", name_fr: "Genova", name_ar: "جينوفا", category: "Snacks", unit_type: "unid", price_mad: 2.00, barcode: "", image_url: "" },
  { name_es: "Bolo", name_fr: "Bolo", name_ar: "بولو", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Chocolatina Silvia", name_fr: "Chocolat Silvia", name_ar: "شوكولا سيلفيا", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Kinder Bueno", name_fr: "Kinder Bueno", name_ar: "كيندر بوينو", category: "Snacks", unit_type: "unid", price_mad: 10.00, barcode: "", image_url: "" },
  { name_es: "KitKat 4 dedos", name_fr: "KitKat 4 barres", name_ar: "كيت كات", category: "Snacks", unit_type: "unid", price_mad: 6.50, barcode: "", image_url: "" },
  { name_es: "Snickers", name_fr: "Snickers", name_ar: "سنيكرز", category: "Snacks", unit_type: "unid", price_mad: 8.00, barcode: "", image_url: "" },
  { name_es: "Chips Eyoo Naranja", name_fr: "Chips Eyoo Orange", name_ar: "شيبس إيو (ليموني)", category: "Snacks", unit_type: "unid", price_mad: 2.00, barcode: "", image_url: "" },
  { name_es: "Chips Eyoo Queso", name_fr: "Chips Eyoo Fromage", name_ar: "شيبس إيو بالفرماج", category: "Snacks", unit_type: "unid", price_mad: 2.00, barcode: "", image_url: "" },
  { name_es: "Chips Lays Sal", name_fr: "Chips Lays Sel", name_ar: "شيبس لايز بالملح", category: "Snacks", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Pringles Original", name_fr: "Pringles Original", name_ar: "برينجلز", category: "Snacks", unit_type: "unid", price_mad: 25.00, barcode: "", image_url: "" },
  { name_es: "Caramelos (por unidad)", name_fr: "Bonbons (unité)", name_ar: "فنيدة / حلوى", category: "Snacks", unit_type: "unid", price_mad: 0.50, barcode: "", image_url: "" },
  { name_es: "Chicle Flash", name_fr: "Chewing-gum Flash", name_ar: "مسكة فلاش", category: "Snacks", unit_type: "unid", price_mad: 0.50, barcode: "", image_url: "" },
  { name_es: "Chicle Clorets", name_fr: "Chewing-gum Clorets", name_ar: "مسكة كلوريتس", category: "Snacks", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Almendras / Louz (kg)", name_fr: "Amandes / Louz (kg)", name_ar: "اللوز بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 100.00, barcode: "", image_url: "" },
  { name_es: "Nueces / Garga3 (kg)", name_fr: "Noix / Garga3 (kg)", name_ar: "الكركاع بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 90.00, barcode: "", image_url: "" },
  { name_es: "Cacahuetes / Kawkaw (kg)", name_fr: "Cacahuètes / Kawkaw (kg)", name_ar: "كاوكاو بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 35.00, barcode: "", image_url: "" },
  { name_es: "Pipas de girasol / Zeri3a (kg)", name_fr: "Graines de tournesol (kg)", name_ar: "الزريعة الكحلة بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 30.00, barcode: "", image_url: "" },
  { name_es: "Pipas de calabaza / Zeri3a bida (kg)", name_fr: "Graines de citrouille (kg)", name_ar: "الزريعة البيضاء بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 60.00, barcode: "", image_url: "" },
  { name_es: "Pasas / Zbib (kg)", name_fr: "Raisins secs / Zbib (kg)", name_ar: "الزبيب بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 50.00, barcode: "", image_url: "" },
  { name_es: "Dátiles Majhoul (kg)", name_fr: "Dattes Majhoul (kg)", name_ar: "التمر المجهول بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 120.00, barcode: "", image_url: "" },
  { name_es: "Dátiles normales (kg)", name_fr: "Dattes (kg)", name_ar: "التمر العادي بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 25.00, barcode: "", image_url: "" },
  { name_es: "Higos secos / Chriha (kg)", name_fr: "Figues sèches / Chriha (kg)", name_ar: "الشريحة بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 60.00, barcode: "", image_url: "" },
  { name_es: "Pistachos (kg)", name_fr: "Pistaches (kg)", name_ar: "البيستاش بالكيلو", category: "Frutos Secos", unit_type: "kg", price_mad: 180.00, barcode: "", image_url: "" },
  { name_es: "Jabón El Keff (Pastilla)", name_fr: "Savon El Keff (Pain)", name_ar: "صابون الكف الحجرة", category: "Limpieza", unit_type: "unid", price_mad: 4.50, barcode: "", image_url: "" },
  { name_es: "Jabón Taous (Pastilla)", name_fr: "Savon Taous (Pain)", name_ar: "صابون الطاووس", category: "Limpieza", unit_type: "unid", price_mad: 5.00, barcode: "", image_url: "" },
  { name_es: "Detergente polvo Tide 500g", name_fr: "Lessive poudre Tide 500g", name_ar: "تيد مسحوق غسيل 500 غ", category: "Limpieza", unit_type: "unid", price_mad: 13.00, barcode: "", image_url: "" },
  { name_es: "Detergente polvo Omo 500g", name_fr: "Lessive poudre Omo 500g", name_ar: "أومو مسحوق غسيل 500 غ", category: "Limpieza", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Detergente polvo Ariel 500g", name_fr: "Lessive poudre Ariel 500g", name_ar: "ارييل مسحوق غسيل 500 غ", category: "Limpieza", unit_type: "unid", price_mad: 16.00, barcode: "", image_url: "" },
  { name_es: "Detergente polvo Magix 500g", name_fr: "Lessive poudre Magix 500g", name_ar: "ماجيكس مسحوق غسيل 500 غ", category: "Limpieza", unit_type: "unid", price_mad: 10.00, barcode: "", image_url: "" },
  { name_es: "Detergente líquido Onya", name_fr: "Lessive liquide Onya", name_ar: "أونيا سائل للماكينة", category: "Limpieza", unit_type: "unid", price_mad: 40.00, barcode: "", image_url: "" },
  { name_es: "Lavatrastes pasta Onyx (Tarrina)", name_fr: "Pâte vaisselle Onyx", name_ar: "أونيكس لغسيل الأواني", category: "Limpieza", unit_type: "unid", price_mad: 7.00, barcode: "", image_url: "" },
  { name_es: "Lavatrastes líquido Mio 1L", name_fr: "Liquide vaisselle Mio 1L", name_ar: "ميو سائل الأواني 1 لتر", category: "Limpieza", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Lavatrastes líquido Maxis 1L", name_fr: "Liquide vaisselle Maxis 1L", name_ar: "ماكسيس سائل الأواني 1 لتر", category: "Limpieza", unit_type: "unid", price_mad: 12.00, barcode: "", image_url: "" },
  { name_es: "Agua de Javel Atika 1L", name_fr: "Eau de Javel Atika 1L", name_ar: "جافيل عتيقة 1 لتر", category: "Limpieza", unit_type: "unid", price_mad: 6.00, barcode: "", image_url: "" },
  { name_es: "Agua de Javel La Croix 1L", name_fr: "Eau de Javel La Croix 1L", name_ar: "جافيل لاكروا 1 لتر", category: "Limpieza", unit_type: "unid", price_mad: 7.50, barcode: "", image_url: "" },
  { name_es: "Limpiador de suelos Sanicero", name_fr: "Nettoyant sol Sanicero", name_ar: "سانيكروا لتسييق", category: "Limpieza", unit_type: "unid", price_mad: 11.00, barcode: "", image_url: "" },
  { name_es: "Esponja salvaúñas", name_fr: "Éponge grattoir", name_ar: "جيكس حلفة الأواني", category: "Limpieza", unit_type: "unid", price_mad: 2.00, barcode: "", image_url: "" },
  { name_es: "Estropajo de aluminio (Jiks)", name_fr: "Paille de fer (Jiks)", name_ar: "الجيكس سلك", category: "Limpieza", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Bolsas de basura (Paquete)", name_fr: "Sacs poubelle (Paquet)", name_ar: "ميكات الزبل", category: "Limpieza", unit_type: "unid", price_mad: 12.00, barcode: "", image_url: "" },
  { name_es: "Rollo de papel higiénico", name_fr: "Papier hygiénique (Rouleau)", name_ar: "بابيي جينيك (رولو)", category: "Limpieza", unit_type: "unid", price_mad: 2.50, barcode: "", image_url: "" },
  { name_es: "Pañuelos de papel Minty", name_fr: "Mouchoirs Minty", name_ar: "كلينيكس مينتي", category: "Limpieza", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Champú Cadum", name_fr: "Shampooing Cadum", name_ar: "شامبوان كادوم", category: "Cuidado Personal", unit_type: "unid", price_mad: 14.00, barcode: "", image_url: "" },
  { name_es: "Champú Cadum (Sobre)", name_fr: "Shampooing Cadum (Sachet)", name_ar: "شامبوان كادوم صاشي", category: "Cuidado Personal", unit_type: "unid", price_mad: 1.00, barcode: "", image_url: "" },
  { name_es: "Champú Clear", name_fr: "Shampooing Clear", name_ar: "شامبوان كلير", category: "Cuidado Personal", unit_type: "unid", price_mad: 16.00, barcode: "", image_url: "" },
];

export default function GlobalProductsPage() {
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<GlobalProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [tenantIds, setTenantIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    nameEs: '',
    nameFr: '',
    nameAr: '',
    category: '',
    price: '',
    unitType: 'PIEZA',
    barcode: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/global-productos');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching global products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    setUploading(true);
    try {
      const res = await fetch('/api/global-productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: defaultProducts,
          action: 'bulk',
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error bulk upload:', error);
      alert('Error al cargar productos');
    } finally {
      setUploading(false);
      setShowBulkModal(false);
    }
  };

  const handleDistribute = async () => {
    if (tenantIds.length === 0) {
      alert('Selecciona al menos una tienda');
      return;
    }

    try {
      const res = await fetch('/api/global-productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'distribute',
          tenantIds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Productos distribuidos correctamente');
        setShowDistributeModal(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error distributing:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      let res;
      if (editingProduct) {
        res = await fetch('/api/global-productos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingProduct.id }),
        });
      } else {
        res = await fetch('/api/global-productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        alert(editingProduct ? 'Producto actualizado' : 'Producto creado');
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar producto');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto global?')) return;

    try {
      const res = await fetch(`/api/global-productos?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditModal = (product: GlobalProduct) => {
    setEditingProduct(product);
    setFormData({
      nameEs: product.nameEs,
      nameFr: product.nameFr || '',
      nameAr: product.nameAr || '',
      category: product.category,
      price: product.price.toString(),
      unitType: product.unitType,
      barcode: product.barcode || '',
      imageUrl: product.imageUrl || '',
    });
    setImagePreview(product.imageUrl || null);
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      nameEs: '',
      nameFr: '',
      nameAr: '',
      category: '',
      price: '',
      unitType: 'PIEZA',
      barcode: '',
      imageUrl: '',
    });
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nameEs.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const getUnitLabel = (unitType: string) => {
    switch (unitType) {
      case 'KILO': return '/kg';
      case 'GRAMO': return '/g';
      case 'LITRO': return '/L';
      default: return '/ud';
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="SUPERADMIN" />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Productos Globales</h1>
            </div>
            <p className="text-gray-500 mt-1">Catálogo de productos para todas las tiendas</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowDistributeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4" />
              Distribuir a Tiendas
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Package className="w-4 h-4" />
              Cargar Productos
            </button>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setSearch('')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
          >
            Todos ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSearch(cat)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Imagen</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nombre (ES)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Categoría</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Precio</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Unidad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Código</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.nameEs} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{product.nameEs}</td>
                    <td className="px-4 py-3 text-gray-500">{product.category}</td>
                    <td className="px-4 py-3 font-medium">{product.price.toFixed(2)} MAD</td>
                    <td className="px-4 py-3 text-gray-500">{getUnitLabel(product.unitType)}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-sm">{product.barcode || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No hay productos globales. ¡Carga el catálogo completo!
              </div>
            )}
          </div>
        )}
      </main>

      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Cargar Productos Globales</h2>
            <p className="text-gray-600 mb-6">
              Se cargarán <strong>{defaultProducts.length}</strong> productos predefinedos al catálogo global.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Cargando...' : 'Cargar Productos'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDistributeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Distribuir a Tiendas</h2>
            <p className="text-gray-600 mb-4">
              Selecciona las tiendas que recibirán los productos globales.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Esta función distribuirá {products.length} productos a las tiendas seleccionadas.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IDs de tiendas (separados por coma)
              </label>
              <input
                type="text"
                value={tenantIds.join(',')}
                onChange={(e) => setTenantIds(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                placeholder="tenant1, tenant2, tenant3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDistributeModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleDistribute}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Distribuir
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Editar Producto Global' : 'Nuevo Producto Global'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (Español)</label>
                <input
                  type="text"
                  value={formData.nameEs}
                  onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (Francés)</label>
                  <input
                    type="text"
                    value={formData.nameFr}
                    onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (Árabe)</label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio (MAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Unidad</label>
                  <select
                    value={formData.unitType}
                    onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="PIEZA">Unidad</option>
                    <option value="KILO">Kilo</option>
                    <option value="GRAMO">Gramo</option>
                    <option value="LITRO">Litro</option>
                    <option value="UNID">Unidad (Unid)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    list="categories"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <datalist id="categories">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Image className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-primary hover:underline"
                  >
                    Seleccionar imagen
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}