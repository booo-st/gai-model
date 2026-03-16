import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// 디렉토리 생성
const uploadsDir = path.join(__dirname, 'uploads');
const generatedDir = path.join(__dirname, 'generated');
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(generatedDir, { recursive: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/generated', express.static(generatedDir));
app.use('/uploads', express.static(uploadsDir));

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('이미지 파일만 업로드 가능합니다.'));
  },
});

// 활용컷 프리셋 정의
const USAGE_SHOTS = [
  {
    id: 'profile',
    name: '프로필 사진',
    emoji: '👔',
    desc: '링크드인·이력서용 전문 프로필',
    prompt:
      'Create a professional profile photo using this person as reference. Keep their face identical. Use a simple white, soft gray, beige, or other minimal clean background, or a tidy indoor setting with very low visual clutter. Style them in business formal or business casual attire, allowing natural variation while keeping the result polished and credible. The overall look should feel clean, refined, and professional without being overly stiff.\n\nIDENTITY LOCK:\nThis is the SAME person as in the reference image\nPreserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\nDo not alter face geometry in any way\nNatural skin tone and texture, no over-smoothing\n\nENVIRONMENT: simple white, soft gray, or beige background, or a tidy minimal indoor setting with low visual clutter, soft even natural daylight or gentle indoor light\nPOSE: upper-body portrait, waist-up framing, front-facing or slightly angled natural pose, calm and neat expression\n\nQUALITY: professional portrait photography, shot on full-frame camera, clean detail, natural color grading, sharp focus on face\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered background, too many props, strong backlight, excessive highlights, dramatic shadows, text in image, logo, watermark, over-retouched skin, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'sns',
    name: 'SNS 프로필',
    emoji: '📸',
    desc: '인스타·카카오 프로필용 밝고 친근한 컷',
    prompt:
      'Create a warm and friendly social media profile photo using this person as reference. Keep their face identical. Use casual yet stylish clothing with natural variation. Set the scene in a visually simple environment such as a clean café interior, bright window-side corner, plain wall, or minimal urban setting. The image should feel approachable, soft, and naturally attractive without a busy background.\n\nIDENTITY LOCK:\nThis is the SAME person as in the reference image\nPreserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\nDo not alter face geometry in any way\nNatural skin tone and texture, no over-smoothing\n\nENVIRONMENT: uncluttered café, window-side, tidy indoor space, or minimal city background, soft blur, bright but not harsh natural light\nPOSE: upper-body portrait, waist-up framing, relaxed natural posture, gentle smile or bright expression, subtle pose variation allowed\n\nQUALITY: photo-realistic social profile photography, clean background, natural color grading, sharp focus on face\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered background, too many props, harsh sunlight, excessive glow, dramatic lighting, text in image, logo, watermark, distorted selfie perspective, artificial smile, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'business',
    name: '비즈니스 씬',
    emoji: '💼',
    desc: '사무실·비즈니스 환경 배경',
    prompt:
      'Place this person in a modern business environment. Keep their face identical. Use professional business attire with natural variation. Set the background in a clean modern office, tidy meeting room, bright window-side area, or refined workspace with low visual clutter. If there is a city view, keep it soft and understated rather than visually dominant.\n\nIDENTITY LOCK:\nThis is the SAME person as in the reference image\nPreserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\nDo not alter face geometry in any way\nNatural skin tone and texture, no over-smoothing\n\nENVIRONMENT: tidy modern office, clean meeting space, or bright window-side setting, simple professional background, soft even daylight or gentle indoor light\nPOSE: upper-body portrait, waist-up framing, confident yet approachable posture, natural variation in hand placement and shoulder angle allowed\n\nQUALITY: corporate portrait photography, clean detail, natural color grading, sharp face focus\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered office background, too much decoration, excessive lighting effects, backlight, harsh shadows, text in image, logo, watermark, exaggerated pose, overly editorial styling, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'outdoor',
    name: '야외 라이프스타일',
    emoji: '🌿',
    desc: '공원·야외 자연광 라이프스타일 컷',
    prompt:
      'Create an outdoor lifestyle photo using this person as reference. Keep their face identical. Use casual, comfortable clothing with natural flexibility. Set the background in a simple park, walking path, tree-lined area, or clean outdoor space with natural elements and low visual clutter. Keep the light warm but restrained, with bright soft natural daylight rather than dramatic sunset effects.\n\nIDENTITY LOCK:\nThis is the SAME person as in the reference image\nPreserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\nDo not alter face geometry in any way\nNatural skin tone and texture, no over-smoothing\n\nENVIRONMENT: simple park, grass, trees, or tidy outdoor setting with low visual clutter, soft natural daylight\nPOSE: upper-body portrait, waist-up framing, relaxed and natural posture, soft variation in gaze and expression allowed\n\nQUALITY: lifestyle photography, clean realistic color grading, sharp face detail, restrained lighting\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered natural background, strong backlight, overly intense golden hour light, exaggerated lens flare, text in image, logo, watermark, overly staged pose, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'formal',
    name: '증명사진',
    emoji: '🪪',
    desc: '여권·비자·공식 서류용 증명사진',
    prompt:
      'Create a formal ID or passport photo using this person as reference. Keep their face identical and frontal. Use a plain bright solid-color background appropriate for official documents. Dress them in neat formal attire. The result should be very sharp, evenly lit, and free of shadows or distracting visual elements.\n\nIDENTITY LOCK:\nThis is the SAME person as in the reference image\nPreserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\nDo not alter face geometry in any way\nNatural skin tone and texture, no over-smoothing\n\nENVIRONMENT: plain bright solid-color background, no clutter, even shadow-free lighting\nPOSE: frontal gaze, head-and-shoulders framing, neutral expression, symmetrical neat posture\n\nQUALITY: very sharp and clear ID photo quality, even exposure, clean edges, accurate facial rendering\n\nNEGATIVE: side angle, exaggerated smile, harsh shadow, cluttered background, text, logo, watermark, soft focus, beauty filter look, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'artistic',
    name: '아티스틱',
    emoji: '🎨',
    desc: '패션 매거진·에디토리얼 스타일',
    prompt:
      'Create an artistic editorial fashion photo using this person as reference. Keep their face identical. Use stylish fashion-forward clothing, but keep the background simple and visually clean. The lighting should be refined and soft rather than heavily dramatic. The overall feel should still be editorial, but minimal, elegant, and restrained instead of overly theatrical.\n\nIDENTITY LOCK:\nThis is the SAME person as in the reference image\nPreserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\nDo not alter face geometry in any way\nNatural skin tone and texture, no over-smoothing\n\nENVIRONMENT: minimal stylish background, uncluttered indoor or studio setting, refined soft lighting, restrained color palette\nPOSE: upper-body portrait, waist-up framing, expressive pose allowed, but keep natural body proportions and realistic anatomy\n\nQUALITY: editorial fashion photography, refined detail, realistic skin texture, soft controlled lighting, elegant color grading\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered background, strong dramatic lighting, excessive highlights, exaggerated fashion props, text, logo, watermark, altered face geometry, plastic skin, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'minimal-fashion',
    name: '미니멀 패션 포트레이트',
    emoji: '🖤',
    desc: '심플하고 정제된 패션 에디토리얼',
    prompt:
      'Create a minimal fashion model portrait using this person as reference. Keep their face identical. Style them in modern, refined fashion with a clean silhouette, avoiding anything overly flashy. The overall image should feel like a fashion editorial portrait, while keeping the background and lighting simple, soft, and restrained.\n\nIDENTITY LOCK:\n- This is the SAME person as in the reference image\n- Preserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\n- Do not alter face geometry in any way\n- Natural skin tone and texture, no over-smoothing\n\nENVIRONMENT: simple light gray, warm gray, beige, or other neutral minimal background, tidy studio or indoor mood, low visual clutter, very few distracting objects, soft natural daylight or diffused light without harsh contrast\nPOSE: upper-body portrait, waist-up framing, slightly angled shoulders or subtle head turn, natural fashion-model posture, calm refined expression\n\nQUALITY: fashion portrait photography, shot on full-frame camera, clean detail, restrained color grading, sharp focus on face\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered background, too many props, strong backlight, excessive highlights, dramatic shadows, cinematic lighting, text in image, logo, watermark, signage, graphic elements, exaggerated pose, over-retouched beauty look, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'soft-editorial',
    name: '소프트 에디토리얼 패션 컷',
    emoji: '🌸',
    desc: '우아하고 세련된 소프트 에디토리얼',
    prompt:
      'Create a soft and refined editorial fashion portrait using this person as reference. Keep their face identical. Style them in fashion-forward but understated clothing such as a shirt, sleeveless top, minimal dress, or clean blouse, allowing natural variation. The overall mood should be elegant, polished, and editorial without looking exaggerated.\n\nIDENTITY LOCK:\n- This is the SAME person as in the reference image\n- Preserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\n- Do not alter face geometry in any way\n- Natural skin tone and texture, no over-smoothing\n\nENVIRONMENT: simple indoor background, clean wall, softly lit window-side setting, low visual clutter, gentle even light, minimal props, no distracting details\nPOSE: upper-body portrait, waist-up framing, subtle model pose with slight chin lift or tilt, gaze can be direct or slightly off-camera, relaxed yet refined posture\n\nQUALITY: soft editorial fashion photography, natural skin rendering, sharp facial detail, restrained contrast, elegant texture and fabric detail\n\nNEGATIVE: full body shot, long shot, distant framing, exaggerated fashion props, cluttered background, excessive lighting effects, harsh shadows, strong glow, text in image, logo, watermark, signage, graphic elements, artificial face, plastic skin, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'studio-fashion',
    name: '클린 스튜디오 패션 모델 컷',
    emoji: '🤍',
    desc: '미니멀하고 하이패션한 스튜디오 컷',
    prompt:
      'Create a clean studio-style fashion model portrait using this person as reference. Keep their face identical. Use restrained fashion styling in colors such as black, white, cream, charcoal, or deep navy. Keep the hair and makeup polished but natural. The final image should feel minimal, sharp, and quietly high-fashion.\n\nIDENTITY LOCK:\n- This is the SAME person as in the reference image\n- Preserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\n- Do not alter face geometry in any way\n- Natural skin tone and texture, no over-smoothing\n\nENVIRONMENT: clean studio background, white, gray, beige, or soft neutral wall, minimal background elements, low visual clutter, soft diffused light without harsh contrast\nPOSE: upper-body portrait, waist-up framing, composed model-test posture, natural shoulder and neckline presentation, calm and defined presence\n\nQUALITY: clean fashion studio portrait, sharp focus on face, natural skin texture, elegant restrained color grading\n\nNEGATIVE: full body shot, long shot, distant framing, complex set design, strong colored lighting, exaggerated hair styling, cluttered background, text in image, logo, watermark, signage, graphic elements, excessive beauty retouching, plastic surgery look, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'natural-luxury',
    name: '내추럴 럭셔리 패션 포트레이트',
    emoji: '✨',
    desc: '조용하고 고급스러운 패션 에디토리얼',
    prompt:
      'Create a natural yet luxurious fashion portrait using this person as reference. Keep their face identical. Style them in elevated but understated fashion, such as a minimal dress, refined shirt, structured top, or elegant fabric-focused outfit, with room for natural variation. The overall mood should feel quiet, polished, and fashion-editorial.\n\nIDENTITY LOCK:\n- This is the SAME person as in the reference image\n- Preserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\n- Do not alter face geometry in any way\n- Natural skin tone and texture, no over-smoothing\n\nENVIRONMENT: uncluttered neutral-toned background, minimal indoor space or studio setting, soft refined light, very few distracting elements, simple clean composition\nPOSE: upper-body portrait, waist-up framing, subtle body angle or elegant jawline-emphasizing pose, calm and sophisticated expression\n\nQUALITY: luxury fashion portrait photography, realistic skin and fabric texture, clean elegant color grading, restrained light and sharp detail\n\nNEGATIVE: full body shot, long shot, distant framing, excessive accessories, cluttered background, strong spotlight, too much glow, dramatic shadows, text in image, logo, watermark, signage, graphic elements, exaggerated emotion, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'model-test',
    name: '모델테스트 & 에디토리얼',
    emoji: '📷',
    desc: '모델테스트와 에디토리얼 중간 느낌',
    prompt:
      'Create a fashion portrait that sits between a model test shot and an editorial portrait using this person as reference. Keep their face identical. Use minimal but stylish fashion styling, with enough flexibility so each person can be interpreted naturally. The overall image should feel clean and understated, but more fashion-model-like than a standard profile portrait.\n\nIDENTITY LOCK:\n- This is the SAME person as in the reference image\n- Preserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\n- Do not alter face geometry in any way\n- Natural skin tone and texture, no over-smoothing\n\nENVIRONMENT: simple gray, ivory, beige, or soft neutral background, minimal window-side or studio mood, very limited background information, soft gentle light, no distracting objects\nPOSE: upper-body portrait, waist-up framing, front-facing or 3/4 angle, slight model-like tension with a natural restrained posture, direct gaze or slight off-camera gaze\n\nQUALITY: model portrait photography, between editorial and test-shot aesthetics, clean skin texture, sharp eye detail, controlled color grading\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered background, elaborate fashion set, harsh shadows, excessive contrast, strong backlight, text in image, logo, watermark, signage, graphic elements, heavy beauty filter, unnatural face, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
  {
    id: 'casino-dealer',
    name: '카지노 딜러 복장',
    emoji: '🃏',
    desc: '블랙 베스트 & 화이트 셔츠 패션 포트레이트',
    prompt:
      'Create a fashion portrait of this person wearing a casino dealer-inspired outfit similar to the reference style. Keep their face identical. Dress them in a clean white collared shirt with a fitted black tailored vest, styled in an elegant and polished casino dealer uniform aesthetic. The outfit should look refined, professional, and flattering, with a fashion-portrait mood rather than a literal workplace documentary look.\n\nIDENTITY LOCK:\n- This is the SAME person as in the reference image\n- Preserve all facial features: eye shape, nose bridge width, lip shape, jawline, cheekbone height\n- Do not alter face geometry in any way\n- Natural skin tone and texture, no over-smoothing\n\nENVIRONMENT: simple white, light gray, or soft neutral minimal background, clean indoor setting, very low visual clutter, soft natural daylight or diffused studio light, no distracting props\nPOSE: upper-body portrait, waist-up framing, relaxed upright posture, subtle body angle, hands naturally lowered or lightly posed, calm confident expression, polished fashion-model presence\n\nQUALITY: fashion portrait photography, shot on full-frame camera, clean detail, soft controlled lighting, natural color grading, sharp focus on face and outfit\n\nNEGATIVE: full body shot, long shot, distant framing, cluttered background, casino tables, cards, chips, roulette wheel, strong backlight, excessive highlights, dramatic shadows, text in image, logo, watermark, signage, graphic elements, exaggerated pose, over-retouched skin, uncanny valley, distorted anatomy\n\nResolution: 4K, aspect ratio: 4:5\n\nKeep the overall image clean and understated, similar to the reference mood: simple background, soft controlled light, and the person clearly as the visual focus. Do not include any text or logos anywhere in the image.',
  },
];

// 파일 확장자로 MIME 타입 결정
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

// 단일 활용컷 생성 — 500 에러 시 최대 2회 재시도
async function generateShot(genAI, imagePath, shot, outputPath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString('base64');
  const mimeType = getMimeType(imagePath);

  const fullPrompt = shot.prompt +
    '\n\nEXPRESSION: subtle natural smile, soft and relaxed, not forced or exaggerated. The mouth should be gently closed or very slightly open with a warm, natural smile.';

  const MAX_RETRIES = 2;
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: [
          { text: fullPrompt },
          { inlineData: { data: imageBase64, mimeType } },
        ],
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          const buf = Buffer.from(part.inlineData.data, 'base64');
          fs.writeFileSync(outputPath, buf);
          return;
        }
      }

      const textParts = parts.filter((p) => p.text).map((p) => p.text).join(' ');
      throw new Error(`이미지가 생성되지 않았습니다. 응답: ${textParts.slice(0, 200)}`);
    } catch (err) {
      lastError = err;
      const is500 = err.message?.includes('"code":500') || err.message?.includes('Internal error');
      if (is500 && attempt < MAX_RETRIES) {
        console.log(`[${shot.name}] 500 에러, ${attempt}회 재시도 중...`);
        await new Promise(r => setTimeout(r, 3000 * attempt)); // 3초, 6초 대기
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// API: 활용컷 목록
app.get('/api/shots', (req, res) => {
  res.json(USAGE_SHOTS.map(({ id, name, emoji, desc }) => ({ id, name, emoji, desc })));
});

// API: 이미지 업로드
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '이미지가 없습니다.' });
  res.json({ filename: req.file.filename, url: `/uploads/${req.file.filename}` });
});

// API: 활용컷 생성 (SSE 스트리밍)
app.post('/api/generate', async (req, res) => {
  const { filename, apiKey, selectedShots } = req.body;

  if (!filename || !apiKey) {
    return res.status(400).json({ error: 'filename과 apiKey가 필요합니다.' });
  }

  const imagePath = path.join(uploadsDir, filename);
  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: '업로드된 이미지를 찾을 수 없습니다.' });
  }

  // Server-Sent Events 설정
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // 클라이언트 연결 끊기면 루프 중단 (새로고침/탭 닫기)
  let aborted = false;
  res.on('close', () => { aborted = true; });

  const send = (data) => { if (!aborted) res.write(`data: ${JSON.stringify(data)}\n\n`); };

  try {
    const genAI = new GoogleGenAI({ apiKey });

    const shots = selectedShots?.length
      ? USAGE_SHOTS.filter((s) => selectedShots.includes(s.id))
      : USAGE_SHOTS;

    send({ type: 'status', message: `${shots.length}개 활용컷 생성 시작...` });

    for (const shot of shots) {
      if (aborted) break;  // 연결 끊기면 즉시 중단

      send({ type: 'progress', shotId: shot.id, name: shot.name, emoji: shot.emoji });

      try {
        const outputFilename = `${Date.now()}-${shot.id}.png`;
        const outputPath = path.join(generatedDir, outputFilename);

        await generateShot(genAI, imagePath, shot, outputPath);

        if (aborted) break;  // 생성 완료됐지만 이미 연결 끊김 → 루프 종료

        send({
          type: 'done',
          shotId: shot.id,
          name: shot.name,
          emoji: shot.emoji,
          url: `/generated/${outputFilename}`,
          filename: outputFilename,
        });
      } catch (err) {
        send({ type: 'error', shotId: shot.id, name: shot.name, emoji: shot.emoji, message: err.message });
      }
    }

    send({ type: 'complete' });
  } catch (err) {
    send({ type: 'fatal', message: err.message });
  } finally {
    res.end();
  }
});

// API: 생성된 이미지 삭제
app.delete('/api/generated/:filename', (req, res) => {
  const filePath = path.join(generatedDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ ok: true });
  } else {
    res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🎨 GAI Model 실행 중 → http://localhost:${PORT}\n`);
});
