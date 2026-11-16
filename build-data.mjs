import fs from 'node:fs';import crypto from 'node:crypto';
const path=process.argv[2];if(!path)throw Error('Pass TickLab report.json path');
const raw=fs.readFileSync(path),report=JSON.parse(raw);
const rows=report.replay.map((r,i)=>({id:String(i),time:r.time,labelAvailable:r.label_available,actual:r.actual,p:r.probabilities.boosted_calibrated}));
fs.writeFileSync(new URL('./data.json',import.meta.url),JSON.stringify({source:'TickLab b0d473d754665cc792da95a032f9988dc4f84aab; Binance Vision ETHUSDT Jan 2024',sourceReportSHA256:crypto.createHash('sha256').update(raw).digest('hex'),license:'CC BY-NC-SA 4.0',rows},null,2)+'\n');console.log(`Prepared ${rows.length} forecast records`);
