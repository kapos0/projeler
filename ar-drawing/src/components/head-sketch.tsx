import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';

export const HEAD_DRAWING_STEPS = [
  'Kafa için oval kılavuzunu çiz',
  'Çene hattını belirle',
  'Kulakları ekle',
  'Boyun çizgilerini yerleştir',
  'Yüzün orta eksenini çiz',
  'Göz hizasını çiz',
  'Sol göz şeklini çiz',
  'Sağ göz şeklini çiz',
  'İrisleri ve göz bebeklerini ekle',
  'Kaşları yerleştir',
  'Burnun ana formunu çiz',
  'Burun deliklerini ekle',
  'Ağız çizgisini yerleştir',
  'Dudak formunu tamamla',
  'Saç çizgisini belirle',
  'Saç kütlesini ekle',
  'Saç tellerini ve kulak detaylarını çiz',
  'Yüz gölgelerini ekle',
  'Boyun ve omuzları tamamla',
  'Son kontur ve detayları güçlendir',
] as const;

type HeadSketchProps = {
  step: number;
};

const stroke = '#2f2724';
const lightStroke = '#76645c';

export function HeadSketch({ step }: HeadSketchProps) {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 520">
      {/* Her parça kendinden önceki adımlarla birlikte görünür; böylece çizim katman katman ilerler. */}
      {step >= 0 && (
        <Ellipse cx="200" cy="235" rx="125" ry="165" fill="none" stroke={lightStroke} strokeWidth="3" />
      )}
      {step >= 1 && (
        <Path d="M92 305 Q115 405 200 420 Q285 405 308 305" fill="none" stroke={stroke} strokeWidth="4" />
      )}
      {step >= 2 && (
        <>
          <Path d="M78 220 Q45 215 57 285 Q65 315 91 292" fill="none" stroke={stroke} strokeWidth="4" />
          <Path d="M322 220 Q355 215 343 285 Q335 315 309 292" fill="none" stroke={stroke} strokeWidth="4" />
        </>
      )}
      {step >= 3 && (
        <>
          <Path d="M145 385 L132 485" fill="none" stroke={stroke} strokeWidth="4" />
          <Path d="M255 385 L268 485" fill="none" stroke={stroke} strokeWidth="4" />
        </>
      )}
      {step >= 4 && <Line x1="200" y1="70" x2="200" y2="405" stroke={lightStroke} strokeWidth="2" strokeDasharray="8 8" />}
      {step >= 5 && <Path d="M82 220 Q200 195 318 220" fill="none" stroke={lightStroke} strokeWidth="2" strokeDasharray="8 8" />}
      {step >= 6 && <Path d="M105 235 Q145 205 181 237 Q145 270 105 235" fill="none" stroke={stroke} strokeWidth="4" />}
      {step >= 7 && <Path d="M219 237 Q255 205 295 235 Q255 270 219 237" fill="none" stroke={stroke} strokeWidth="4" />}
      {step >= 8 && (
        <>
          <Circle cx="145" cy="237" r="12" fill="none" stroke={stroke} strokeWidth="3" />
          <Circle cx="255" cy="237" r="12" fill="none" stroke={stroke} strokeWidth="3" />
          <Circle cx="145" cy="237" r="4" fill={stroke} />
          <Circle cx="255" cy="237" r="4" fill={stroke} />
        </>
      )}
      {step >= 9 && (
        <>
          <Path d="M105 190 Q145 165 181 190" fill="none" stroke={stroke} strokeWidth="7" />
          <Path d="M219 190 Q255 165 295 190" fill="none" stroke={stroke} strokeWidth="7" />
        </>
      )}
      {step >= 10 && <Path d="M200 235 Q180 305 190 325 Q200 335 215 322" fill="none" stroke={stroke} strokeWidth="4" />}
      {step >= 11 && (
        <>
          <Path d="M179 325 Q190 335 200 326" fill="none" stroke={stroke} strokeWidth="3" />
          <Path d="M200 326 Q210 335 221 325" fill="none" stroke={stroke} strokeWidth="3" />
        </>
      )}
      {step >= 12 && <Path d="M145 360 Q200 345 255 360" fill="none" stroke={stroke} strokeWidth="4" />}
      {step >= 13 && (
        <>
          <Path d="M145 360 Q200 385 255 360" fill="none" stroke={stroke} strokeWidth="4" />
          <Path d="M165 365 Q200 374 235 365" fill="none" stroke={lightStroke} strokeWidth="2" />
        </>
      )}
      {step >= 14 && <Path d="M82 185 Q100 80 200 62 Q300 80 318 185" fill="none" stroke={stroke} strokeWidth="6" />}
      {step >= 15 && <Path d="M82 185 Q70 90 135 55 Q215 10 300 65 Q330 105 318 185 Q285 135 250 122 Q170 92 82 185" fill="none" stroke={stroke} strokeWidth="4" />}
      {step >= 16 && (
        <>
          <Path d="M100 145 Q125 72 170 55" fill="none" stroke={lightStroke} strokeWidth="3" />
          <Path d="M130 135 Q170 55 220 48" fill="none" stroke={lightStroke} strokeWidth="3" />
          <Path d="M220 48 Q285 55 310 140" fill="none" stroke={lightStroke} strokeWidth="3" />
          <Path d="M65 250 Q75 270 86 278" fill="none" stroke={lightStroke} strokeWidth="3" />
        </>
      )}
      {step >= 17 && (
        <>
          <Path d="M115 290 Q135 315 150 320" fill="none" stroke={lightStroke} strokeWidth="3" />
          <Path d="M285 290 Q265 315 250 320" fill="none" stroke={lightStroke} strokeWidth="3" />
          <Path d="M115 330 Q135 350 150 350" fill="none" stroke={lightStroke} strokeWidth="3" />
        </>
      )}
      {step >= 18 && (
        <>
          <Path d="M132 410 Q200 445 268 410" fill="none" stroke={stroke} strokeWidth="4" />
          <Path d="M132 410 Q105 445 95 485" fill="none" stroke={stroke} strokeWidth="4" />
          <Path d="M268 410 Q295 445 305 485" fill="none" stroke={stroke} strokeWidth="4" />
        </>
      )}
      {step >= 19 && (
        <>
          <Path d="M91 292 Q75 320 98 335" fill="none" stroke={stroke} strokeWidth="3" />
          <Path d="M309 292 Q325 320 302 335" fill="none" stroke={stroke} strokeWidth="3" />
          <Path d="M115 375 Q200 400 285 375" fill="none" stroke={lightStroke} strokeWidth="2" />
        </>
      )}
    </Svg>
  );
}
