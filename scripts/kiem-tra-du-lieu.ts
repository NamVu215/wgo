// npm run kiem-tra — checks the data (local CSV or Google Sheets) and prints problems.
import { loadSiteData, formatIssues } from '../src/lib/load.ts';

const data = await loadSiteData();
const errors = data.issues.filter((i) => i.muc === 'loi').length;
const warnings = data.issues.length - errors;

console.log(`\nWGo · kiểm tra dữ liệu`);
console.log(`  ${data.places.length} địa điểm hợp lệ · ${data.dishes.length} món · ${data.kinds.length} loại · ${data.tags.length} tag`);
console.log(`  ${errors} lỗi (dòng bị bỏ qua) · ${warnings} cảnh báo\n`);
if (data.issues.length > 0) console.log(formatIssues(data.issues) + '\n');
process.exitCode = errors > 0 ? 1 : 0;
