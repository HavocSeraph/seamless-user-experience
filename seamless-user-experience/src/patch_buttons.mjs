import fs from 'fs';
import path from 'path';

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Check if useToast is imported
    const hasUseToastImport = content.includes('useToast');
    const toastImportRegex = /import\s+\{\s*useToast\s*\}\s+from\s+["']@\/components\/ui\/use-toast["']\s*;/;
    const hooksImportRegex = /import\s+\{\s*useToast\s*\}\s+from\s+["']@\/hooks\/use-toast["']\s*;/;
    
    // We will check whether hook or components path uses use-toast.
    // typically it's @/components/ui/use-toast or @/hooks/use-toast
    let targetImport = 'import { useToast } from "@/components/ui/use-toast";';
    if(fs.existsSync(path.join(process.cwd(), 'hooks', 'use-toast.ts'))){
        targetImport = 'import { useToast } from "@/hooks/use-toast";';
    }

    if (!hasUseToastImport) {
        // Find last import
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLastImport = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLastImport + 1) + targetImport + '\n' + content.slice(endOfLastImport + 1);
            changed = true;
        }
    }

    // Insert const { toast } = useToast(); inside component body
    // This is tricky, we'll try to find the main component declaration
    // Matches: export default function ComponentName() {
    // Or: const ComponentName = () => {
    let hasToastHook = content.includes('const { toast } = useToast()');
    if (!hasToastHook) {
        const compRegex = /(?:export\s+default\s+function|const)\s+([A-Z][a-zA-Z0-9_]*)\s*(?:=\s*\([^)]*\)\s*=>\s*|\([^)]*\)\s*\{\s*)/;
        const compMatch = content.match(compRegex);
        if (compMatch) {
            const insertPos = compMatch.index + compMatch[0].length;
            if (content[insertPos - 1] === '{' || content.slice(insertPos - 5, insertPos).includes('{')) {
                 content = content.slice(0, insertPos) + '\n  const { toast } = useToast();\n' + content.slice(insertPos);
                 changed = true;
            }
        }
    }

    // Now replace buttons without onClick
    // Watch out: only button tags <Button ...>
    const buttonRegex = /<Button([^>]*)>/g;
    content = content.replace(buttonRegex, (match, attrs) => {
        if (!attrs.includes('onClick') && !attrs.includes('type="submit"') && !attrs.includes('asChild')) {
            // Find text content after > to use as name if possible
            return <Button onClick={() => toast({ title: 'Feature Unavailable', description: 'This action is currently in development before production launch.' })}>;
        }
        return match;
    });

    if (content !== fs.readFileSync(filePath, 'utf8')) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Patched:", filePath);
    }
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    });
}

walk(path.join(process.cwd(), 'pages'));
walk(path.join(process.cwd(), 'components'));
