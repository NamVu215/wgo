// npm run noi-sheet -- "<link Google Sheet>"
// Finds the gid of each tab (dia-diem, mon, loai, tags) and writes them into src/config.ts.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const TABS = ['dia-diem', 'mon', 'loai', 'tags'] as const;

const link = process.argv[2] ?? '';
const id = /\/spreadsheets\/d\/([a-zA-Z0-9_-]{20,})/.exec(link)?.[1];
if (!id) {
  console.error('Không tìm thấy mã Sheet trong link. Dán link dạng https://docs.google.com/spreadsheets/d/.../edit');
  process.exit(1);
}

const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/htmlview`, { redirect: 'follow' });
const html = await res.text();
if (!res.ok || !/htmlview/.test(res.url)) {
  console.error('Không mở được Sheet. Kiểm tra đã chia sẻ "Bất kỳ ai có đường liên kết" → Người xem chưa.');
  process.exit(1);
}

const gids: Record<string, string> = {};
for (const m of html.matchAll(/name:\s*"((?:[^"\\]|\\.)*)"[^}]*?gid:\s*"(\d+)"/g)) {
  gids[JSON.parse(`"${m[1]}"`)] = m[2];
}
const missing = TABS.filter((t) => !gids[t]);
if (missing.length) {
  console.error(`Thiếu tab: ${missing.join(', ')}. Các tab tìm thấy: ${Object.keys(gids).join(', ') || '(không có)'}`);
  process.exit(1);
}

const configPath = join(process.cwd(), 'src', 'config.ts');
let config = await readFile(configPath, 'utf8');
config = config.replace(/sheetId: '[^']*'/, `sheetId: '${id}'`);
for (const tab of TABS) {
  const key = tab.includes('-') ? `'${tab}'` : tab;
  config = config.replace(new RegExp(`${key}: '[^']*'`), `${key}: '${gids[tab]}'`);
}
await writeFile(configPath, config);
console.log(`Đã nối Sheet ${id}`);
for (const tab of TABS) console.log(`  ${tab.padEnd(9)} gid=${gids[tab]}`);
console.log('Chạy "npm run kiem-tra" để kiểm tra dữ liệu đọc từ Sheet.');
