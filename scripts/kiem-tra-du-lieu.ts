// npm run kiem-tra — checks the data (local CSV or Google Sheets) and prints problems.
// With --ci (GitHub Actions): row errors never block the update (those rows are just hidden),
// but the run fails if almost nothing is left, which protects the site from an emptied or vandalised Sheet.
import { appendFileSync } from 'node:fs';
import { loadSiteData, formatIssues } from '../src/lib/load.ts';

const ci = process.argv.includes('--ci');
const MIN_PLACES = 5;

const data = await loadSiteData();
const errors = data.issues.filter((i) => i.muc === 'loi');
const warnings = data.issues.filter((i) => i.muc === 'canh-bao');

console.log(`\nWGo · kiểm tra dữ liệu`);
console.log(`  ${data.places.length} địa điểm hợp lệ · ${data.dishes.length} món · ${data.kinds.length} loại · ${data.tags.length} tag · ${data.reviews.length} đánh giá cộng đồng`);
console.log(`  ${errors.length} lỗi (dòng bị bỏ qua) · ${warnings.length} cảnh báo\n`);
if (data.issues.length > 0) console.log(formatIssues(data.issues) + '\n');

const tooFew = data.places.length < MIN_PLACES;

if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = [
    '## WGo · kiểm tra dữ liệu',
    '',
    `- **${data.places.length}** địa điểm hợp lệ · **${data.reviews.length}** đánh giá cộng đồng đã duyệt`,
    `- **${errors.length}** dòng lỗi (bị ẩn khỏi web) · **${warnings.length}** cảnh báo`,
    '',
  ];
  if (tooFew) lines.push(`> ❌ Chỉ còn ${data.places.length} địa điểm hợp lệ (tối thiểu ${MIN_PLACES}). **Không cập nhật web** để giữ bản cũ. Kiểm tra lại Google Sheet.`, '');
  if (data.issues.length) {
    lines.push('| Mức | Dòng | id | Nội dung |', '|---|---|---|---|');
    for (const i of data.issues) lines.push(`| ${i.muc === 'loi' ? '❌ Lỗi' : '⚠️ Cảnh báo'} | ${i.dong} | ${i.id || '–'} | ${i.noiDung.replace(/\|/g, '/')} |`);
  }
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
}

if (ci) {
  if (tooFew) console.error(`Chỉ còn ${data.places.length} địa điểm hợp lệ, dừng cập nhật để giữ web cũ.`);
  process.exitCode = tooFew ? 1 : 0;
} else {
  process.exitCode = errors.length > 0 ? 1 : 0;
}
