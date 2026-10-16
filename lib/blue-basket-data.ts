export type StarterRow = { name: string; press: string; washPress: string; dryClean: string };
export const blueBasketCategories: { name: string; rows: StarterRow[] }[] = [
  { name: "MEN", rows: [
    ["Shirt","3.00","5.00","8.00"], ["T-Shirt","3.00","5.00","8.00"], ["Trouser","3.00","5.00","8.00"], ["Trouser-Short","3.00","5.00","8.00"], ["Kandura","6.00","10.00","15.00"], ["Jalabiah","5.00","8.00","12.00"], ["Gutrah","4.00","6.00","10.00"], ["Suit 2 Piece","10.00","-","20.00"], ["Track Suit Pant-Jogger","3.00","5.00","8.00"], ["Punjabi 2 Piece","8.00","12.00","15.00"], ["Pajamas 2 Piece","6.00","10.00","15.00"], ["Doctor Coat","5.00","8.00","12.00"], ["Cap / Tie / Socks","3.00","4.00","5.00"]
  ].map(([name, press, washPress, dryClean]) => ({ name, press, washPress, dryClean })) },
  { name: "LADIES", rows: [
    ["Abaya","8.00","10.00","15.00"], ["Jalabiah","5.00","8.00","12.00"], ["Shela/Scarf","3.00","5.00","8.00"], ["Dress","4.00","8.00","12.00"], ["Salwar Kameez 2 piece","8.00","12.00","15.00"], ["Saree","8/15/20","16.00","15/20/25"], ["Polo","3.00","5.00","8.00"], ["Blouse","4.00","5.00","8.00"], ["Vest","3.00","5.00","8.00"], ["Silk Blouse","5.00","8.00","12.00"], ["Skirt","4/7","-","8/12"], ["Jeans","4.00","6.00","8.00"]
  ].map(([name, press, washPress, dryClean]) => ({ name, press, washPress, dryClean })) },
  { name: "GENERAL", rows: [
    ["Shoe Clean","As per quality","",""], ["Bath Towel (Small)","","4.00","6.00"], ["Bath Towel (Large)","6.00","8.00","8.00"], ["Bed Sheet (Single)","5.00","8.00","10.00"], ["Bed Sheet (Double)","5.00","10.00","12.00"], ["Blanket","","10/15/20","20/25/30"], ["Duvet Cover (Single)","4.00","8.00","12.00"], ["Duvet Cover (Double)","8.00","10.00","15.00"], ["Curtain (Asp)","-","-","-"], ["Carpet (Asp)","-","-","-"]
  ].map(([name, press, washPress, dryClean]) => ({ name, press, washPress, dryClean })) }
];
